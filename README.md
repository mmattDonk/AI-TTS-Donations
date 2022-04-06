# AI TTS Donations
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
[![Discord](https://img.shields.io/discord/883929594179256350?label=Discord)](https://discord.gg/mvVePs2Hs2)
[![pre-commit.ci status](https://results.pre-commit.ci/badge/github/mmattDonk/AI-TTS-Donations/main.svg)](https://results.pre-commit.ci/latest/github/mmattDonk/AI-TTS-Donations/main)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/e98081b2d30849c8b388ded89ca92cf8)](https://www.codacy.com/gh/mmattDonk/AI-TTS-Donations/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=mmattDonk/AI-TTS-Donations&amp;utm_campaign=Badge_Grade)
[![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/mmattdonk/ai-tts-donations)](https://github.com/mmattDonk/AI-TTS-Donations/releases)

💰 A bot that uses Uberduck (and now FakeYou!) AI to make bit (or channel points or streamelements tips!) donations have an AI voice.

### 👀 Are you a viewer?
Check the instructions [here!](https://mmatt.link/UseTTS)

### 🔧 Prerequisites
1. [Python 3.8+](https://www.python.org/downloads/)
   - ** **MAKE SURE PYTHON IS ADDED TO PATH WHILE INSTALLING.** **
      - This can avoid an error that Python doesn't exist in steps 4/5. To add Python to path after Python has already been installed, please follow [this guide](https://datatofish.com/add-python-to-windows-path/)
1. [Git](https://git-scm.com/download/)
    - This is required for a dependency we use, which is now being built/cloned directly from GitHub. Just simply use the installer, and spam the "Next" button until it starts installing. As usual, join the Discord in case you have problems!
    - You can also install this through the command line on Windows (11?) by using `winget`.
        - `winget install --id Git.Git -e --source winget`

### 🏃 How to run
1. Clone the repo
    * You can do `git clone https://github.com/mmattdonk/ai-tts-donations` or just download the ZIP from GitHub
1. Generate your configuration files using this website: https://mmattdonk.github.io/AI-TTS-Donations/
    * Simply enter in the required keys into the website, then download the configuration files and put them into your bot's folder.
1. Install Prerequisites
    * [On Windows] Open the `scripts` folder, then run the `install-python.bat` file and the `install-git.bat` file. This will install everything you need.
    * [On Macos/Linux] Install Python and Git [(using the links above)](#🔧-prerequisites). Then install the dependencies by running `pip install -r requirements.txt`.
1. Start the bot - Open `bot.py`
    * You can open this in a Terminal too: `python bot.py`

After this, you just login with the website that opens in your default browser, and you are all good to go! If you have any errors/problems, don't be afraid to join the [Discord Server](https://discord.gg/mvVePs2Hs2) for help.

### 💻 Developers
We use `pre-commit` and `pre-commit.ci` to make sure that Pull Requests are quality, even before you commit your changes.

Use `pip install -r requirements-dev.txt` to install the developer dependencies needed.

To install `pre-commit`, do the `pre-commit install` command.

Need extra logs? Use `python bot.py dev` to launch the bot.

### Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://mmatt.net"><img src="https://avatars.githubusercontent.com/u/30363562?v=4?s=100" width="100px;" alt=""/><br /><sub><b>matt</b></sub></a><br /><a href="#infra-mmattbtw" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/mmattDonk/AI-TTS-Donations/commits?author=mmattbtw" title="Code">💻</a> <a href="#design-mmattbtw" title="Design">🎨</a> <a href="#audio-mmattbtw" title="Audio">🔊</a> <a href="https://github.com/mmattDonk/AI-TTS-Donations/commits?author=mmattbtw" title="Documentation">📖</a> <a href="#example-mmattbtw" title="Examples">💡</a> <a href="#maintenance-mmattbtw" title="Maintenance">🚧</a> <a href="#business-mmattbtw" title="Business development">💼</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
