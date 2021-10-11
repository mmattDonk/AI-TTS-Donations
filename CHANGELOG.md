# CHANGELOG

## Unreleased

Changes unreleased.

### Feature

- core:
  - Use custom number of checks (#39) ([f6ef53c](https://github.com/mmattDonk/AI-TTS-Donations/commit/f6ef53cd84a12d6fc79dd9b3c217bc6e4406386f)) ([#39](https://github.com/mmattDonk/AI-TTS-Donations/pull/39))

### Bug Fixes

- core:
  - Made the bot re-request if TTS request fails (#36) ([6851250](https://github.com/mmattDonk/AI-TTS-Donations/commit/6851250fdbdd2bf89ab812b6eb65b467704fbd25)) ([#36](https://github.com/mmattDonk/AI-TTS-Donations/pull/36))

### Documentation

- README:
  - config json → jsonc (#43) ([aa73727](https://github.com/mmattDonk/AI-TTS-Donations/commit/aa73727fabeea80d7909d3b482ced66bc75888a2)) ([#43](https://github.com/mmattDonk/AI-TTS-Donations/pull/43))
  - Clarified you need to put both URIs in Dev Console ([5dd6775](https://github.com/mmattDonk/AI-TTS-Donations/commit/5dd67750618b0b6782b8e5c17ef4d97ddd088211))
  - Added more clarification about the notes in .env ([8c42825](https://github.com/mmattDonk/AI-TTS-Donations/commit/8c42825a6da0c3c58ad2ed8630d37c7ac56744e5))

## [v1.4.0](https://github.com/mmattDonk/AI-TTS-Donations/releases/tag/v1.4.0) - 2021-10-09 19:43:11

## What's Changed
* feat(core): Support all cheermotes by @mmattbtw in https://github.com/mmattDonk/AI-TTS-Donations/pull/29
* chore(ui): [ImgBot] Optimize images by @imgbot in https://github.com/mmattDonk/AI-TTS-Donations/pull/31
* feat(limits): Added a blacklisted words limit by @mmattbtw in https://github.com/mmattDonk/AI-TTS-Donations/pull/33

## New Contributors
* @imgbot made their first contribution in https://github.com/mmattDonk/AI-TTS-Donations/pull/31

**Changelog**: https://github.com/mmattDonk/AI-TTS-Donations/blob/main/CHANGELOG.md
**Full Changelog**: https://github.com/mmattDonk/AI-TTS-Donations/compare/v1.3.0...v1.4.0

### Feature

- limits:
  - Added a blacklisted words limit (#33) ([57ce7f3](https://github.com/mmattDonk/AI-TTS-Donations/commit/57ce7f3abf0833ba7c3c22e927a337cbf3c7b78f)) ([#33](https://github.com/mmattDonk/AI-TTS-Donations/pull/33))

- core:
  - Support all cheermotes (#29) ([5c3962b](https://github.com/mmattDonk/AI-TTS-Donations/commit/5c3962ba61d31e1aedf878bda315a8cada6b5bff)) ([#29](https://github.com/mmattDonk/AI-TTS-Donations/pull/29))

### Bug Fixes

- ui:
  - Get rid of unused text on the top bar ([37b20ac](https://github.com/mmattDonk/AI-TTS-Donations/commit/37b20ac8bd126f9a6811e4b09b17fa734a463344))

## [v1.3.0](https://github.com/mmattDonk/AI-TTS-Donations/releases/tag/v1.3.0) - 2021-10-09 18:55:21

## What's Changed
* feat(core): Added channel points as an option. by @mmattbtw in https://github.com/mmattDonk/AI-TTS-Donations/pull/26
* feat(ui): Added ui by @mmattbtw in https://github.com/mmattDonk/AI-TTS-Donations/pull/24

## Known bugs in this release:
#27

**Changelog**: https://github.com/mmattDonk/AI-TTS-Donations/blob/main/CHANGELOG.md
**Full Changelog**: https://github.com/mmattDonk/AI-TTS-Donations/compare/v1.2.1...v1.3.0

### Feature

- ui:
  - Added ui (#24) ([6a7fd1f](https://github.com/mmattDonk/AI-TTS-Donations/commit/6a7fd1fe4619552f2814c77f23ebf7bbba6677af)) ([#24](https://github.com/mmattDonk/AI-TTS-Donations/pull/24))

- core:
  - Added channel points as an option. (#26) ([e8b7883](https://github.com/mmattDonk/AI-TTS-Donations/commit/e8b7883b9675af68b06f8741b6a18e32088e6aea)) ([#26](https://github.com/mmattDonk/AI-TTS-Donations/pull/26))

### Bug Fixes

- bug:
  - Fixed the auto-delete bug. ([1fd25cc](https://github.com/mmattDonk/AI-TTS-Donations/commit/1fd25cc42e56d0d2e4826fda51ac01713b7a22ce))

## [v1.2.1](https://github.com/mmattDonk/AI-TTS-Donations/releases/tag/v1.2.1) - 2021-10-09 03:25:52

## Fixed the auto-delete bug.


**Changelog**: https://github.com/mmattDonk/AI-TTS-Donations/blob/main/CHANGELOG.md
**Full Changelog**: https://github.com/mmattDonk/AI-TTS-Donations/compare/v1.2.0...v1.2.1

## [v1.2.0](https://github.com/mmattDonk/AI-TTS-Donations/releases/tag/v1.2.0) - 2021-10-08 23:01:53

**Changelog**: https://github.com/mmattDonk/AI-TTS-Donations/blob/main/CHANGELOG.md

**Full Changelog**: https://github.com/mmattDonk/AI-TTS-Donations/compare/v1.1.0...v1.2.0

### Feature

- core:
  - Made it stop requesting once it fails. ([eb9a582](https://github.com/mmattDonk/AI-TTS-Donations/commit/eb9a582d423fb950c7e1fe33fa5622dd57585384))

- LOGGING:
  - Made it show how many checks it does total. ([d2fd675](https://github.com/mmattDonk/AI-TTS-Donations/commit/d2fd675199a37d31488c58d553aaaf0b49504b95))

### Bug Fixes

- core:
  - Fixed a bug by waiting to remove audio. ([f3782ee](https://github.com/mmattDonk/AI-TTS-Donations/commit/f3782ee6f82f4b6a04c84598ab72ca592bb81e49))

- LOGGING:
  - Reworded logs & quit after 100 false "danks" (#20) ([1c453df](https://github.com/mmattDonk/AI-TTS-Donations/commit/1c453df324bb0705dbc0cb0709509d8e027b56b7)) ([#20](https://github.com/mmattDonk/AI-TTS-Donations/pull/20))

### Documentation

- README:
  - Added Discord badge. ([c5f9059](https://github.com/mmattDonk/AI-TTS-Donations/commit/c5f9059702ff43dc1518e659b2986f51c2745aba))

### Refactor

- core:
  - Refactor if/else statement ([139f849](https://github.com/mmattDonk/AI-TTS-Donations/commit/139f84921396af0a4d9df96dd932468fe321c3f9))

## [v1.1.0](https://github.com/mmattDonk/AI-TTS-Donations/releases/tag/v1.1.0) - 2021-10-07 00:37:19

# Added limits.
If you need a `config.json` file, checkout the README


## What's Changed
* feat(limits): Added limits. by @mmattbtw in https://github.com/mmattDonk/AI-TTS-Donations/pull/14


**Full Changelog**: https://github.com/mmattDonk/AI-TTS-Donations/compare/v1.0.0...v1.1.0
**Changelog**: https://github.com/mmattDonk/AI-TTS-Donations/blob/main/CHANGELOG.md

### Feature

- limits:
  - Added limits. (#14) ([f95ea07](https://github.com/mmattDonk/AI-TTS-Donations/commit/f95ea074e52ceb098319aa50f11c9757e9d109cc)) ([#14](https://github.com/mmattDonk/AI-TTS-Donations/pull/14))

### Documentation

- README:
  - Updated README with config.json comments ([5a56e84](https://github.com/mmattDonk/AI-TTS-Donations/commit/5a56e84cfeb352e12cb7243cc7fac7cd2a986b1e))

## [v1.0.0](https://github.com/mmattDonk/AI-TTS-Donations/releases/tag/v1.0.0) - 2021-10-06 23:03:18

The bot is stable!
If you would like help setting up the bot, dm me on Discord/Twitter @mmattbtw/mmatt#9926
## What's Changed
* docs(README): Added documentation on how to run the bot by @MrAuro in https://github.com/mmattDonk/AI-TTS-Donations/pull/2
* feat(core): Release 1.0 is ready by @mmattbtw in https://github.com/mmattDonk/AI-TTS-Donations/pull/4

## New Contributors
* @MrAuro made their first contribution in https://github.com/mmattDonk/AI-TTS-Donations/pull/2
* @mmattbtw made their first contribution in https://github.com/mmattDonk/AI-TTS-Donations/pull/4

**Full Changelog**: https://github.com/mmattDonk/AI-TTS-Donations/commits/v1.0.0
**Changelog**: https://github.com/mmattDonk/AI-TTS-Donations/blob/main/CHANGELOG.md

### Feature

- core:
  - Re-add the auto update tool ([4bc083c](https://github.com/mmattDonk/AI-TTS-Donations/commit/4bc083cec6d6b3cd461e629d73fe6872f7716620)) ([#4](https://github.com/mmattDonk/AI-TTS-Donations/pull/4))
  - Made some progress ([5aaa3c1](https://github.com/mmattDonk/AI-TTS-Donations/commit/5aaa3c1d0451d85be2867206e49473d11515734e)) ([#4](https://github.com/mmattDonk/AI-TTS-Donations/pull/4))
  - Release 1.0 is ready ([37be429](https://github.com/mmattDonk/AI-TTS-Donations/commit/37be429006ea2de0343dccc7e81dbf6597b56ed8)) ([#4](https://github.com/mmattDonk/AI-TTS-Donations/pull/4))
  - Bot at least stays online ([d195eb8](https://github.com/mmattDonk/AI-TTS-Donations/commit/d195eb884cd030524bf53e54d26b9e5a793e2d87))
  - Added the bot's core. ([30bb93b](https://github.com/mmattDonk/AI-TTS-Donations/commit/30bb93bd46e556309e4e2c6ebb16ef2b4d362205))

- audio:
  - Change audio file name ([b222661](https://github.com/mmattDonk/AI-TTS-Donations/commit/b2226615216b0acb761d46eb5fe559466d0071a2)) ([#4](https://github.com/mmattDonk/AI-TTS-Donations/pull/4))

### Bug Fixes

- core:
  - Downgraded playsound to fix a bug ([7514817](https://github.com/mmattDonk/AI-TTS-Donations/commit/7514817112bd6abb3c76c2154b93ea89717a97e6)) ([#4](https://github.com/mmattDonk/AI-TTS-Donations/pull/4))
  - Fixed bit messages not working ([9b3e269](https://github.com/mmattDonk/AI-TTS-Donations/commit/9b3e269834a18284b1e4cb1466d39246f8cf9323)) ([#4](https://github.com/mmattDonk/AI-TTS-Donations/pull/4))

### Documentation

- CONTRIBUTING:
  - Added pip to the build examples. ([6ce52be](https://github.com/mmattDonk/AI-TTS-Donations/commit/6ce52be8808411f57111845c22b813ffbbfaf5aa)) ([#4](https://github.com/mmattDonk/AI-TTS-Donations/pull/4))
  - Added CONTRIBUTING.md ([b83d216](https://github.com/mmattDonk/AI-TTS-Donations/commit/b83d21696594b6380a697d17e12ea16f630ae875))

- README:
  - Added documentation on how to run the bot (#2) ([948c57b](https://github.com/mmattDonk/AI-TTS-Donations/commit/948c57ba063767be9b548f78ecb2f5d67bfd5aaf)) ([#2](https://github.com/mmattDonk/AI-TTS-Donations/pull/2))

\* *This CHANGELOG was automatically generated by [auto-generate-changelog](https://github.com/BobAnkh/auto-generate-changelog)*
