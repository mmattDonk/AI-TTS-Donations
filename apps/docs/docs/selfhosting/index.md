---
sidebar_position: 1
---

# Self Hosting

## Support

Official support for Solrock has been sunsetted, this guide is meant for tinkerers and people with experience with Python/TypeScript/Next.js. **Proceed at your own risk,
and with patience.**

## Introduction

This is a guide on how to self host the Solrock service.

The Solrock service consists of 7 components:

1. [The Frontend Service](./production-setup/frontend-setup):
    - This includes the serverless API, the front page, the overlay, and the dashboard.
1. [The Backend Service](./production-setup/backend-setup):
    - This is for the Twitch EventSub notifications. Where Twitch gives us notifications on resubscription, channel points redemption, and cheer events.
1. [The Processor Service](./production-setup/processor-setup):
    - The serverless function that processes the messages through our TTS providers, playsounds, and voice effects. This is where the TTS audio gets generated and
      uploaded to Google Cloud.
1. [The Database](./production-setup/database-setup):
    - This is where all of the streamer data is stored, aswell as all of the TTS messages.
1. [The Redis Cache](./production-setup/database-setup#redis):
    - This is used to cache the streamer data.
1. [The Soketi Server](./production-setup/soketi-setup):
    - This is used to send the TTS messages to the overlay.
1. [The Google Cloud Storage Bucket](./production-setup/processor-setup):
    - This is used to store the TTS audio files.
