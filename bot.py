import os
import sys

print(sys.argv)
if "dev".lower() in sys.argv:
    print("Starting in DEV mode")
else:
    os.system("git pull origin main")
    os.system("pip install -U -r requirements.txt")


import json
import logging
import queue
import re
import threading
import time
import urllib.request
from datetime import datetime
from pathlib import Path
from tkinter import Button, Canvas, Entry, PhotoImage, Text, Tk
from uuid import UUID

import httpx
import simpleaudio
from dotenv import load_dotenv
from twitchAPI.oauth import UserAuthenticator
from twitchAPI.pubsub import PubSub
from twitchAPI.twitch import Twitch
from twitchAPI.types import AuthScope

with open("config.json", "r") as f:
    config = json.load(f)


load_dotenv()
log_level = logging.DEBUG if "dev".lower() in sys.argv else logging.INFO


log = logging.getLogger()

logging.basicConfig(level=log_level, format="%(name)s - %(message)s", datefmt="%X")


def callback_channel_points(uuid: UUID, data: dict) -> None:
    print(data)

    if (
        data["data"]["redemption"]["reward"]["title"].lower()
        == config["CHANNEL_POINTS_REWARD"].lower()
    ):
        message = data["data"]["redemption"]["user_input"]

        for i in config["BLACKLISTED_WORDS"]:
            if i in message.lower():
                print("Blacklisted word found")
                return

        messages = message.split("||")
        print(messages)

        q = queue.Queue()

        voice_files = []

        for message in messages:
            if message[0] == " ":
                message = message[1:]
            elif message == ",":
                continue

            print(message.split(": "))

            voice = message.split(": ")[0]
            voice = voice.lower()
            print(voice)
            text = message.split(": ")[1]
            print(text)

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

            print(response.json())

            if response.json()["uuid"] is not None:
                print("UUID recieved. Waiting for TTS to process")

                checkCount = 0
                waitingToProcess = True
                while waitingToProcess:
                    checkCount += 1

                    ud_ai = httpx.get(
                        f"https://api.uberduck.ai/speak-status?uuid={response.json()['uuid']}",
                        auth=(
                            os.environ.get("UBERDUCK_USERNAME"),
                            os.environ.get("UBERDUCK_SECRET"),
                        ),
                    )

                    print(ud_ai.json())
                    if ud_ai.json()["path"] != None:
                        print(f"TTS processed after {checkCount} checks")
                        date_string = datetime.now().strftime("%d%m%Y%H%M%S")
                        urllib.request.urlretrieve(
                            ud_ai.json()["path"], f"AI_voice_{date_string}.wav"
                        )
                        time.sleep(1)
                        voice_files.append(f"AI_voice_{date_string}.wav")
                        time.sleep(1)
                        waitingToProcess = False

                    elif ud_ai.json()["failed_at"] != None:
                        print("TTS request failed.")
                        waitingToProcess = False

                    elif checkCount > 100:
                        print(
                            f"Failed to recieve a processed TTS after {checkCount} checks. Giving up."
                        )
                        waitingToProcess = False
                    else:
                        print(
                            f"Waiting for TTS to finish processing. {checkCount} checks"
                        )
                        time.sleep(1)

        def thread_function():
            while True:
                sound = q.get()
                if sound is None:
                    break
                sound_obj = simpleaudio.WaveObject.from_wave_file(sound)
                play_obj = sound_obj.play()
                play_obj.wait_done()
                os.remove(sound)

        if __name__ == "__main__":
            t = threading.Thread(target=thread_function)
            t.start()
            for voice_file in voice_files:
                q.put(voice_file)
                time.sleep(1)
            t.join()


