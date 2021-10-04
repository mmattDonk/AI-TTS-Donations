# AI-TTS-Donations

💰 A bot that uses Uberduck AI to make bit donations have an AI voice.

### How to run

1. Clone the repo
2. Obtain the following keys:

    1. [An Uberduck API key and secret](https://uberduck.ai/account/manage)
    2. [A Twitch Client Id and secret](https://dev.twitch.tv/console/apps/create)
        - Add an OAuth Redirect URI of `http://localhost:17563/`

3. Create a .env with the following keys:
    ```
    UBERDUCK_USERNAME=<The "Key" from uberduck.ai>
    UBERDUCK_SECRET=<The "Secret" from uberduck.ai>
    TWITCH_CLIENT_ID=<The "Client Id" from dev.twitch.tv>
    TWITCH_SECRET=<The "Client Secret" from dev.twitch.tv>
    ```
4. Run `python3 bot.py`
    - This will install all of the needed dependencies and start the bot.

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
</tr>
</table>
