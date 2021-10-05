import os
import sys

print(sys.argv)
if "dev".lower() in sys.argv:
    print("Starting in DEV mode")
else:
    os.system("git pull origin main")
    os.system("pip install -U -r requirements.txt")

from twitchAPI.pubsub import PubSub
from twitchAPI.twitch import Twitch
from twitchAPI.types import AuthScope
from uuid import UUID
from dotenv import load_dotenv
from twitchAPI.oauth import UserAuthenticator
import httpx
import time

from playsound import playsound
import urllib.request

import json

with open("config.json", "r") as f:
    config = json.load(f)


load_dotenv()


def callback_whisper(uuid: UUID, data: dict) -> None:

    bits = data["event"]["bits"]

    if config["MIN_BIT_AMOUNT"] >= bits:
        return

    message = data["event"]["message"]

    if message.length >= config["MAX_MSG_LENGTH"]:
        return

    voice = message.split(": ")[0]
    voice = voice.lower()
    text = message.split(": ")[1]

    response = httpx.post(
        "https://api.uberduck.ai/speak",
        auth=(os.environ.get("UBERDUCK_USERNAME"), os.environ.get("UBERDUCK_SECRET")),
        json={
            "speech": text,
            "voice": voice,
        },
        timeout=10.00,
    )

    print(response.json())

    if response.json()["uuid"] is not None:
        print("dank0")

        danking = True
        while danking:
            ud_ai = httpx.get(
                f"https://api.uberduck.ai/speak-status?uuid={response.json()['uuid']}",
                auth=(
                    os.environ.get("UBERDUCK_USERNAME"),
                    os.environ.get("UBERDUCK_SECRET"),
                ),
                timeout=120.00,
            )
            print(ud_ai.url)

            print("dank1")

            print(ud_ai.json())
            if ud_ai.json()["path"] != None:
                print("DANK ALERT")
                urllib.request.urlretrieve(ud_ai.json()["path"], "AI_voice.wav")
                time.sleep(1)
                playsound("./AI_voice.wav")
                danking = False
            else:
                print("false danking")
                time.sleep(1)


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
uuid = pubsub.listen_bits(user_id, callback_whisper)
print("Pubsub Ready.")
