#!/usr/bin/env python
# -*- coding: utf-8 -*-

import logging
import os
import queue
import re
import threading
import time
import urllib.request
from datetime import datetime
from typing import Optional

import functions_framework
import pusher
from dotenv import load_dotenv
from google.cloud import storage
from pedalboard import (Chorus, Distortion, Gain, HighpassFilter, Limiter,
                        LowpassFilter, Pedalboard, PitchShift, Resample,
                        Reverb)
from pedalboard.io import AudioFile
from pydub import AudioSegment
from rich.logging import RichHandler

from API.fakeyou import Fakeyou
from API.uberduck import Uberduck

CHEER_REGEX: str = r"(?i)(cheer(?:whal)?|doodlecheer|biblethump|corgo|uni|showlove|party|seemsgood|pride|kappa|frankerz|heyguys|dansgame|elegiggle|trihard|kreygasm|4head|swiftrage|notlikethis|vohiyo|pjsalt|mrdestructoid|bday|ripcheer|shamrock|streamlabs|bitboss|muxy|anon)\d*"

VOICE_EFFECTS: dict = {
    "reverb": Reverb(room_size=0.50),
    "pitchup": PitchShift(semitones=5),
    "pitchdown": PitchShift(semitones=-5),
    "loud": [Distortion(), Limiter()],
    "android": [Resample(target_sample_rate=5000), Gain(gain_db=5)],
    "autotune": Chorus(),
    "phone": [HighpassFilter(cutoff_frequency_hz=8000), Gain(gain_db=10)],
    "muffled": [LowpassFilter(cutoff_frequency_hz=100), Gain(gain_db=16)],
}

# sentry_sdk.init(
#     dsn="https://5f3066b9247248749b2f133bd672eb7d@o1284007.ingest.sentry.io/6494525",
#     traces_sample_rate=1.0,
# )

def path_exists(filename: str):
    return os.path.join(".", f"{filename}")

if not os.path.exists("playsounds"):
    os.makedirs("playsounds")

    if not os.path.exists(path_exists("./playsounds/README.md")):
        with open("./playsounds/README.md", "w") as readme:
            readme.write(
                "# This is where the play sounds are stored!"
                + "\n## **DO NOT** REMOVE ANY SOUNDS FROM THIS FOLDER!"
                + "\nThis is used for the play sound functionality in the bot, things like (1) or (2). Don't remove any files from here as it could cause the functionality to not work, and in turn, the bot to not work."
            )

log_level = logging.DEBUG

log: logging.Logger = logging.getLogger()

logging.basicConfig(
    level=log_level,
    format="%(name)s - %(message)s",
    datefmt="%X",
    handlers=[RichHandler()],
)

# array of the playsounds.
playsounds: list = []
# sourcery skip: list-comprehension
playsounds.extend(file for file in os.listdir("playsounds") if file.endswith(".wav"))

playsounds.sort(
    key=lambda test_string: list(map(int, re.findall(r"\d+", test_string)))[0]
)

log.debug(playsounds)

# with open("config.json", "r") as f:
#     config = json.load(f)
load_dotenv()
pusher_client = pusher.Pusher(
    app_id=os.getenv("PUSHER_APP_ID"),
    key=os.getenv("PUSHER_KEY"),
    secret=os.getenv("PUSHER_SECRET"),
    cluster=os.getenv("PUSHER_CLUSTER"),
)

