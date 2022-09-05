#!/usr/bin/env python
# -*- coding: utf-8 -*-

import contextlib
import json
import logging
import os
import queue
import re
import sys
import threading
import time
import urllib.request
from datetime import datetime
from typing import Optional

import sentry_sdk
import simpleaudio
import soundfile as sf
from dotenv import load_dotenv
from pedalboard import (Chorus, Distortion, Gain, HighpassFilter, Limiter,
                        LowpassFilter, Pedalboard, PitchShift, Resample,
                        Reverb)
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

sentry_sdk.init(
    dsn="https://5f3066b9247248749b2f133bd672eb7d@o1284007.ingest.sentry.io/6494525",
    traces_sample_rate=1.0,
)

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

log_level = logging.DEBUG if "dev" in sys.argv else logging.INFO

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

with open("config.json", "r") as f:
    config = json.load(f)
load_dotenv()

def request_tts(message: str, failed: Optional[bool] = False) -> None:
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
            try:
                if voice in config["BLACKLISTED_VOICES"]:
                    log.info(f"{voice} is blacklisted, applying fallback voice.")
                    try:
                        voice = config["FALLBACK_VOICE"]
                    except Exception:
                        voice = "kanye-west-rap"
            except Exception:
                pass
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
        try:
            voice_name = config["VOICE_ALIASES"][voice_name]
        except KeyError:
            voice_name = voice_name
        if voice_name.startswith("TM:"):
            tts_provider = Fakeyou
        else:
            tts_provider = Uberduck
            voice_name.lower()
        job_response: dict = tts_provider.get_job(text, voice_name)
        log.debug(job_response)
        if job_response["detail"] != None and job_response["detail"] == "That voice does not exist":
            try:
                fallback_voice: str = config["FALLBACK_VOICE"]
            except Exception:
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
                        audio, sample_rate = sf.read(f"./voice_files/AI_voice_{date_string}.wav")
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
                        sf.write(f"./voice_files/AI_voice_{date_string}.wav", effected, sample_rate)
                        for effect in voice_effect:
                            if effect.lower() in VOICE_EFFECTS and effect == "loud":
                                board.append(Gain(gain_db=-15))
                                effected = board(audio, sample_rate)
                                log.debug("?")
                                sf.write(f"./voice_files/AI_voice_{date_string}.wav", effected, sample_rate)
                    time.sleep(1)
                    voice_files.append(f"./voice_files/AI_voice_{date_string}.wav")
                    time.sleep(1)
                    waitingToProcess = False
                elif check_tts_response["failed_at"] != None:
                    log.info("TTS request failed, trying again.")
                    waitingToProcess = False
                    request_tts(message=message, failed=True)
                    time.sleep(2)
                elif checkCount > config["QUERY_TRIES"]:
                    log.info(f"Failed to recieve a processed TTS after {checkCount} checks. Giving up.")

                    waitingToProcess = False
                    time.sleep(5)
                else:
                    log.info(f"Waiting for TTS to finish processing. {checkCount}/{config['QUERY_TRIES']} checks")

                    if not failed:
                        time.sleep(1)
                    else:
                        time.sleep(2)
    def thread_function():
        for _ in voice_files:
            sound = q.get()
            if sound is None:
                return
            sound_obj = simpleaudio.WaveObject.from_wave_file(sound)
            play_obj = sound_obj.play()
            play_obj.wait_done()
            if "./playsounds" not in sound:
                with contextlib.suppress(FileNotFoundError):
                    os.remove(sound)

    if __name__ == "__main__":
        t = threading.Thread(target=thread_function)
        t.start()
        for voice_file in voice_files:
            q.put(voice_file)
            time.sleep(1)
        t.join()

def test_tts() -> None:
    log.info("Testing TTS")
    if not message:
        return
    message = re.sub(
        CHEER_REGEX,
        "",
        message,
    )

    for i in config["BLACKLISTED_WORDS"]:
        if i in message.lower():
            log.info("Blacklisted word found")
            return

    request_tts(message=message, failed=False)
