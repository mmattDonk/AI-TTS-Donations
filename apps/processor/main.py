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
import httpx
import pusher
from API.fakeyou import Fakeyou
from API.uberduck import Uberduck
from dotenv import load_dotenv
from google.cloud import storage
from pedalboard import Pedalboard  # type: ignore
from pedalboard import (
    Chorus,
    Distortion,
    Gain,
    HighpassFilter,
    Limiter,
    LowpassFilter,
    PitchShift,
    Resample,
    Reverb,
)
from pedalboard.io import AudioFile
from pydub import AudioSegment
from rich.logging import RichHandler

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

# log.debug(playsounds)

# with open("config.json", "r") as f:
#     config = json.load(f)
load_dotenv()
pusher_client = pusher.Pusher(
    app_id=os.getenv("PUSHER_APP_ID"),
    key=os.getenv("PUSHER_KEY"),
    secret=os.getenv("PUSHER_SECRET"),
    cluster=os.getenv("PUSHER_CLUSTER"),
)


def request_tts(
    message: str, config: dict, failed: Optional[bool] = False, overlayId: str = ""  # type: ignore
):
    messages: list = message.split("||")
    log.debug(messages)
    q = queue.Queue()
    voice_files: list = []
    for message in messages:
        date_string: str = datetime.now().strftime("%d%m%Y%H%M%S")
        for i in config["blacklistedWords"]:
            if i.lower() in message.lower():
                log.info("Blacklisted word found")
                return

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
            voice: str = message.split(": ")[0]  # type: ignore
            try:
                if voice.lower() in config["blacklistedVoices"]:  # type: ignore
                    log.info(f"{voice} is blacklisted, applying fallback voice.")
                    try:
                        voice = config["fallbackVoice"]
                    except Exception:
                        voice = "kanye-west-rap"  # type: ignore
            except Exception:
                pass
            log.debug(voice)
            text: str = message.split(": ")[1]
            log.debug(text)
        except IndexError:
            text: str = message
        voice: list = voice.split(".")  # type: ignore
        voice_name: str = voice[0]
        try:
            voice_effect: str = voice[1:]  # type: ignore
        except IndexError:
            voice_effect = None  # type: ignore
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
        job_response: dict = tts_provider.get_job(text, voice_name)  # type: ignore
        log.debug(job_response)
        if (
            job_response["detail"] != None
            and job_response["detail"] == "That voice does not exist"
        ):
            fallback_voice: str = config["fallbackVoice"]
            if fallback_voice is None:
                fallback_voice = "kanye-west-rap"
            log.info(
                "Couldn't find voice specified, using fallback voice: " + fallback_voice
            )

            job_response: dict = Uberduck.get_job(text, fallback_voice)  # type: ignore
        if job_response["uuid"] is not None:
            log.info("UUID recieved. Waiting for TTS to process")
            checkCount: int = 0
            waitingToProcess: bool = True
            while waitingToProcess:
                checkCount += 1
                check_tts_response: dict = tts_provider.check_tts(job_response["uuid"])  # type: ignore
                log.debug(check_tts_response)
                if check_tts_response["path"] != None:
                    log.info(f"TTS processed after {checkCount} checks")

                    urllib.request.urlretrieve(
                        check_tts_response["path"],
                        f"./voice_files/AI_voice_{date_string}.wav",
                    )

                    if voice_effect:
                        with AudioFile(f"./voice_files/AI_voice_{date_string}.wav", "r") as f:  # type: ignore
                            audio = f.read(f.frames)
                            samplerate = f.samplerate

                        board = Pedalboard([])
                        for effect in voice_effect:
                            if effect.lower() in VOICE_EFFECTS:
                                log.info(f"Applying {effect} effect")
                                if type(VOICE_EFFECTS[effect]) == list:
                                    for effect_func in VOICE_EFFECTS[effect]:  # type: ignore
                                        board.append(effect_func)
                                else:
                                    board.append(VOICE_EFFECTS[effect])

                        effected = board(audio, samplerate)

                        with AudioFile(f"./voice_files/AI_voice_{date_string}.wav", "w", samplerate, effected.shape[0]) as f:  # type: ignore
                            f.write(effected)

                        for effect in voice_effect:
                            if effect.lower() in VOICE_EFFECTS and effect == "loud":
                                board.append(Gain(gain_db=-15))
                                effected = board(effected, samplerate)
                                with AudioFile(f"./voice_files/AI_voice_{date_string}.wav", "w", samplerate, effected.shape[0]) as f:  # type: ignore
                                    f.write(effected)

                    time.sleep(1)
                    voice_files.append(f"./voice_files/AI_voice_{date_string}.wav")
                    time.sleep(1)
                    waitingToProcess = False
                elif check_tts_response["failed_at"] != None:
                    log.info("TTS request failed, trying again.")
                    waitingToProcess = False
                    request_tts(message=message, config=config, failed=True)
                    time.sleep(2)
                elif checkCount > 100:
                    log.info(
                        f"Failed to recieve a processed TTS after {checkCount} checks. Giving up."
                    )

                    waitingToProcess = False
                    time.sleep(5)
                else:
                    log.info(
                        f"Waiting for TTS to finish processing. {checkCount}/100 checks"
                    )

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

        global public_url
        public_url = blob.public_url
        print(f"Public URL: {public_url}")
        print(f"Message: {message}")
        return {"success": True, "message": message, "audioUrl": blob.public_url}

    t = threading.Thread(target=thread_function)
    t.start()
    for voice_file in voice_files:
        q.put(voice_file)
        time.sleep(1)
    t.join()

    return {"success": True, "message": message, "audioUrl": public_url}


log.info("ready.")


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
    API_URL = ""
    API_SECRET = ""
    request_json = request.get_json(silent=True)
    token = request.headers.get("Authorization")

    if token is None or token.split(" ")[1] != os.environ.get("API_SECRET"):
        return {"success": False, "message": "Invalid token"}

    print(request_json)
    request_message = request_json["message"]
    request_message = re.sub(
        CHEER_REGEX,
        "",
        request_message,
    )
    if os.environ.get("API_URL") is None:
        API_URL = "http://localhost:3000"
    else:
        API_URL = os.environ.get("API_URL")

    if os.environ.get("API_SECRET") is None:
        API_SECRET = "secret"
    else:
        API_SECRET = os.environ.get("API_SECRET")

    headers = {
        "secret": API_SECRET,
    }

    overlay_id = request_json["overlayId"]
    configRequest = httpx.get(
        f"{API_URL}/api/streamers/overlayId/{overlay_id}", headers=headers
    ).json()

    config = configRequest["streamer"]["config"][0]

    response = request_tts(
        message=request_message, failed=False, overlayId=overlay_id, config=config
    )

    print("Pushing " + response["audioUrl"] + " to " + " overlay " + overlay_id)
    print("This was the request json", request_json)
    pusher_client.trigger(overlay_id, "new-file", {"file": response["audioUrl"]})
    print("Push complete.")

    httpx.post(
        f"{API_URL}/api/streamers/overlayId/{overlay_id}",
        data={
            "audioUrl": response["audioUrl"],
            "message": request_message,
        },
        headers=headers,  # type: ignore
    )

    return {"response": response}
