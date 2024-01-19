---
sidebar_position: 4
---

# Soketi Setup

The Soketi server was hosted on [Railway](https://railway.app?referralCode=mmatt) during Solrock's lifetime. Railway can be used to host a variety of services, including
the [Redis & Postgres databases](./database-setup), and the [Soketi server](./soketi-setup).

## Requirements

-   A [Railway account](https://railway.app?referralCode=mmatt)

## Setup

1. Sign up for an account on [Railway](https://railway.app?referralCode=mmatt).
1. [Create a new project on Railway, and click "Provision Soketi".](https://railway.app/new/)
1. Deploy the project.
1. Click on the Postgres database, and go to "Variables".
1. Copy & Paste the variables you need.
1. Your Soketi server should be setup!

:::tip

Use `SOKETI_PUBLIC_HOST` / `SOKETI_PUBLIC_PORT` for `SOKETI_URL` and `SOKETI_PORT`

:::
