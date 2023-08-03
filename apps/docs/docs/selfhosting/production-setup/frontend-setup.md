---
sidebar_position: 1
---

# Frontend Setup

The frontend service was hosted on [Vercel](https://vercel.com?utm_source=mmattDonk&utm_campaign=oss) during Solrock's lifetime. Since the frontend is built on Next.js,
Vercel was obviously the choice we went with. Vercel also has a very generous free tier, so you should be safe to host frontend with no payments.

## Requirements

-   A Twitch Developer application - [https://dev.twitch.tv/console/apps](https://dev.twitch.tv/console/apps)
    -   Create an application, call it whatever you'd like, then add `http://localhost:3000/api/auth/callback/twitch`, and
        `https://[YOUR FRONTEND URL HERE]/api/auth/callback/twitch` as OAuth Redirect URLs.
-   A PostgreSQL database, see [Database Setup](./database-setup)
-   A Pusher server, see [Pusher Setup](./pusher-setup)
-   A serverless processor, see [Processor Setup](./processor-setup)
-   An eventsub backend, see [Backend Setup](./backend-setup)

## Setup

1. Sign up for an account on [Vercel](https://vercel.com?utm_source=mmattDonk&utm_campaign=oss).
2. Fork the [Solrock repository](https://github.com/mmattDonk/AI-TTS-Donations/fork).
3. [Create a new project on Vercel, and import the forked repository.](https://vercel.com/new/)
4. Setup environment variables.
    - `TWITCH_ID` - Your Twitch Developer application's Client ID.
    - `TWITCH_SECRET` - Your Twitch Developer application's Client Secret.
    - `NEXTAUTH_SECRET` - A random string, use a password manager to generate a secure string.
    - `DATABASE_URL` - Your PostgreSQL database URL.
    - `SENTRY_IGNORE_API_RESOLUTION_ERROR` - Set this to `1`, unsure if this is still a problem, but it works.
    - `API_SECRET` - A random string, use a password manager to generate a secure string.
    - `SERVERLESS_PROCESSOR_URL` - The URL to your serverless processor.
    - `EVENTSUB_API_URL` - The URL to your eventsub backend.
    - `API_KEYS` - A comma separated list of API keys. (you can just do `API_KEYS="abc"`)
