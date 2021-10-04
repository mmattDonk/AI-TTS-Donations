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


load_dotenv()


def callback_whisper(uuid: UUID, data: dict) -> None:
    print("got callback for UUID " + str(uuid))
    print(data)
    request_auth = httpx.DigestAuth(
        os.environ.get("UBERDUCK_USERNAME"), os.environ.get("UBERDUCK_SECRET")
    )
    response = httpx.get(
        "https://api.uberduck.ai/speak",
        auth=request_auth,
        data={
            "speech": "test",
            "voice": "eminem",
        },
        timeout=60.00,
    )

    print("dank")
    print(response.status_code)
    print("dank2")
    print(response.json())
    print("dank3")


# setting up Authentication and getting your user id
twitch = Twitch(os.environ.get("TWITCH_CLIENT_ID"), os.environ.get("TWITCH_SECRET"))
target_scope = [AuthScope.BITS_READ, AuthScope.CHANNEL_READ_REDEMPTIONS]

auth = UserAuthenticator(twitch, target_scope, force_verify=False)
# this will open your default browser and prompt you with the twitch verification website
token, refresh_token = auth.authenticate()
# add User authentication
twitch.set_user_authentication(token, target_scope, refresh_token)

user_id = twitch.get_users(logins=["mmattbtw"])["data"][0]["id"]

# starting up PubSub
pubsub = PubSub(twitch)
pubsub.start()
# you can either start listening before or after you started pubsub.
uuid = pubsub.listen_channel_points(user_id, callback_whisper)
