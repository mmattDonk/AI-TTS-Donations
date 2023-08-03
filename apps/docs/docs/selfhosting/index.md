---
sidebar_position: 1
---

# Self Hosting

This is a guide on how to self host the Solrock service.

The Solrock service consists of 7 components:

1. The Frontend Service:
    - This includes the serverless API, the front page, the overlay, and the dashboard.
1. The Backend Service:
    - This is for the Twitch EventSub notifications. Where Twitch gives us notifications on resubscription, channel points redemption, and cheer events.
1. The Processor Service:
    - The serverless function that processes the messages through our TTS providers, playsounds, and voice effects. This is where the TTS audio gets generated and
      uploaded to Google Cloud.
1. The Database:
    - This is where all of the streamer data is stored, aswell as all of the TTS messages.
1. The Redis Cache:
    - This is used to cache the streamer data.
1. The Pusher Server:
    - This is used to send the TTS messages to the overlay.
1. The Google Cloud Storage Bucket:
    - This is used to store the TTS audio files.
