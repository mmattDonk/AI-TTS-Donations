# AI TTS Donations
[![Discord](https://img.shields.io/discord/883929594179256350?label=Discord)](https://discord.gg/mvVePs2Hs2)
[![pre-commit.ci status](https://results.pre-commit.ci/badge/github/mmattDonk/AI-TTS-Donations/main.svg)](https://results.pre-commit.ci/latest/github/mmattDonk/AI-TTS-Donations/main)
[![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/mmattdonk/ai-tts-donations)](https://github.com/mmattDonk/AI-TTS-Donations/releases)

💰 A bot that uses Uberduck (and now FakeYou!) AI to make bit donations have an AI voice.

### 👀 Are you a viewer?
Check the instructions [here!](https://mmatt.link/UseTTS)

### 🔧 Prerequisites
1. [Python 3.8+](https://www.python.org/downloads/)
   - ** **MAKE SURE PYTHON IS ADDED TO PATH WHILE INSTALLING.** **
      - This can avoid an error that Python doesn't exist in steps 4/5. To add Python to path after Python has already been installed, please follow [this guide](https://datatofish.com/add-python-to-windows-path/)
2. [Git](https://git-scm.com/download/)
    - This is required for a dependency we use, which is now being built/cloned directly from GitHub. Just simply use the installer, and spam the "Next" button until it starts installing. As usual, join the Discord in case you have problems!
    - You can also install this through the command line on Windows (11?) by using `winget`.
        - `winget install --id Git.Git -e --source winget`

### 🏃 How to run

1. Clone the repo
    * You can do `git clone https://github.com/mmattdonk/ai-tts-donations` or just download the ZIP from GitHub
2. Generate your configuration files using this website: https://mmattdonk.github.io/AI-TTS-Donations/
    * Simply enter in the required keys into the website, then download the configuration files and put them into your bot's folder.
4. Install Dependencies - Run `python -m pip install -r requirements.txt` in a Terminal/PowerShell/Command Prompt window (that is in the same directory as the bot.py file)
5. Start the bot - Run `python bot.py` in a Terminal/PowerShell/Command Prompt window

After this, you just login with the website that opens in your default browser, and you are all good to go! If you have any errors/problems, don't be afraid to join the [Discord Server](https://discord.gg/mvVePs2Hs2) for help.

### 💻 Developers
We use `pre-commit` and `pre-commit.ci` to make sure that Pull Requests are quality, even before you commit your changes.

Use `pip install -r requirements-dev.txt` to install the developer dependencies needed.

To install `pre-commit`, do the `pre-commit install` command.

### 👥 Contributors
([emoji key](https://github.com/all-contributors/all-contributors#emoji-key)):
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- ALL-CONTRIBUTORS-LIST:END -->
