---
sidebar_position: 0
---

# Processor Setup

The processor service was hosted on [Google Cloud](https://console.cloud.google.com/) during Solrock's lifetime. We will be setting up both the serverless processor and
the bucket that the processor will upload files to.

## Requirements

-   An [Uberduck](https://auth.uberduck.ai/en/signup) account.
-   A [FakeYou](https://fakeyou.com/signup) account.
-   A Soketi server, see [Soketi Setup](./Soketi-setup)
-   A frontend service, see [Frontend Setup](./frontend-setup)
-   An eventsub backend, see [Backend Setup](./backend-setup)

:::caution

This is the most scuffed part of setup, and _yes_ is actually how Solrock was ran in production. 😅

:::

## Setup

1. Sign up for an account on [Google Cloud](https://console.cloud.google.com/).
1. Fork the [Solrock repository](https://github.com/mmattDonk/AI-TTS-Donations/fork).
1. Download your fork of the repository locally. (Weather through `git clone` or by downloading the zip on github.com)
1. Create a file in the `apps/processor` directory called `.env`.
1. Go back to Google Cloud and setup a [Service Account](https://console.cloud.google.com/projectselector2/iam-admin/serviceaccounts?supportedpurview=project)

    - Name the account
        - ![Name the account](/img/screenshots/processor-setup/s1.png)
    - Click "Create and Continue", then give it the `Storage Admin` role.
        - ![Give it the Storage Admin role](/img/screenshots/processor-setup/s2.png)
    - Click "Done".
    - Click on the newly created service account.
    - Go to "Keys"
    - Click "Add Key" > "Create new key"
    - Select "JSON"
    - Click "Create"
    - Download the JSON file, and move it to the `apps/processor` directory.

1. Go to [Google Cloud Storage](https://console.cloud.google.com/storage/browser) and create a bucket.
    - Name the bucket `solrock-files`
    - Click "Create"
    - Click on the newly created bucket.
    - Click "Permissions"
    - Click `Grant Access`
    - In the "New principals" field, type `allUsers`
    - In the "Select a role" dropdown, select `Storage Object Creator`
    - Click "Save"
    - Click "Allow public access"
1. How to setup environment variables:
    - Environment variables are stored in a file called `.env` and are setup in the following format.
    - `KEY=VALUE`
    - For example, if you wanted to set the `UBERDUCK_USERNAME` environment variable, you would do the following:
        - `UBERDUCK_USERNAME=pub_whatever`
1. Setup environment variables.

    - `UBERDUCK_USERNAME` - Go to [Uberduck Account Settings](https://app.uberduck.ai/settings) and create an API key, the `Key` is your `UBERDUCK_USERNAME` and your
      `Secret Key` is your `UBERDUCK_SECRET`.
    - `UBERDUCK_SECRET` - See above.
    - `FAKEYOU_API_KEY` - [FakeYou says that you need to reach out to them over Discord](https://docs.fakeyou.com/#/). [Their Discord](https://discord.gg/H72KFXm). Pretty
      sure this isn't required.
    - `API_URL` - The URL to your frontend service.
    - `API_SECRET` - A random string, use a password manager to generate a secure string. (THIS IS SHARED ACROSS ALL SERVICES, MAKE SURE IT'S THE SAME)
    - `SOKETI_URL` - The URL to your Soketi server.
    - `SOKETI_PORT` - The port to your Soketi server.
    - `SOKETI_APP_ID` - The app ID to your Soketi server.
    - `SOKETI_APP_SECRET` - The app secret to your Soketi server.
    - `SOKETI_APP_KEY` - The app key to your Soketi server.
    - `GOOGLE_APPLICATION_CREDENTIALS` - The path to your Google Cloud service account credentials file.
        - Example: `./tempo-fortnite-numbers-letters.json`

1. Go to [Google Cloud Functions](https://console.cloud.google.com/functions)

    - Click "Create Function"
    - Name the function `solrock-processor`
    - Under Authentication, select "Allow unauthenticated invocations"
    - If needed, under "Runtime, build, connections and security settings" allocate more memory to the function.
    - Click next
    - Under "Runtime" select "Python 3.10"
    - Keep the "Entry point" as `hello_http`
    - Under "Source code" select "ZIP Upload"
    - In your `apps/processor` directory, select all the files inside of it and zip them.
        - (Make sure you don't zip the `apps/processor` directory itself, just the files inside of it)
    - Click `Browse` on "Destination bucket", create a new bucket (button on top right), name it `solrock-processor`, and click "Create", then "Select".
    - Click `Browse` on "ZIP file", select the zip file you just created, and click "Select".
    - Click `Deploy`.

Near the top, you will see your function's URL.
