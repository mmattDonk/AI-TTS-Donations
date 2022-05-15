#!/usr/bin/env python
# -*- coding: utf-8 -*-

import asyncio
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
from pathlib import Path
from tkinter import Button, Canvas, Entry, PhotoImage, Tk
from typing import Optional
from uuid import UUID
from pydub import AudioSegment

import httpx
import nest_asyncio
import simpleaudio
import socketio
import soundfile as sf
from dotenv import load_dotenv
from pedalboard import (
    Chorus,
    Distortion,
    Gain,
    HighpassFilter,
    Limiter,
    LowpassFilter,
    Pedalboard,
    PitchShift,
    Resample,
    Reverb,
)
from rich.logging import RichHandler
from twitchAPI.oauth import UserAuthenticator
from twitchAPI.pubsub import PubSub
from twitchAPI.twitch import Twitch
from twitchAPI.types import AuthScope


from API.fakeyou import Fakeyou
from API.uberduck import Uberduck

VERSION: str = "3.2.0"

JS_STRING: str = """<meta http-equiv="refresh" content="1">"""
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


def path_exists(filename: str):
    return os.path.join(".", f"{filename}")


def reset_overlay() -> None:
    with open("./overlay/index.html", "w") as html:
        html_code = f"""<head>
        {JS_STRING}
        <link rel="stylesheet" href="style.css">
        </head>"""

        html.write(html_code)


# TODO: Put these checks in a different file, they are just bugging me madge
if not os.path.exists(path_exists("./overlay/index.html")):
    reset_overlay()

if not os.path.exists(path_exists(".env")):
    input(
        "\n\nYou are missing the required `.env` file required to run this program."
        + "\nPlease feel free to check out the guide in the README.md file (or on the GitHub Repo)"
        + "\nYour file might also be misnamed, please make sure your `.env` file is named `.env` and not `env.txt` or `env`."
        "\n\nPress enter to exit"
    )
    exit()

if not os.path.exists(path_exists("config.json")):
    input(
        "\n\nYou are missing the required `config.json` file required to run this program."
        + "\nPlease feel free to checkout the guide in the README.md file (or on the GitHub Repo)"
        + "\nYour file might also be misnamed, please make sure your `config.json` file is named `config.json` and not `config.txt` or `config`."
        + "\n\nPress enter to exit"
    )
    exit()


if not os.path.exists("voice_files"):
    os.makedirs("voice_files")

    if not os.path.exists(path_exists("./voice_files/README.md")):
        with open("./voice_files/README.md", "w") as readme:
            readme.write(
                "# This is where the voice files that get downloaded from Uberduck get stored!"
                + "\n## This folder should usually be empty, but if it isn't, don't worry about it."
                + "\nYou can delete files after they are done playing on your stream manually if you'd like. The files should be automatically deleted after being played, but sometimes that might not happen if there was a bug. The bot only plays the file once, so it isn't used after that."
            )

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

sio = socketio.Client(logger=log)

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


def post_version_number(twitch_id: int, version: str) -> bool:
    """
    Posts the version number to mmatt's API for use in the Twitch Extension.

    :param twitch_id: The Twitch ID to be used in teh request
    :param version: What version to update in the databse
    :return: If the request was successful

    Returns:
    --------
    return True or False
    """

    response = httpx.post(
        f"https://api.mmatt.net/ttsapi/version/{twitch_id}/{version}",
        json={"apiKey": os.environ.get("MM_API_KEY")},
    )

    return response.status_code == 200


