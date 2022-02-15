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
from tkinter import Button, Canvas, Entry, PhotoImage, Text, Tk
from typing import Optional
from uuid import UUID

import httpx
import simpleaudio
from dotenv import load_dotenv
from rich.logging import RichHandler
from twitchAPI.oauth import UserAuthenticator
from twitchAPI.pubsub import PubSub
from twitchAPI.twitch import Twitch
from twitchAPI.types import AuthScope

PLAYSOUND_FILES = {
    "(1)": "001-alarm.wav",
}

def path_exists(filename):
    return os.path.join(".", f"{filename}")


if not os.path.exists(path_exists("./overlay/index.html")):
    with open("./overlay/index.html", "w") as html:
        js_script = """<meta http-equiv="refresh" content="1">"""
        html_code = f"""<head>
        {js_script}
        <link rel="stylesheet" href="style.css">
        </head>"""
        html.write(html_code)

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


with open("config.json", "r") as f:
    config = json.load(f)


load_dotenv()
log_level = logging.DEBUG if "dev".lower() in sys.argv else logging.INFO


log = logging.getLogger()


logging.basicConfig(
    level=log_level,
    format="%(name)s - %(message)s",
    datefmt="%X",
    handlers=[RichHandler()],
)


def request_tts(message: str, failed: Optional[bool] = False):
    # sourcery no-metrics
    messages = message.split("||")
    log.debug(messages)

    q = queue.Queue()

    voice_files = []

    for message in messages:
        log.debug(f"`{message}`")
        if message[0] == " ":
            message = message[1:]
            log.debug(f"`{message}`")

        # ----------- Playsounds -----------
        if "(1)" in message:
            voice_files.append(f"./playsounds/001-alarm.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(2)" in message:
            voice_files.append(f"./playsounds/002-beads.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(3)" in message:
            voice_files.append(f"./playsounds/003-beep1.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(4)" in message:
            voice_files.append(f"./playsounds/004-beep1-faster.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(5)" in message:
            voice_files.append(f"./playsounds/005-beep1-flatline.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(6)" in message:
            voice_files.append(f"./playsounds/006-beep2.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(7)" in message:
            voice_files.append(f"./playsounds/007-bell.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(8)" in message:
            voice_files.append(f"./playsounds/008-bite.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(9)" in message:
            voice_files.append(f"./playsounds/009-bottle.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(10)" in message:
            voice_files.append(f"./playsounds/010-bottleuncork.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(11)" in message:
            voice_files.append(f"./playsounds/011-bubble.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(12)" in message:
            voice_files.append(f"./playsounds/012-camera.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(13)" in message:
            voice_files.append(f"./playsounds/013-cardfan.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(14)" in message:
            voice_files.append(f"./playsounds/014-cardplace.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(15)" in message:
            voice_files.append(f"./playsounds/015-cardshuffle.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(16)" in message:
            voice_files.append(f"./playsounds/016-chiplay.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(17)" in message:
            voice_files.append(f"./playsounds/017-chop1.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(18)" in message:
            voice_files.append(f"./playsounds/018-chop2.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(19)" in message:
            voice_files.append(f"./playsounds/019-clamour.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(20)" in message:
            voice_files.append(f"./playsounds/020-coin.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(21)" in message:
            voice_files.append(f"./playsounds/021-coins.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(22)" in message:
            voice_files.append(f"./playsounds/022-cupboard-open.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(23)" in message:
            voice_files.append(f"./playsounds/023-dialing-phone.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(24)" in message:
            voice_files.append(f"./playsounds/024-dicethrow.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(25)" in message:
            voice_files.append(f"./playsounds/025-die1.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(26)" in message:
            voice_files.append(f"./playsounds/026-dig1.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(27)" in message:
            voice_files.append(f"./playsounds/027-dig2.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(28)" in message:
            voice_files.append(f"./playsounds/028-dig3.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(29)" in message:
            voice_files.append(f"./playsounds/029-dog-bark1.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(30)" in message:
            voice_files.append(f"./playsounds/030-dog-bark2.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(31)" in message:
            voice_files.append(f"./playsounds/031-dog-bark3.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(32)" in message:
            voice_files.append(f"./playsounds/032-dog-bark4.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(33)" in message:
            voice_files.append(f"./playsounds/033-dog-ruff1.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(34)" in message:
            voice_files.append(f"./playsounds/034-dog-whine1.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(35)" in message:
            voice_files.append(f"./playsounds/035-dog-whine2.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(36)" in message:
            voice_files.append(f"./playsounds/036-dog-whine3.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(37)" in message:
            voice_files.append(f"./playsounds/037-dog-yip1.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(38)" in message:
            voice_files.append(f"./playsounds/038-dog-yip2.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(39)" in message:
            voice_files.append(f"./playsounds/039-donk.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(40)" in message:
            voice_files.append(f"./playsounds/040-door-close1.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(41)" in message:
            voice_files.append(f"./playsounds/041-door-close2.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(42)" in message:
            voice_files.append(f"./playsounds/042-door-open1.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(43)" in message:
            voice_files.append(f"./playsounds/043-door-open2.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(44)" in message:
            voice_files.append(f"./playsounds/044-door-open-creak.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(45)" in message:
            voice_files.append(f"./playsounds/045-drink1.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(46)" in message:
            voice_files.append(f"./playsounds/046-drink2.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(47)" in message:
            voice_files.append(f"./playsounds/047-explosion.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(48)" in message:
            voice_files.append(f"./playsounds/048-finger-snap.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(49)" in message:
            voice_files.append(f"./playsounds/049-footsteps1.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(50)" in message:
            voice_files.append(f"./playsounds/050-footsteps2.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(51)" in message:
            voice_files.append(f"./playsounds/051-footsteps3.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(52)" in message:
            voice_files.append(f"./playsounds/052-footsteps4.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(53)" in message:
            voice_files.append(f"./playsounds/053-footsteps5.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(54)" in message:
            voice_files.append(f"./playsounds/054-footsteps6.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(55)" in message:
            voice_files.append(f"./playsounds/055-footsteps7.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(56)" in message:
            voice_files.append(f"./playsounds/056-footsteps7-stop.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(57)" in message:
            voice_files.append(f"./playsounds/057-gasp.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(58)" in message:
            voice_files.append(f"./playsounds/058-gulp1.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(59)" in message:
            voice_files.append(f"./playsounds/059-gulp2.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(60)" in message:
            voice_files.append(f"./playsounds/060-guncock1.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(61)" in message:
            voice_files.append(f"./playsounds/061-guncock2.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(62)" in message:
            voice_files.append(f"./playsounds/062-gunreload1.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(63)" in message:
            voice_files.append(f"./playsounds/063-gunreload2.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(64)" in message:
            voice_files.append(f"./playsounds/064-gunshot1.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(65)" in message:
            voice_files.append(f"./playsounds/065-gunshot2.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(66)" in message:
            voice_files.append(f"./playsounds/066-gunshot3.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(67)" in message:
            voice_files.append(f"./playsounds/067-gunshot4.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(68)" in message:
            voice_files.append(f"./playsounds/068-hang-drop.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(69)" in message:
            voice_files.append(f"./playsounds/069-hang-swing.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(70)" in message:
            voice_files.append(f"./playsounds/070-hit01.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(71)" in message:
            voice_files.append(f"./playsounds/071-hit02.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(72)" in message:
            voice_files.append(f"./playsounds/072-hit03.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(73)" in message:
            voice_files.append(f"./playsounds/073-hit04.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(74)" in message:
            voice_files.append(f"./playsounds/074-hit05.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(75)" in message:
            voice_files.append(f"./playsounds/075-horse1.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(76)" in message:
            voice_files.append(f"./playsounds/076-knock-knock.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(77)" in message:
            voice_files.append(f"./playsounds/077-lighter.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(78)" in message:
            voice_files.append(f"./playsounds/078-machinegun.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(79)" in message:
            voice_files.append(f"./playsounds/079-mobile-message.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(80)" in message:
            voice_files.append(f"./playsounds/080-mobile-ring.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(81)" in message:
            voice_files.append(f"./playsounds/081-mobile-tap.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(82)" in message:
            voice_files.append(f"./playsounds/082-mud.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(83)" in message:
            voice_files.append(f"./playsounds/083-mud.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(84)" in message:
            voice_files.append(f"./playsounds/084-oldphone-ring.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(85)" in message:
            voice_files.append(f"./playsounds/085-page-turn.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(86)" in message:
            voice_files.append(f"./playsounds/086-phone-ringing.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(87)" in message:
            voice_files.append(f"./playsounds/087-phone-vibrate.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(88)" in message:
            voice_files.append(f"./playsounds/088-pill-bottle.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(89)" in message:
            voice_files.append(f"./playsounds/089-police-siren.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(90)" in message:
            voice_files.append(f"./playsounds/090-pop.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(91)" in message:
            voice_files.append(f"./playsounds/091-sackdrop.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(92)" in message:
            voice_files.append(f"./playsounds/092-scissors.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(93)" in message:
            voice_files.append(f"./playsounds/093-scream1.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(94)" in message:
            voice_files.append(f"./playsounds/094-scream2.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(95)" in message:
            voice_files.append(f"./playsounds/095-silence-one-second.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(96)" in message:
            voice_files.append(f"./playsounds/096-silence-two-seconds.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(97)" in message:
            voice_files.append(f"./playsounds/097-slime.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(98)" in message:
            voice_files.append(f"./playsounds/098-slurp.wav")
            log.info(f"Added Playsound # {message}")
            continue
        elif "(99)" in message:
            voice_files.append(f"./playsounds/099-splash1.wav")
            log.info(f"Added Playsound # {message}")
            continue
        # ----------- End of Playsounds -----------
        if message == ",":
            continue

        try:
            log.debug(message.split(": "))

            voice = message.split(": ")[0]
            voice = voice.lower()
            log.debug(voice)
            text = message.split(": ")[1]
            log.debug(text)
        except IndexError:
            text = message

        response = httpx.post(
            "https://api.uberduck.ai/speak",
            auth=(
                os.environ.get("UBERDUCK_USERNAME"),
                os.environ.get("UBERDUCK_SECRET"),
            ),
            json={
                "speech": text,
                "voice": voice,
            },
        )

        log.debug(response.json())

        if response.json().get("detail") != None:
            if response.json()["detail"] == "That voice does not exist":
                log.info(
                    "Couldn't find voice specified, using fallback voice: "
                    + config["FALLBACK_VOICE"]
                )
                response = httpx.post(
                    "https://api.uberduck.ai/speak",
                    auth=(
                        os.environ.get("UBERDUCK_USERNAME"),
                        os.environ.get("UBERDUCK_SECRET"),
                    ),
                    json={
                        "speech": text,
                        "voice": config["FALLBACK_VOICE"],
                    },
                )

        if response.json()["uuid"] is not None:
            log.info("UUID recieved. Waiting for TTS to process")
            js_string = """<meta http-equiv="refresh" content="1">"""
            checkCount = 0
            waitingToProcess = True
            while waitingToProcess:
                checkCount += 1
                with open("./overlay/index.html", "w") as html:
                    html_code = f"""<html>
                        <head>
                        {js_string}
                        <link rel="stylesheet" href="style.css">
                        </head>
                        <body>
                            <div class="box">
                                <h1>New TTS Request:</h1>
                                <h2>Voice: {voice}</h2>
                                <h2>{checkCount}/{config["QUERY_TRIES"]} checks</h2>
                            </div>
                        </body>
                        </html>"""

                    html.write(html_code)

                ud_ai = httpx.get(
                    f"https://api.uberduck.ai/speak-status?uuid={response.json()['uuid']}",
                    auth=(
                        os.environ.get("UBERDUCK_USERNAME"),
                        os.environ.get("UBERDUCK_SECRET"),
                    ),
                )

                log.debug(ud_ai.json())
                if ud_ai.json()["path"] != None:
                    log.info(f"TTS processed after {checkCount} checks")
                    date_string = datetime.now().strftime("%d%m%Y%H%M%S")
                    urllib.request.urlretrieve(
                        ud_ai.json()["path"],
                        f"./voice_files/AI_voice_{date_string}.wav",
                    )
                    with open("./overlay/index.html", "w") as html:
                        js_script = """<meta http-equiv="refresh" content="1">"""
                        html_code = f"""<head>
                            {js_script}
                            <link rel="stylesheet" href="style.css">
                            </head>"""
                        html.write(html_code)
                    time.sleep(1)
                    voice_files.append(f"./voice_files/AI_voice_{date_string}.wav")
                    time.sleep(1)
                    waitingToProcess = False

                elif ud_ai.json()["failed_at"] != None:
                    log.info("TTS request failed, trying again.")
                    waitingToProcess = False
                    request_tts(message=message, failed=True)

                    with open("./overlay/index.html", "w") as html:
                        js_script = """<meta http-equiv="refresh" content="1">"""

                        html_code = f"""<html>
                                            <head>
                                            {js_string}
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

                    with open("./overlay/index.html", "w") as html:
                        js_script = """<meta http-equiv="refresh" content="1">"""
                        html_code = f"""<head>
                                            {js_script}
                                            <link rel="stylesheet" href="style.css">
                                            </head>"""

                        html.write(html_code)

                elif checkCount > config["QUERY_TRIES"]:
                    log.info(
                        f"Failed to recieve a processed TTS after {checkCount} checks. Giving up."
                    )
                    waitingToProcess = False
                    with open("./overlay/index.html", "w") as html:
                        js_script = """<meta http-equiv="refresh" content="1">"""

                        html_code = f"""<html>
                            <head>
                            {js_string}
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

                    with open("./overlay/index.html", "w") as html:
                        js_script = """<meta http-equiv="refresh" content="1">"""
                        html_code = f"""<head>
                            {js_script}
                            <link rel="stylesheet" href="style.css">
                            </head>"""

                        html.write(html_code)

                else:
                    log.info(
                        f"Waiting for TTS to finish processing. {checkCount}/{config['QUERY_TRIES']} checks"
                    )
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
                os.remove(sound)

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
        message = data["data"]["redemption"]["user_input"]

        for i in config["BLACKLISTED_WORDS"]:
            if i in message.lower():
                log.info("Blacklisted word found")
                return

        request_tts(message=message, failed=False)


def callback_bits(uuid: UUID, data: dict, failed: Optional[bool] = False) -> None:
    log.debug(data)

    bits = data["data"]["bits_used"]

    message = data["data"]["chat_message"]

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
        r"(?i)(cheer(?:whal)?|doodlecheer|biblethump|corgo|uni|showlove|party|seemsgood|pride|kappa|frankerz|heyguys|dansgame|elegiggle|trihard|kreygasm|4head|swiftrage|notlikethis|vohiyo|pjsalt|mrdestructoid|bday|ripcheer|shamrock|streamlabs|bitboss|muxy)\d*",
        "",
        message,
    )

    request_tts(message=message, failed=False)


# setting up Authentication and getting your user id
twitch = Twitch(os.environ.get("TWITCH_CLIENT_ID"), os.environ.get("TWITCH_SECRET"))
target_scope = [AuthScope.BITS_READ, AuthScope.CHANNEL_READ_REDEMPTIONS]

auth = UserAuthenticator(twitch, target_scope, force_verify=False)
# this will open your default browser and prompt you with the twitch verification website
token, refresh_token = auth.authenticate()
# add User authentication
twitch.set_user_authentication(token, target_scope, refresh_token)

user_id = twitch.get_users(logins=[os.environ.get("TWITCH_USERNAME")])["data"][0]["id"]

# starting up PubSub
pubsub = PubSub(twitch)
pubsub.start()
# you can either start listening before or after you started pubsub.
if config["BITS_OR_CHANNEL_POINTS"] == "channel_points":
    uuid = pubsub.listen_channel_points(user_id, callback_channel_points)
elif (
    config["BITS_OR_CHANNEL_POINTS"] == "bits"
    or config["BITS_OR_CHANNEL_POINTS"] is None
):
    uuid = pubsub.listen_bits(user_id, callback_bits)

log.info("Pubsub Ready!")


def test_tts():
    log.info("Testing TTS")
    message = entry_1.get()
    if message == "":
        return
    message = re.sub(
        r"(?i)(cheer(?:whal)?|doodlecheer|biblethump|corgo|uni|showlove|party|seemsgood|pride|kappa|frankerz|heyguys|dansgame|elegiggle|trihard|kreygasm|4head|swiftrage|notlikethis|vohiyo|pjsalt|mrdestructoid|bday|ripcheer|shamrock|streamlabs|bitboss|muxy)\d*",
        "",
        message,
    )

    for i in config["BLACKLISTED_WORDS"]:
        if i in message.lower():
            log.info("Blacklisted word found")
            return

    request_tts(message=message, failed=False)


def skip_tts():
    log.info("Skipping TTS")
    simpleaudio.stop_all()
    with open("./overlay/index.html", "w") as html:
        js_script = """<meta http-equiv="refresh" content="1">"""
        html_code = f"""<head>
        {js_script}
        <link rel="stylesheet" href="style.css">
        </head>"""

        html.write(html_code)


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

window.mainloop()
