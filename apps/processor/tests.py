import pytest
from fastapi import HTTPException
from main import tts


def test_fallback_tts():
    req = tts(
        request={
            "streamer_config": {
                "blacklistedWords": ["test"],
                "blacklistedVoices": [],
                "blacklistedVoiceEffects": [],
                "ignoredWords": [],
                "fallbackVoice": "jerma985",
            },
            "message": "fortnite",
            "overlay_id": "test",
        },
        api_key="test",
    )
    assert req["status"] == 200


def test_blacklisted_tts():
    with pytest.raises(HTTPException) as exc_info:
        tts(
            request={
                "streamer_config": {
                    "blacklistedWords": ["test"],
                    "blacklistedVoices": [],
                    "blacklistedVoiceEffects": [],
                    "ignoredWords": [],
                    "fallbackVoice": "jerma985",
                },
                "message": "test",
                "overlay_id": "test",
            },
            api_key="test",
        )

    assert exc_info.value.status_code == 403


def test_playsounds():
    req = tts(
        request={
            "streamer_config": {
                "blacklistedWords": ["test"],
                "blacklistedVoices": [],
                "blacklistedVoiceEffects": [],
                "ignoredWords": [],
                "fallbackVoice": "jerma985",
            },
            "message": "(1) (2) (3)",
            "overlay_id": "test",
        },
        api_key="test",
    )

    assert req["status"] == 200


def test_playsounds_with_voices():
    req = tts(
        request={
            "streamer_config": {
                "blacklistedWords": ["test"],
                "blacklistedVoices": [],
                "blacklistedVoiceEffects": [],
                "ignoredWords": [],
                "fallbackVoice": "jerma985",
            },
            "message": "drake: fortnite (1) so true spongebob: lit (2) (3)",
            "overlay_id": "test",
        },
        api_key="test",
    )

    assert req["status"] == 200


def test_one_voice():
    req = tts(
        request={
            "streamer_config": {
                "blacklistedWords": ["test"],
                "blacklistedVoices": [],
                "blacklistedVoiceEffects": [],
                "ignoredWords": [],
                "fallbackVoice": "jerma985",
            },
            "message": "drake: fortnite",
            "overlay_id": "test",
        },
        api_key="test",
    )

    assert req["status"] == 200


def test_multiple_voices():
    req = tts(
        request={
            "streamer_config": {
                "blacklistedWords": ["test"],
                "blacklistedVoices": [],
                "blacklistedVoiceEffects": [],
                "ignoredWords": [],
                "fallbackVoice": "jerma985",
            },
            "message": "drake: fortnite spongebob: lit",
            "overlay_id": "test",
        },
        api_key="test",
    )

    assert req["status"] == 200