def request_tts(message: str, failed: Optional[bool] = False, overlayId: str = "") -> None:
    messages: list = message.split("||")
    log.debug(messages)
    q = queue.Queue()
    voice_files: list = []
    for message in messages:
        log.debug(f"`{message}`")
        if message[0] == " ":
            message: str = message[1:]
            log.debug(f"`{message}`")
        message = message.strip()
        playsound = re.match("^\(\d+\)$", message)
        if playsound:
            i = int(playsound.group()[1:-1]) - 1
            log.debug(i)
            if i < 0 or i > len(playsounds) - 1:
                log.info(f"sound {i} does not exist. it will not be played.")
                continue
            else:
                voice_files.append(f"./playsounds/{playsounds[i]}")
                log.debug(playsounds[i])
                continue
        if message == ",":
            continue
        try:
            log.debug(message.split(": "))
            voice: str = message.split(": ")[0]
            # try:
            #     if voice in config["BLACKLISTED_VOICES"]:
            #         log.info(f"{voice} is blacklisted, applying fallback voice.")
            #         try:
            #             voice = config["FALLBACK_VOICE"]
            #         except Exception:
            #             voice = "kanye-west-rap"
            # except Exception:
            #     pass
            log.debug(voice)
            text: str = message.split(": ")[1]
            log.debug(text)
        except IndexError:
            text: str = message
        voice: list = voice.split(".")
        voice_name: str = voice[0]
        try:
            voice_effect: str = voice[1:]
        except IndexError:
            voice_effect = None
        log.debug(f"voice effect: {str(voice_effect)}")
        log.debug(f"voice: {voice_name}")
        log.debug(f"voice var: {voice}")
        tts_provider = None
        # try:
        #     voice_name = config["VOICE_ALIASES"][voice_name]
        # except KeyError:
        #     voice_name = voice_name
        if voice_name.startswith("TM:"):
            tts_provider = Fakeyou
        else:
            tts_provider = Uberduck
            voice_name.lower()
        job_response: dict = tts_provider.get_job(text, voice_name)
        log.debug(job_response)
        if job_response["detail"] != None and job_response["detail"] == "That voice does not exist":
            # try:
            #     fallback_voice: str = config["FALLBACK_VOICE"]
            # except Exception:
            fallback_voice: str = "kanye-west-rap"
            log.info("Couldn't find voice specified, using fallback voice: " + fallback_voice)

            job_response: dict = Uberduck.get_job(text, fallback_voice)
        if job_response["uuid"] is not None:
            log.info("UUID recieved. Waiting for TTS to process")
            checkCount: int = 0
            waitingToProcess: bool = True
            while waitingToProcess:
                checkCount += 1
                check_tts_response: dict = tts_provider.check_tts(job_response["uuid"])
                log.debug(check_tts_response)
                if check_tts_response["path"] != None:
                    log.info(f"TTS processed after {checkCount} checks")
                    date_string: str = datetime.now().strftime("%d%m%Y%H%M%S")
                    urllib.request.urlretrieve(check_tts_response["path"], f"./voice_files/AI_voice_{date_string}.wav")

                    if voice_effect:
                        with AudioFile(f"./voice_files/AI_voice_{date_string}.wav") as f:
                            audio = f.read()
                            sample_rate = f.samplerate
                            board = Pedalboard([])
                            for effect in voice_effect:
                                if effect.lower() in VOICE_EFFECTS:
                                    log.info(f"Voice Effect Detected: {effect}")
                                    if type(VOICE_EFFECTS[effect]) == list:
                                        for effect_func in VOICE_EFFECTS[effect]:
                                            board.append(effect_func)
                                    else:
                                        board.append(VOICE_EFFECTS[effect])
                            effected = board(audio, sample_rate)
                            with AudioFile(f"./voice_files/AI_voice_{date_string}.wav", "w") as f:
                                f.write(effected, sample_rate)
                            for effect in voice_effect:
                                if effect.lower() in VOICE_EFFECTS and effect == "loud":
                                    board.append(Gain(gain_db=-15))
                                    effected = board(audio, sample_rate)
                                    log.debug("?")
                                    with AudioFile(f"./voice_files/AI_voice_{date_string}.wav", "w") as f:
                                        f.write(effected, sample_rate)
                    time.sleep(1)
                    voice_files.append(f"./voice_files/AI_voice_{date_string}.wav")
                    time.sleep(1)
                    waitingToProcess = False
                elif check_tts_response["failed_at"] != None:
                    log.info("TTS request failed, trying again.")
                    waitingToProcess = False
                    request_tts(message=message, failed=True)
                    time.sleep(2)
                elif checkCount > 100:
                    log.info(f"Failed to recieve a processed TTS after {checkCount} checks. Giving up.")

                    waitingToProcess = False
                    time.sleep(5)
                else:
                    log.info(f"Waiting for TTS to finish processing. {checkCount}/100 checks")

                    if not failed:
                        time.sleep(1)
                    else:
                        time.sleep(2)
    def thread_function():
        final_file = AudioSegment.empty()
        log.info("Starting to merge files (this section might take a bit...)")
        for _ in voice_files:
            sound = q.get()
            # if sound is None:
            #     return
            sound_obj = AudioSegment.from_file(sound)
            final_file += sound_obj

        log.info("Merging files done. Writing to file.")

        final_file_name = f"./voice_files/{date_string}_final_file.wav"
        final_file.export(final_file_name, format="wav")

        storage_client = storage.Client()
        bucket = storage_client.bucket("solrock-files")
        blob = bucket.blob(f"voice_files/{date_string}_final_file.wav")

        blob.upload_from_filename(final_file_name)

        pusher_client.trigger(overlayId, 'new-file', {
            'file': blob.public_url
        })
        return "success!"

    t = threading.Thread(target=thread_function)
    t.start()
    for voice_file in voice_files:
        q.put(voice_file)
        time.sleep(1)
    t.join()

    # for i in config["BLACKLISTED_WORDS"]:
    #     if i in message.lower():
    #         log.info("Blacklisted word found")
    #         return

@functions_framework.http
def hello_http(request):
    """HTTP Cloud Function.
   Args:
       request (flask.Request): The request object.
       <https://flask.palletsprojects.com/en/1.1.x/api/#incoming-request-data>
   Returns:
       The response text, or any set of values that can be turned into a
       Response object using `make_response`
       <https://flask.palletsprojects.com/en/1.1.x/api/#flask.make_response>.
   """
    request_json = request.get_json(silent=True)
    message = request_json["message"]
    message = re.sub(
        CHEER_REGEX,
        "",
        message,
    )

    overlayId = request_json["overlayId"]

    # prisma = Prisma()
    # prisma.connect()

    # streamer = prisma.streamer.find_first(where={
    #     "overlayId": overlayId
    # }, include={
    #     "user": True,
    # })

    # prisma.disconnect()
    response = request_tts(message, False, overlayId)

    return {"response": response}
