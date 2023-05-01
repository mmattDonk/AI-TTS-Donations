---
sidebar_position: 2
---

# How to use Solrock's AI TTS

AI TTS uses both [Uberduck's](https://uberduck.ai/?via=solrock) and [FakeYou's](https://fakeyou.com) APIs, which basically means there are a **TON** of voices you can use
with this service.

## Basic Syntax:

```
<voice>: <message>
```

(Replace `<voice>` with the voice, and `<message>` with your message.)

### Example:

```
drake: Hello the Twitch Chat on Twitch.tv
```

## Voices:

Since we are using [Uberduck](https://uberduck.ai/?via=solrock) & [FakeYou](https://fakeyou.com), there are thousands upon thousands of voices to choose, while some of
them do work (and work very well), some of them don't, so you can test them out on the [Uberduck](https://uberduck.ai/?via=solrock) website before you donate :)

### How to use a voice from [Uberduck](https://uberduck.ai/?via=solrock)

1. Head on over to [Uberduck.ai](https://uberduck.ai/?via=solrock)
2. Choose a voice! (There is a drop down for a category and the voice itself)
3. After testing the voice in the browser, the URL should say something along the lines of `https://app.uberduck.ai/#voice=<voice here>`
4. Use that voice code (for example `kanye-west-rap` or `drake`) in your TTS message.

:::note

Some voices may have parentheses (`()`) in their voice IDs, make sure to leave them in your message!

:::

#### Example:

```
drake: Hello the Twitch Chat on Twitch.tv
```

### How to use a voice from [FakeYou](https://fakeyou.com)

1. Go to [FakeYou.com](https://fakeyou.com) and find a voice you'd like!
2. Once you chose a voice, click the "See more details about 'Voice' model by 'Username'".
   ![FakeYou.com](https://user-images.githubusercontent.com/30363562/156086311-526456d3-4563-46b8-8a9e-73f23483f4f1.png)
3. In the URL, copy the ID after the / **INCLUDE THE TM:**

![image](https://user-images.githubusercontent.com/30363562/156086486-72c96e6a-24df-4ede-a8f4-f5197085eed3.png)

4. Use that as the Voice ID!

#### Example:

```
TM:rtyasywg9zb7: This is Android 18, I have no clue what this character is, but don't flame me for it
```

## Using Multiple Voices

To use multiple voices, you have to separate each voice by doing `||`.

### Example:

```
ninja: hello everyone || spongebob: me next, me next! || kanye-west-rap: ratio
```

## Using Playsounds

You separate voices and playsounds by using `||`.

Currently, all of the playsounds are sourced from [here](https://www.101soundboards.com/boards/34989-tts-sounds).

### Example:

```
ninja: hey guys! i'm ninja real ninja. || (1) || ninja: that's no good! || spongebob: sonic!
```

## Voice Effects!

The current voice effects are:

```
reverb: Adds reverb to the TTS
pitchup: Pitches the TTS up
pitchdown: Pitches the TTS down
loud: Makes the TTS loud
android: Makes the TTS sound compressed
autotune: Makes the TTS have a pseudo-autotune effect (not very good right now to be honest)
phone: Makes the TTS sound like its on the phone
muffled: Makes the TTS sound like its muffled. (v2.4.1)
```

You can use these by adding a `.` to the end of the voice, then adding the effect, like this: `drake.pitchup` or `kanye-west-rap.reverb`

:::caution

Twitch (and some bots) do think that these are URLs being inputted into chat, make sure you _at least_ disable the Twitch automatic censoring of URLs. If a bot times out
links, the TTS will still go through.

:::

### Example:

```
kanye-west-rap.pitchup: why do i wound like this??? || drake.pitchdown: i don't really know kanye? || (1) || spongebob.loud: AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
```

### Chaining Effects

You can also chain together these effects! Like this: `drake.pitchup.reverb` or `spongebob.pitchup.loud`

#### Example:

```
kanye-west-rap.pitchup.reverb: woah we are in a big room and my voice sounds so high || drake.pitchdown.reverb: yeah? well we are in the same room and my voice sounds lower || spongebob.reverb.loud: i am in the same room but i am really loud. i am going to scream now. AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
```

[![Powered By Vercel](/poweredbyvercel.svg)](https://vercel.com?utm_source=mmattDonk&utm_campaign=oss)
