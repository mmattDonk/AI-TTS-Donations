# AI-TTS-Donations
[![Discord](https://img.shields.io/discord/883929594179256350?label=Discord)](https://discord.gg/mvVePs2Hs2)
[![pre-commit.ci status](https://results.pre-commit.ci/badge/github/mmattDonk/AI-TTS-Donations/main.svg)](https://results.pre-commit.ci/latest/github/mmattDonk/AI-TTS-Donations/main)

💰 A bot that uses Uberduck AI to make bit donations have an AI voice.

### Are you a viewer?
Check the instructions [here!](https://mmatt.link/UseTTS)

### Prerequisites
1. [Python 3.8+](https://www.python.org/downloads/)

### How to run

1. Clone the repo
2. Obtain the following keys:

    1. [An Uberduck API key and secret](https://uberduck.ai/account/manage)
    2. [A Twitch Client Id and secret](https://dev.twitch.tv/console/apps/create)
        - Add an OAuth Redirect URI of both `http://localhost:17563/` and `http://localhost:17563`
        - You **HAVE** to put **BOTH URIs**.

3. Create a .env with the following keys:
    ```
    UBERDUCK_USERNAME=<The "Key" from uberduck.ai>
    UBERDUCK_SECRET=<The "Secret" from uberduck.ai>
    TWITCH_CLIENT_ID=<The "Client Id" from dev.twitch.tv>
    TWITCH_SECRET=<The "Client Secret" from dev.twitch.tv>
    TWITCH_USERNAME=<The streamer's Twitch username from twitch.tv>
    ```
Replace the <> Notes entirely when pasting in your keys.

Example:

    UBERDUCK_USERNAME=USENAMETHISISAREALUSERNAMELOL
    UBERDUCK_SECRET=THISISAREALSECRETTOTALLYLOL
    TWITCH_CLIENT_ID=CANTGETMORECLIENTIDTHENTHIS
    TWITCH_SECRET=CANTGETMORESECRET
    TWITCH_USERNAME=mmattbtw

4. Create a config.json with the following keys:
    ```jsonc
    {
        "MAX_MSG_LENGTH": 300, // The maximum character length for the donation message.
        "MIN_BIT_AMOUNT": 1, // The minimum amount of bits to donate for the TTS to activate.
        // ^ I'd recommend setting the minimum bit amount to be -1 of the actual limit you want to set, just in case
        "BITS_OR_CHANNEL_POINTS": "channel_points" or "bits", // What type of even to listen for, you can either do channel points or bits, but not both at the moment
        "CHANNEL_POINTS_REWARD": "reward name here", // The reward name for your Channel Point reward, if you are using channel points.
        "BLACKLISTED_WORDS": ["weirdchamp", "bad_word", "bad_words_go_here"], // A list of words that will be blacklisted from the TTS.
        "QUERY_TRIES": 100 // The number of times to query the API for a TTS response
        // (also remove all of these // comments before you start the bot)
    }
    ```

5. Run `python3 bot.py`
    - This will install all of the needed dependencies and start the bot.


### Developers
We use `pre-commit` and `pre-commit.ci` to make sure that Pull Requests are quality, even before you commit your changes.

Use `pip install -r requirements-dev.txt` to install the developer dependencies needed.

To install `pre-commit`, do the `pre-commit install` command.

### 🙌 Code Contributors

<table>
<tr>
    <td align="center" style="word-wrap: break-word; width: 150.0; height: 150.0">
        <a href=https://github.com/mmattbtw>
            <img src=https://avatars.githubusercontent.com/u/30363562?v=4 width="100;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px" alt=matt/>
            <br />
            <sub style="font-size:14px"><b>matt</b></sub>
        </a>
    </td>
    <td align="center" style="word-wrap: break-word; width: 150.0; height: 150.0">
        <a href=https://github.com/MrAuro>
            <img src=https://avatars.githubusercontent.com/u/35087590?v=4 width="100;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px" alt=Auro/>
            <br />
            <sub style="font-size:14px"><b>Auro</b></sub>
        </a>
    </td>
    <td align="center" style="word-wrap: break-word; width: 150.0; height: 150.0">
        <a href=https://github.com/12beesinatrenchcoat>
            <img src=https://avatars.githubusercontent.com/u/25379179?v=4 width="100;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px" alt=Andy Chan/>
            <br />
            <sub style="font-size:14px"><b>Andy Chan</b></sub>
        </a>
    </td>
</tr>
</table>
