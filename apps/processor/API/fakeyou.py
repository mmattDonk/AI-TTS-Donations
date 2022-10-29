# -*- coding: utf-8 -*-
import os
from uuid import uuid4

import httpx


class Fakeyou:
    def get_job(text: str, voice_name: str) -> dict:
        """Get the FakeYou Voice job.

        :param text: The text to be spoken.
        :param voice_name: The name of the voice to be used.
        :return: The job.

        Returns:
        --------
        return {
            "detail": str or None,
            "uuid": str or None,
        }
        """

        uuid_str = str(uuid4())

        response = httpx.post(
            "https://api.fakeyou.com/tts/inference",
            json={
                "inference_text": text,
                "tts_model_token": voice_name,
                "uuid_idempotency_token": uuid_str,
            },
            timeout=60,
            headers={"Authorization": os.environ.get("FAKEYOU_API_KEY")},
        )

        uuid = None
        detail = None

        try:
            detail = response.json()["success"]

            if detail == False:
                detail = "That voice does not exist"

        except KeyError:
            pass

        try:
            uuid = response.json()["inference_job_token"]
        except KeyError:
            pass

        return {
            "detail": detail,
            "uuid": uuid,
        }

    def check_tts(uuid: str) -> dict:
        """
        Check if the TTS job is finished, if it is finished, it returns the URL to the audio file.

        :param uuid: The UUID of the job.
        :return: The URL to the audio file.

        Returns:
        --------
        return {
            "detail": str or None,
            "url": str,
        }
        """

        response = httpx.get(f"https://api.fakeyou.com/tts/job/{uuid}", timeout=60)

        # THIS IS ELF IS CANCER BUT IM STUPID AND MY OTHER ATTEMPTS WERENT WORKING LOL!
        if response.json()["state"]["status"] == "attempt_failed":
            failed_at = response.json()["state"]["status"]
        elif response.json()["state"]["status"] == "complete_failure":
            failed_at = response.json()["state"]["status"]
        else:
            failed_at = None

        if response.json()["state"]["maybe_public_bucket_wav_audio_path"] is not None:
            path = "https://storage.googleapis.com/vocodes-public" + str(
                response.json()["state"]["maybe_public_bucket_wav_audio_path"]
            )
        else:
            path = None

        return {
            "path": path,
            "failed_at": failed_at,
        }
