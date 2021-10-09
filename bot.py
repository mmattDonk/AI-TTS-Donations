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
from datetime import datetime
import httpx
import time
import re
import logging
from datetime import datetime
import winsound
import urllib.request

import json

with open("config.json", "r") as f:
    config = json.load(f)


load_dotenv()
log_level = logging.DEBUG if "dev".lower() in sys.argv else logging.INFO


log = logging.getLogger()

logging.basicConfig(level=log_level, format="%(name)s - %(message)s", datefmt="%X")


def callback_whisper(uuid: UUID, data: dict) -> None:
    print(data)

    bits = data["data"]["bits_used"]

    message = data["data"]["chat_message"]
    message = re.sub("(?i)cheer\d*", "", message)
    if message[0] == " ":
        message = message[1:]

    print(message)

    voice = message.split(": ")[0]
    voice = voice.lower()
    print(voice)
    text = message.split(": ")[1]
    print(text)

    if config["MIN_BIT_AMOUNT"] > int(bits):
        print("Cheered bits is less than the minimum bit amount")
        return

    if len(text) > config["MAX_MSG_LENGTH"]:
        print("Cheered message is longer than the maximum message length")
        return

    else:
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
                    winsound.PlaySound(
                        f"./AI_voice_{date_string}.wav", winsound.SND_ASYNC
                    )
                    time.sleep(1)
                    os.remove(f"./AI_voice_{date_string}.wav")
                    waitingToProcess = False
                elif ud_ai.json()["failed_at"] != None:
                    print("This TTS request failed.")
                    waitingToProcess = False
                elif checkCount > 100:
                    print(
                        f"Failed to recieve a processed TTS after {checkCount} checks. Giving up."
                    )
                    waitingToProcess = False
                else:
                    print(
                        f"Waiting for TTS to finish processing. {checkCount}/100 checks"
                    )
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
print("Pubsub Ready!")
