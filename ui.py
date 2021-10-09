import os
import tkinter as tk
from datetime import datetime
import httpx
import time
import re
from playsound import playsound
import urllib.request
from dotenv import load_dotenv

load_dotenv()


def test_tts(self):
    message = text_field.get()
    message = re.sub("(?i)cheer\d*", "", message)
    if message[0] == " ":
        message = message[1:]

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
                playsound(f"./AI_voice_{date_string}.wav")
                os.remove(f"./AI_voice_{date_string}.wav")
                waitingToProcess = False
            else:
                if checkCount > 100:
                    print(
                        f"Failed to recieve a processed TTS after {checkCount} checks. Giving up."
                    )
                    waitingToProcess = False
                else:
                    print(f"Waiting for TTS to finish processing. {checkCount} checks")
                    time.sleep(1)


ui = tk.Tk()

yo = tk.Label(text="AI tts :D")

yo.pack()

button = tk.Button(text="Send Test TTS", width=15, height=5, bg="black", fg="white")

button.bind("<Button-1>", test_tts)

button.pack()

text_field = tk.Entry(width=50)

text_field.pack()

ui.mainloop()