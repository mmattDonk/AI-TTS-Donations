# -*- coding: utf-8 -*-
import httpx


class Tiktok:
    def get_tts(text: str, voice_name: str) -> str or None:
        """Get the TikTok Voice TTS.

        :param text: The text to be spoken.
        :param voice_name: The name of the voice to be used.
        :return: The Base64 encoded mp3.

        Returns:
        --------
        return "..."
        """

        response = httpx.get(
            f"https://tiktokaittsdonations.mmattdonk.workers.dev/?text={text}&voice={voice_name.split(':')[1]}",
        )
        return None if response.status_code != 200 else response.text
