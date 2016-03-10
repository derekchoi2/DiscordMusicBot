var Discord = require("discord.js");
var http = require("http");
var fs = require("fs");
var q = require("q");

var mybot = new Discord.Client();
var list;
var dir = "music/";
var playlist;
var playlistName;
var index;
var playing = false;

function contains(string, substring) {
    return string.indexOf(substring) > -1;
}

mybot.on("ready", function () {
    mybot.setStatus("idle", null);
});

//debug console messages
mybot.on("debug", function (e) {
    console.log(e);
});

mybot.on("message", function (message) {
    var input = message.content;

    if (input.substr(0, 1) == "!") {
        if (input == "!join") {

            if (message.author.voiceChannel == null) {
                send("```author not in voice channel, don't know where to join```");

            } else if (mybot.voiceConnection == null) {
                mybot.joinVoiceChannel(message.author.voiceChannel);
            } else {
                send("```bot is already in a voice channel. !leave to leave channel```");
            }
            list();
        } else if (input == "!leave") {
            if (mybot.voiceConnection != null) {
                mybot.leaveVoiceChannel();
            } else {
                send("```bot is not in a voice channel```");
            }


        } else if (input == "!list") {
            //list all files in playlist
            if(playlistName != null) {
                list = fs.readdirSync(dir);
                var m = "```";
                for (var i = 0; i < list.length; i++) {
                    m += i + ". " + list[i] + "\n";
                }
                m += "```";
                send("Songs in `" + playlistName + "`\n" + m);
            } else {
                send("```Select playlist using !playlist #```")
            }

        } else if (contains(input, "!playlist") && input.length >= 9){
            //
            playlist = fs.readdirSync("music");

            if (is_int(input.substr(10))){
                //playlist selection
                var playlistIndex = parseInt(input.substr(10), 10);
                playlistName = playlist[playlistIndex];
                dir = "music/" + playlistName + "/";
                send("```Playlist " + playlistName + " selected```");


            } else if (input.length <= 10){
                //show playlists
                var playlistMsg = "```";
                for (var j = 0; j < playlist.length; j++){
                    playlistMsg += j + ". " + playlist[j] + "\n";
                }
                playlistMsg += "```";
                send("Playlists\n" + playlistMsg);
            }


        } else if (contains(input, "!play") && input.length > 6) {
            //play command
            list = fs.readdirSync(dir);
            if (is_int(input.substr(6))) {
                index = parseInt(input.substr(6), 10);
                playlist = fs.readdirSync(dir);
                if (mybot.voiceConnection == null) {
                    send("```Bot not in a voice channel```");
                } else if (index >= list.length) {
                    send("```index too big. song doesn't exist```");
                } else if (mybot.voiceConnection.playing){
                    send("```Music is playing. !stop to stop it first```");
                } else {
                    playing = true;
                    play(index);
                }
            } else {
                send("```invalid index```")
            }

        } else if (input == "!skip") {
            if (playing) {
                mybot.voiceConnection.stopPlaying();
            } else {
                send("```Nothing is playing```");
            }
        } else if (input == "!stop") {
            if (playing) {
                mybot.setStatus("idle", null);
                send("```Music stopped```");
                playing = false;
                mybot.leaveVoiceChannel().then(mybot.joinVoiceChannel(message.author.voiceChannel));
            } else {
                send("```Nothing is playing```");
            }

        } else if (input == "!upload") {
            send("```" + credentials.upload + "```")
        } else if (input == "!roll") {

            mybot.reply(message, "rolled " + Math.floor((Math.random() * 100) + 1));

        } else if (input == "!help") {
            send("```" +
                "!join - make bot join channel  \n" +
                "!leave - make bot its channel \n" +
                "!playlist - list playlists and index, select with !playlist # \n" +
                "!list - list songs in chosen playlist and their index \n" +
                "!play # - plays song with # from !list. e.g. !play 1 \n" +
                "!skip - skip current song \n" +
                "!stop - stop music playback \n" +
                "!roll - random 1-100 \n" +
                "!upload - how to upload \n" +
                "```")
        } else {
            send("```Invalid command. !help for command list```");

        }
    }

    function send(m) {
        mybot.sendMessage(message, m);
    }

    function list() {
        list = fs.readdirSync("music");
    }

    function play(i) {
        //get filename
        if (playing) {
            var incremented = false; //track increment from intent
            list = fs.readdirSync(dir);
            var filename = list[i];
            mybot.setStatus("online", filename);
            send("```Now Playing: " + filename + "```");
            //play file from index
            mybot.voiceConnection.playFile(dir + filename, {volume: '0.5'}).then(function () {
                mybot.voiceConnection.playingIntent.on("end", function () {
                    if (!incremented){
                        index++;
                        list = fs.readdirSync(dir);
                        index = index % list.length;
                        incremented = true;
                    }
                    play(index);
                });
            });
        }


    }

    function is_int(value) {
        if ((parseFloat(value) == parseInt(value)) && !isNaN(value)) {
            return true;
        } else {
            return false;
        }
    }


});

//get credentials from file
var credentials = JSON.parse(fs.readFileSync("credentials.json"));

mybot.login(credentials.email, credentials.password);
