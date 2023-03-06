# mmattDonk 2023
# https://mmattDonk.com
import os
import re
import time

from API.uberduck import Uberduck
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Security
from fastapi.security.api_key import APIKey, APIKeyCookie, APIKeyHeader, APIKeyQuery
from pydantic import BaseModel

load_dotenv()
API_KEY = os.environ.get("API_SECRET")
API_KEY_NAME = "API_KEY"

api_key_query = APIKeyQuery(name=API_KEY_NAME, auto_error=False)
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)
api_key_cookie = APIKeyCookie(name=API_KEY_NAME, auto_error=False)


async def get_api_key(
    api_key_query: str = Security(api_key_query),
    api_key_header: str = Security(api_key_header),
    api_key_cookie: str = Security(api_key_cookie),
):

    if api_key_query == API_KEY:
        return api_key_query
    elif api_key_header == API_KEY:
        return api_key_header
    elif api_key_cookie == API_KEY:
        return api_key_cookie
    else:
        raise HTTPException(status_code=403, detail="Could not validate credentials")


class StreamerConfig(BaseModel):
    blacklistedWords: list[str]
    blacklistedVoices: list[str]
    blacklistedVoiceEffects: list[str]
    ignoredWords: list[str]
    fallbackVoice: str


class TTSRequest(BaseModel):
    streamer_config: StreamerConfig
    message: str
    overlay_id: str


app = FastAPI()


def get_playsounds():
    return sorted(
        [
            file
            for file in os.listdir("playsounds/")
            if file.endswith(".wav") and file != "README.md"
        ],
        key=lambda x: int(x.split("-")[0]),
    )


@app.get("/")
def read_root():
    return {"message": "OK", "status": 200}


@app.post("/tts")
async def tts(request: TTSRequest, api_key: APIKey = Depends(get_api_key)):
    for word in request.streamer_config.blacklistedWords:
        if word.lower() in request.message.lower():
            raise HTTPException(
                status_code=403, detail="Message contains blacklisted word"
            )
    for word in request.streamer_config.ignoredWords:
        if word.lower() in request.message.lower():
            request.message.replace(word, "")

    # make a messages list with the request.message split into a format with a voice and message, example: "spongebob: hello drake: hai" -> [("spongebob", "hello"), ("drake", "hai")]
    conversation = request.message

    # Define a pattern to match the speaker and the message
    pattern = r"([\w\s]+?):\s*(.*)"

    # Split the conversation into individual messages
    messages = re.split(r"(\w+:\s+|\(\d+\)\s)", conversation)

    # Initialize the list of transformed messages
    transformed = []

    # Initialize the speaker to be "spongebob"
    speaker = ""
    # Loop through each message and transform it
    for message in messages:
        print(message)
        if match := re.match(pattern, message):
            # If the message has a speaker, update the current speaker
            speaker = match[1]
            # Add the transformed message to the list
            transformed.append(
                {"speaker": speaker, "message": match[2], "playsound": False}
            )
        elif message.startswith("("):
            transformed.append(
                {
                    "speaker": "SOLROCKPLAYSOUND",
                    "message": message[1:-1],
                    "playsound": True,
                }
            )
        elif message.strip():
            transformed.append(
                {"speaker": speaker, "message": message.strip(), "playsound": False}
            )

    for msg in transformed:
        if msg["message"] == "":
            transformed.remove(msg)

        if msg["speaker"] in request.streamer_config.blacklistedVoices:
            msg["speaker"] = request.streamer_config.fallbackVoice

    urls = []

    for msg in transformed:
        print(msg)
        if msg["playsound"] == True:
            print(msg["message"])
            urls.append(
                # get the local path to the playsound
                # get_playsounds returns the list of playsounds sorted by number
                # so, if you do get_playsounds()[0], you get the first playsound file name
                # then, you can use that to get the local path to the playsound
                # /playsounds/1-playsound.wav
                f"/playsounds/{get_playsounds()[int(msg['message']) - 1]}"
            )

        job_response = Uberduck.get_job(msg["message"], msg["speaker"])

        if job_response["uuid"] != None:
            waiting: bool = True
            while waiting:
                job_check = Uberduck.check_job(job_response["uuid"])
                if job_check["url"] is None:
                    continue
                waiting = False
                urls.append(job_check["url"])

    return {"urls": urls, "status": 200}
