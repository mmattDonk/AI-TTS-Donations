---
sidebar_position: 1
---

# Backend Setup

The backend service was hosted on [Railway](https://railway.app?referralCode=mmatt) during Solrock's lifetime. Railway can be used to host a variety of services,
including the [Redis & Postgres databases](./database-setup), and the [Soketi server](./soketi-setup).

## Requirements

-   A Twitch Developer application - [https://dev.twitch.tv/console/apps](https://dev.twitch.tv/console/apps)
    -   Create an application, call it whatever you'd like, then add `http://localhost:3000/api/auth/callback/twitch`, and
        `https://[YOUR FRONTEND URL HERE]/api/auth/callback/twitch` as OAuth Redirect URLs.
-   A frontend service, see [Frontend Setup](./frontend-setup)
-   A serverless processor, see [Processor Setup](./processor-setup)

## Setup

1. Sign up for an account on [Railway](https://railway.app?referralCode=mmatt).
1. Fork the [Solrock repository](https://github.com/mmattDonk/AI-TTS-Donations/fork).
1. [Create a new project on Railway, and import the forked repository.](https://railway.app/new/)
1. Setup environment variables.

    - `CLIENT_ID` - Your Twitch Developer application's Client ID.
    - `TWITCH_ACCESS_TOKEN` - Get your Twitch Access Token here: https://dev.twitch.tv/docs/cli/token-command#get-an-access-token
    - `EVENTSUB_URL` - The URL that Twitch will send eventsub events to. (This is the URL to your backend service + `/eventsub`) (e.g.
      `https://eventsub.solrock.mmattDonk.com/eventsub`)
    - `EVENTSUB_SECRET` - A random string, use a password manager (like Bitwarden or 1Password) to generate a secure string.
    - `API_URL` - The URL to your frontend service.
    - `API_SECRET` - A random string, use a password manager to generate a secure string. (THIS IS SHARED ACROSS ALL SERVICES, MAKE SURE IT'S THE SAME)
    - `SERVERLESS_PROCESSOR_URL` - The URL to your serverless processor.
    - `PORT` - The port to run the backend service on, defaults to `4200`. (You shouldn't need to change this, Railway should be able to pick a port for you)

1. Deploy the project.
