---
sidebar_position: 3
---

# Database Setup

The database was hosted on [Railway](https://railway.app?referralCode=mmatt) during Solrock's lifetime. Railway can be used to host a variety of services, including the
[Redis & Postgres databases](./database-setup), and the [Soketi server](./soketi-setup).

## Requirements

-   A [Railway account](https://railway.app?referralCode=mmatt)

## Setup

### PostgreSQL

1. Sign up for an account on [Railway](https://railway.app?referralCode=mmatt).
1. [Create a new project on Railway, and click "Provision PostgreSQL".](https://railway.app/new/)
1. Deploy the project.
1. Click on the Postgres database, and go to "Variables".
1. Copy the `DATABASE_URL`
1. Paste it into the environment variables you need.
1. Also, paste your `DATABASE_URL` into the `.env` file in the `packages/prisma` directory.
    - Example:
        - ```env
          DATABASE_URL=postgres://user:password@host:port/dbname
          ```
1. Open a terminal in the `packages/prisma` directory.
1. Run `pnpm i && pnpm db-push`
1. Your database should be setup!

### Redis

1. Sign up for an account on [Railway](https://railway.app?referralCode=mmatt).
1. [Create a new project on Railway, and click "Provision Redis".](https://railway.app/new/)
1. Deploy the project.
1. Click on the Postgres database, and go to "Variables".
1. Copy the `REDIS_URL`
1. Paste it into the environment variables you need.
1. Your Redis database should be setup!