def callback_bits(uuid: UUID, data: dict) -> None:
    print(data)

    bits = data["data"]["bits_used"]

    message = data["data"]["chat_message"]

    for i in config["BLACKLISTED_WORDS"]:
        if i in message.lower():
            print("Blacklisted word found")
            return

    message = re.sub(
        "(?i)(cheer(?:whal)?|doodlecheer|biblethump|corgo|uni|showlove|party|seemsgood|pride|kappa|frankerz|heyguys|dansgame|elegiggle|trihard|kreygasm|4head|swiftrage|notlikethis|vohiyo|pjsalt|mrdestructoid|bday|ripcheer|shamrock|streamlabs|bitboss|muxy)\d*",
        "",
        message,
    )

    messages = message.split("||")
    print(messages)

    q = queue.Queue()

    voice_files = []

    for message in messages:
        if message[0] == " ":
            message = message[1:]
        elif message == ",":
            continue

        print(message.split(": "))

        voice = message.split(": ")[0]
        voice = voice.lower()
        print(voice)
        text = message.split(": ")[1]
        print(text)

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

        print(response.json())

        if response.json()["uuid"] is not None:
            print("UUID recieved. Waiting for TTS to process")

            checkCount = 0
            waitingToProcess = True
            while waitingToProcess:
                checkCount += 1

                ud_ai = httpx.get(
                    f"https://api.uberduck.ai/speak-status?uuid={response.json()['uuid']}",
                    auth=(
                        os.environ.get("UBERDUCK_USERNAME"),
                        os.environ.get("UBERDUCK_SECRET"),
                    ),
                )

                print(ud_ai.json())
                if ud_ai.json()["path"] != None:
                    print(f"TTS processed after {checkCount} checks")
                    date_string = datetime.now().strftime("%d%m%Y%H%M%S")
                    urllib.request.urlretrieve(
                        ud_ai.json()["path"], f"AI_voice_{date_string}.wav"
                    )
                    time.sleep(1)
                    voice_files.append(f"AI_voice_{date_string}.wav")
                    time.sleep(1)

                    waitingToProcess = False

                elif ud_ai.json()["failed_at"] != None:
                    print("TTS request failed.")
                    waitingToProcess = False

                elif checkCount > 100:
                    print(
                        f"Failed to recieve a processed TTS after {checkCount} checks. Giving up."
                    )
                    waitingToProcess = False
                else:
                    print(f"Waiting for TTS to finish processing. {checkCount} checks")
                    time.sleep(1)

    def thread_function():
        while True:
            sound = q.get()
            if sound is None:
                break
            sound_obj = simpleaudio.WaveObject.from_wave_file(sound)
            play_obj = sound_obj.play()
            play_obj.wait_done()
            os.remove(sound)

    if __name__ == "__main__":
        t = threading.Thread(target=thread_function)
        t.start()
        for voice_file in voice_files:
            q.put(voice_file)
            time.sleep(1)
        t.join()


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

print("Pubsub Ready!")


def test_tts():
    message = entry_1.get()
    if message == "":
        return
    message = re.sub(
        "(?i)(cheer(?:whal)?|doodlecheer|biblethump|corgo|uni|showlove|party|seemsgood|pride|kappa|frankerz|heyguys|dansgame|elegiggle|trihard|kreygasm|4head|swiftrage|notlikethis|vohiyo|pjsalt|mrdestructoid|bday|ripcheer|shamrock|streamlabs|bitboss|muxy)\d*",
        "",
        message,
    )

    for i in config["BLACKLISTED_WORDS"]:
        if i in message.lower():
            print("Blacklisted word found")
            return

    messages = message.split("||")
    print(messages)

    q = queue.Queue()

    voice_files = []

    for message in messages:
        if message[0] == " ":
            message = message[1:]
        elif message == ",":
            continue

        print(message.split(": "))

        voice = message.split(": ")[0]
        voice = voice.lower()
        print(voice)
        text = message.split(": ")[1]
        print(text)

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

        print(response.json())

        if response.json()["uuid"] is not None:
            print("UUID recieved. Waiting for TTS to process")

            checkCount = 0
            waitingToProcess = True
            while waitingToProcess:
                checkCount += 1

                ud_ai = httpx.get(
                    f"https://api.uberduck.ai/speak-status?uuid={response.json()['uuid']}",
                    auth=(
                        os.environ.get("UBERDUCK_USERNAME"),
                        os.environ.get("UBERDUCK_SECRET"),
                    ),
                )

                print(ud_ai.json())
                if ud_ai.json()["path"] != None:
                    print(f"TTS processed after {checkCount} checks")
                    date_string = datetime.now().strftime("%d%m%Y%H%M%S")
                    urllib.request.urlretrieve(
                        ud_ai.json()["path"], f"AI_voice_{date_string}.wav"
                    )
                    time.sleep(1)
                    voice_files.append(f"AI_voice_{date_string}.wav")
                    time.sleep(1)

                    waitingToProcess = False

                elif ud_ai.json()["failed_at"] != None:
                    print("TTS request failed.")
                    waitingToProcess = False

                elif checkCount > 100:
                    print(
                        f"Failed to recieve a processed TTS after {checkCount} checks. Giving up."
                    )
                    waitingToProcess = False
                else:
                    print(f"Waiting for TTS to finish processing. {checkCount} checks")
                    time.sleep(1)

    def thread_function():
        while True:
            sound = q.get()
            if sound is None:
                break
            sound_obj = simpleaudio.WaveObject.from_wave_file(sound)
            play_obj = sound_obj.play()
            play_obj.wait_done()
            os.remove(sound)

    if __name__ == "__main__":
        t = threading.Thread(target=thread_function)
        t.start()
        for voice_file in voice_files:
            q.put(voice_file)
            time.sleep(1)
        t.join()


def skip_tts(self):
    print("Skipping TTS")
    simpleaudio.stop_all()


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
button_1.bind("<Button-1>", skip_tts)
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
