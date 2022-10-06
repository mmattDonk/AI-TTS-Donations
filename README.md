# Project Solrock (wip name) [![StackShare](https://img.shields.io/badge/tech-stack-0690fa.svg?style=flat)](https://stackshare.io/mmattdonk/solrock) [![Crowdin](https://badges.crowdin.net/solrock/localized.svg)](https://crowdin.com/project/solrock)

The first 100% **free** AI TTS service for Twitch.

Currently in development. Sign up for email updates at https://aittsdonations.mmattdonk.com/

## Project Structure

```
> solrock
    > apps
        > backend
            - The backend Express server handling Twitch Eventsub
        > frontend
            - The frontend Next.js app handling the dashboard and overlay
        > processor
            - The serverless Python audio processor
```

## Setup

Each app has its own README.md with more information on how to run and get started, however you will most likely want to run all of the apps at once. After setting up each app, run `yarn dev` in the root directory to start all of the apps at once using concurrently. You can start each app individually from the root directory by running `yarn <app name> <command>` (e.g. `yarn backend dev`).