def request_tts(message: str, failed: Optional[bool] = False) -> None:
    # sourcery no-metrics

    messages: list = message.split("||")
    voice_files: list = []
    date_string: str = datetime.now().strftime("%d%m%Y%H%M%S")

    log.debug(messages)

    q = queue.Queue()

    for message in messages:
        log.debug(f"`{message}`")
        if message[0] == " ":
            message: str = message[1:]
            log.debug(f"`{message}`")

        message = message.strip()  ## cleaning up whitespace

        # ----------- Playsounds -----------

        playsound = re.match(r"^\(\d+\)$", message)

        if playsound:
            i = int(playsound.group()[1:-1]) - 1  # sound 1 = index 0
            log.debug(i)

            if i < 0 or i > (len(playsounds) - 1):
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

            if voice in config["BLACKLISTED_VOICES"]:
                log.info(f"{voice} is blacklisted, applying fallback voice.")

                # There has GOT to be a better way to do optional arguments in the config.json without
                # - using a try/excpet: maybe I'll do a `config.py` file to load the config.json
                # - and then returns a dictionary (or a class?) with all the data. I don't know,
                # - if you see this and know how to do that or know what I want you can go right
                # - ahead, if I get around to it and this comment is still here then just make an issue
                # - with these comments highlighted and "Mock" as the title.
                # ⣿⣿⣿⣿⡿⠋⣁⣤⣴⣶⣶⣶⣤⣌⡙⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
                # ⣿⣿⡿⢃⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡈⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
                # ⣿⡟⢠⣾⣿⣿⣿⣿⣿⠏⣉⣙⣿⣿⠿⢿⣿⣀⠙⣿⣿⣿⣿⣿⡿⠛⠛⠛⢿
                # ⡟⢠⣿⣿⣿⡟⣡⣤⣿⣿⣿⣿⣿⢟⠁⢰⣽⣿⡃⠘⠛⣉⠙⠁⣴⣾⣿⣿⡆
                # ⢁⣼⣿⣿⣿⣷⣿⣿⣿⣿⣿⣻⣵⡏⠄⢈⣿⣿⣧⣠⣾⣿⣿⣔⣿⣿⣿⣿⡇
                # ⢸⣿⣿⡍⠛⣿⣿⣿⣿⣿⣿⡿⠟⠄⠄⢸⣿⣿⣷⣿⣿⣿⣿⣻⣝⣻⡿⠋⣴
                # ⢸⣿⣿⣿⡀⠈⠛⠛⠛⠛⠉⠄⠄⠄⠄⣸⣿⣿⣿⣿⣯⣿⣿⣿⣿⣿⣿⠄⣿
                # ⢸⣿⣿⣿⣷⡀⠄⠄⠄⠄⠄⠄⣀⠄⢰⣿⣿⣿⣯⣿⣿⣿⣿⣿⣿⢿⣧⢸⣿
                # ⠸⣿⣿⣿⣿⣦⣾⣷⠄⠰⠖⠄⠄⣴⣿⣿⣿⣿⣿⣿⣿⣾⣿⣿⣾⣿⠏⣼⣿
                # ⡄⢻⣿⢻⣿⣿⣿⢕⣴⣶⡤⣴⣿⣿⣿⣿⣿⣿⣿⡟⢀⣉⠛⠿⠛⣁⣼⣿⣿
                # ⡗⢨⣭⡼⣿⣿⣿⣼⣿⣫⣾⣿⣿⣿⣿⣿⣿⣿⡿⢁⣾⣿⣿⣶⣿⣿⣿⣿⣿
                # ⣧⠙⠛⠿⣿⣿⣿⣿⡏⣿⣿⣿⣿⣿⣿⣿⣿⡿⢁⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿
                # ⣿⣿⣾⣦⠘⢿⣿⣿⣻⣿⣿⣿⣿⣿⣿⡿⠋⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
                # ⣿⣿⣿⣿⣷⣤⣈⠐⠻⠿⠿⠿⠟⠛⣉⣤⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿

                try:
                    voice = config["FALLBACK_VOICE"]
                except:
                    voice = "kanye-west-rap"

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

        log.debug("voice effect: " + str(voice_effect))
        log.debug("voice: " + voice_name)
        log.debug("voice var: " + str(voice))

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

        if job_response["detail"] != None:
            if job_response["detail"] == "That voice does not exist":
                try:
                    fallback_voice: str = config["FALLBACK_VOICE"]
                except:
                    fallback_voice: str = "kanye-west-rap"

                log.info(
                    "Couldn't find voice specified, using fallback voice: "
                    + fallback_voice
                )
                job_response: dict = Uberduck.get_job(text, fallback_voice)

        if job_response["uuid"] is not None:
            log.info("UUID recieved. Waiting for TTS to process")
            checkCount: int = 0
            waitingToProcess: bool = True
            while waitingToProcess:
                checkCount += 1
                with open("./overlay/index.html", "w") as html:
                    html_code = f"""<html>
                        <head>
                        {JS_STRING}
                        <link rel="stylesheet" href="style.css">
                        </head>
                        <body>
                            <div class="box">
                                <h1>New TTS Request:</h1>
                                <h2>Voice: {", ".join(voice)}</h2>
                                <h2>{checkCount}/{config["QUERY_TRIES"]} checks</h2>
                            </div>
                        </body>
                        </html>"""

                    html.write(html_code)

                check_tts_response: dict = tts_provider.check_tts(job_response["uuid"])

                log.debug(check_tts_response)
                if check_tts_response["path"] != None:
                    log.info(f"TTS processed after {checkCount} checks")
                    urllib.request.urlretrieve(
                        check_tts_response["path"],
                        f"./voice_files/AI_voice_{date_string}.wav",
                    )
                    reset_overlay()

                    if voice_effect:
                        audio, sample_rate = sf.read(
                            f"./voice_files/AI_voice_{date_string}.wav"
                        )
                        board = Pedalboard([])

                        for effect in voice_effect:
                            if effect.lower() in VOICE_EFFECTS:
                                log.info("Voice Effect Detected: " + effect)
                                if type(VOICE_EFFECTS[effect]) == list:
                                    for effect_func in VOICE_EFFECTS[effect]:
                                        board.append(effect_func)
                                else:
                                    board.append(VOICE_EFFECTS[effect])
                            else:
                                pass

                        effected = board(audio, sample_rate)
                        sf.write(
                            f"./voice_files/AI_voice_{date_string}.wav",
                            effected,
                            sample_rate,
                        )

                        for effect in voice_effect:
                            if effect.lower() in VOICE_EFFECTS:
                                if effect == "loud":
                                    # Making the "loud" effect quieter because it's too loud.
                                    # If anyone knows how to work a limiter or a compressor you can edit the VOICE_EFFECTS if you want :p
                                    # Also there is probably a way to make this work in the loop above, but idk.
                                    # So if anyone wants to take a shot at that, then go ahead
                                    # I love free labor / code
                                    # FeelsGoodMan

                                    board.append(Gain(gain_db=-15))

                                    effected = board(audio, sample_rate)
                                    sf.write(
                                        f"./voice_files/AI_voice_{date_string}.wav",
                                        effected,
                                        sample_rate,
                                    )
                                else:
                                    pass
                            else:
                                pass

                    else:
                        pass

                    time.sleep(1)
                    voice_files.append(f"./voice_files/AI_voice_{date_string}.wav")
                    time.sleep(1)
                    waitingToProcess = False

                elif check_tts_response["failed_at"] != None:
                    log.info("TTS request failed, trying again.")
                    waitingToProcess = False
                    request_tts(message=message, failed=True)

                    with open("./overlay/index.html", "w") as html:

                        html_code = f"""<html>
                                            <head>
                                            {JS_STRING}
                                            <link rel="stylesheet" href="style.css">
                                            </head>
                                            <body>
                                                <div class="box">
                                                    <h1 style="color: red">‼️ TTS Request Failed ‼️</h1>
                                                    <h2>Retrying...</h2>
                                                </div>
                                            </body>
                                            </html>"""

                        html.write(html_code)

                    time.sleep(2)

                    reset_overlay()

                elif checkCount > config["QUERY_TRIES"]:
                    log.info(
                        f"Failed to recieve a processed TTS after {checkCount} checks. Giving up."
                    )
                    waitingToProcess = False
                    with open("./overlay/index.html", "w") as html:

                        html_code = f"""<html>
                            <head>
                            {JS_STRING}
                            <link rel="stylesheet" href="style.css">
                            </head>
                            <body>
                                <div class="box">
                                    <h1 style="color: red">‼️ TTS failed to process after {checkCount} tries. ‼️</h1>
                                    <h2>Giving Up.</h2>
                                </div>
                            </body>
                            </html>"""

                        html.write(html_code)

                    time.sleep(5)

                    reset_overlay()

                else:
                    log.info(
                        f"Waiting for TTS to finish processing. {checkCount}/{config['QUERY_TRIES']} checks"
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
            if sound is None:
                return
            sound_obj = AudioSegment.from_file(sound)
            final_file += sound_obj

        log.info("Merging files done. Writing to file.")

        final_file_name = f"./voice_files/{date_string}_final_file.wav"
        final_file.export(final_file_name, format="wav")
        simpleaudio_final_file = simpleaudio.WaveObject.from_wave_file(final_file_name)

        log.info("Writing to file done. Playing file.")

        play_obj = simpleaudio_final_file.play()
        play_obj.wait_done()

        log.info("File played. Deleting files.")

        os.remove(final_file_name)

        for file in voice_files:
            if file is None:
                return

            if "./playsounds" not in file:
                with contextlib.suppress(FileNotFoundError):
                    os.remove(file)

        log.info("Files deleted. All done!")

    if __name__ == "__main__":
        t = threading.Thread(target=thread_function)
        t.start()
        for voice_file in voice_files:
            q.put(voice_file)
            time.sleep(1)
        t.join()


def callback_channel_points(
    uuid: UUID, data: dict, failed: Optional[bool] = False
) -> None:
    log.debug(data)

    if (
        data["data"]["redemption"]["reward"]["title"].lower()
        == config["CHANNEL_POINTS_REWARD"].lower()
    ):
        message: str = data["data"]["redemption"]["user_input"]

        for i in config["BLACKLISTED_WORDS"]:
            if i in message.lower():
                log.info("Blacklisted word found")
                return

        request_tts(message=message, failed=False)


def callback_bits(uuid: UUID, data: dict, failed: Optional[bool] = False) -> None:
    log.debug(data)

    bits: str = data["data"]["bits_used"]

    message: str = data["data"]["chat_message"]

    for i in config["BLACKLISTED_WORDS"]:
        if i in message.lower():
            log.info("Blacklisted word found")
            return

    if config["MIN_BIT_AMOUNT"] > int(bits):
        log.info("Cheered bits is less than the minimum bit amount")
        return

    if len(message) > config["MAX_MSG_LENGTH"]:
        log.info("Cheered message is longer than the maximum message length")
        return

    message = re.sub(
        CHEER_REGEX,
        "",
        message,
    )

    request_tts(message=message, failed=False)


def connect():
    sio.emit(
        "authenticate", {"method": "jwt", "token": os.environ.get("STREAMELEMENTS_JWT")}
    )


def on_streamelements_event(data, *args):
    log.debug(data)

    def check_message(data) -> None:
        message: str = data["event"]["message"]

        if len(message) > config["MAX_MSG_LENGTH"]:
            log.info("Tip message is longer than the maximum message length")
            return

        for i in config["BLACKLISTED_WORDS"]:
            if i in message.lower():
                log.info("Blacklisted word found")
                return

        if data["listener"] == "cheer-latest":
            message = re.sub(
                CHEER_REGEX,
                "",
                message,
            )

        request_tts(message=message, failed=False)

    if data["listener"] == "tip-latest" and data["event"]["amount"] >= int(
        config["MIN_TIP_AMOUNT"]
    ):
        check_message(data)

    elif data["listener"] == "cheer-latest" and data["event"]["amount"] >= int(
        config["MIN_BIT_AMOUNT"]
    ):
        check_message(data)

    elif data["listener"] == "subscriber-latest" and data["event"]["amount"] >= 2:
        check_message(data)

    else:
        return


def on_streamelements_authenticated(data):
    log.debug(data)
    log.info("StreamElements connected!")


async def main():
    if config["BITS_OR_CHANNEL_POINTS"].lower() in ["bits", "channel_points"]:
        # setting up Authentication and getting your user id
        twitch = Twitch(
            os.environ.get("TWITCH_CLIENT_ID"), os.environ.get("TWITCH_SECRET")
        )
        target_scope: list = [AuthScope.BITS_READ, AuthScope.CHANNEL_READ_REDEMPTIONS]

        auth = UserAuthenticator(twitch, target_scope, force_verify=False)
        # this will open your default browser and prompt you with the twitch verification website
        token, refresh_token = auth.authenticate()
        # add User authentication
        twitch.set_user_authentication(token, target_scope, refresh_token)

        user_id: str = twitch.get_users(logins=[os.environ.get("TWITCH_USERNAME")])[
            "data"
        ][0]["id"]

        # starting up PubSub
        pubsub = PubSub(twitch)
        pubsub.start()
        # you can either start listening before or after you started pubsub.
        if config["BITS_OR_CHANNEL_POINTS"].lower() == "channel_points":
            uuid = pubsub.listen_channel_points(user_id, callback_channel_points)
        elif (
            config["BITS_OR_CHANNEL_POINTS"].lower() == "bits"
            or config["BITS_OR_CHANNEL_POINTS"] is None
        ):
            uuid: UUID = pubsub.listen_bits(user_id, callback_bits)

        # Only Available to Twitch atm.
        if os.environ.get("MM_API_KEY") is not None:
            post_version_number(user_id, VERSION)

    # ### StreamElements ###
    if config["BITS_OR_CHANNEL_POINTS"].lower() == "streamelements":
        sio.on("connect", connect)
        sio.on("event", on_streamelements_event)
        sio.on("event:test", on_streamelements_event)
        sio.on("authenticated", on_streamelements_authenticated)

        sio.connect("https://realtime.streamelements.com", transports=["websocket"])

    log.info("Pubsub Ready!")


def test_tts() -> None:
    log.info("Testing TTS")
    message: str = entry_1.get()
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


def skip_tts() -> None:
    log.info("Skipping TTS")
    simpleaudio.stop_all()
    reset_overlay()


# <-- UI -->

OUTPUT_PATH = Path(__file__).parent
ASSETS_PATH = OUTPUT_PATH / Path("./assets")


def relative_to_assets(path: str) -> Path:
    return ASSETS_PATH / Path(path)


window = Tk()
window.title("AI TTS Donations")

window.geometry("811x279")
window.configure(bg="#7CCFFF")


canvas = Canvas(
    window,
    bg="#7CCFFF",
    height=279,
    width=811,
    bd=0,
    highlightthickness=0,
    relief="ridge",
)

canvas.place(x=0, y=0)
image_image_1 = PhotoImage(file=relative_to_assets("image_1.png"))
image_1 = canvas.create_image(470, 50.0, image=image_image_1)

image_image_2 = PhotoImage(file=relative_to_assets("image_2.png"))
image_2 = canvas.create_image(405.0, 22.0, image=image_image_2)

button_image_1 = PhotoImage(file=relative_to_assets("button_1.png"))
button_1 = Button(
    image=button_image_1,
    borderwidth=0,
    highlightthickness=0,
    relief="flat",
)
button_1.bind("<Button-1>", lambda x: threading.Thread(target=skip_tts).start())
button_1.place(x=461.9999999999998, y=51.0, width=340.0, height=54.0)

entry_image_1 = PhotoImage(file=relative_to_assets("entry_1.png"))
entry_bg_1 = canvas.create_image(269.9999999999998, 249.0, image=entry_image_1)
entry_1 = Entry(bd=0, bg="#B8B8B8", highlightthickness=0)
entry_1.place(x=10.999999999999773, y=227.0, width=518.0, height=42.0)

image_image_3 = PhotoImage(file=relative_to_assets("image_3.png"))
image_3 = canvas.create_image(117.99999999999977, 195.0, image=image_image_3)

button_image_2 = PhotoImage(file=relative_to_assets("button_2.png"))
button_2 = Button(
    image=button_image_2,
    borderwidth=0,
    highlightthickness=0,
    relief="flat",
)
button_2.bind("<Button-1>", lambda x: threading.Thread(target=test_tts).start())
button_2.place(x=551.9999999999998, y=227.0, width=192.0, height=44.0)
window.resizable(False, False)
window.iconbitmap("./assets/trihard.ico")


def main_loop():
    window.mainloop()


nest_asyncio.apply()
asyncio.run(main())
asyncio.run(main_loop())
