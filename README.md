# DiscordMusicBot
Personal Music Bot

create `credentials.json` in same directory as bot.js as shown below to authenticate the bot

    {
      "email" = "example@example.com",
      "password" = "password",
      "upload" = "upload details"
    }
  
create folder "music" in same directory as bot.js to store music files to play

Run `node bot.js` to start the bot.

Can use `forever` to keep the bot running, and restart it if it crashes.

    sudo apt-get install forever
    
Use `forever` like this

    forever start bot.js //start
    forever stop bot.js //stop
    forever restart bot.js //restart
    

Requires discord.js from npm.

    npm install discord.js

Commands
--------
    !join - Makes bot join the author's channel
    !leave - Makes bot leave current channel
    !playlist - list playlists. !playlist # to select
    !list - list songs in selected playlist
    !play # - plays song with index # from !list. e.g. !play 1
    !skip - skip current song
    !stop - stop music playback
    !roll - random number 1-100
    !upload - provies details on how to upload to music folder

I'm using this on Ubuntu 14.04 hosted on DigitalOcean.

SFTP user created with access only to the music folder, so users can upload their own music.
