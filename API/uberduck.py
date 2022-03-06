import logging
import os

import httpx
from dotenv import load_dotenv

log = logging.getLogger()
load_dotenv()


class Uberduck:
    def get_job(text: str, voice_name: str) -> dict:
        """
        Get the Uberduck Voice job.

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

        log.debug(f"{text} - {voice_name}")

        response = httpx.post(
            "https://api.uberduck.ai/speak",
            auth=(
                os.environ.get("UBERDUCK_USERNAME"),
                os.environ.get("UBERDUCK_SECRET"),
            ),
            json={
                "speech": text,
                "voice": voice_name,
            },
        )

        uuid = None
        detail = None

        try:  # Uberduck explicitly returns None on the speak-status endpoint, but not on this one, Uberduck pls fix so I can remove this try/catch Madge
            detail = response.json()["detail"]
        except KeyError:
            pass

        try:  # NOW THESE HAVE TO BE IN 2 SEPERATE TRY CATCHES BECAUSE AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA UBERDANKPLESFIX
            uuid = response.json()["uuid"]
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

        response = httpx.get(
            f"https://api.uberduck.ai/speak-status?uuid={uuid}",
            auth=(
                os.environ.get("UBERDUCK_USERNAME"),
                os.environ.get("UBERDUCK_SECRET"),
            ),
        )

        return {
            "path": response.json()["path"],
            "failed_at": response.json()["failed_at"],
        }
