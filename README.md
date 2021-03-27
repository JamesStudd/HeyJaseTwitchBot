# hey_jase Guess Counter

This is a Twitch chat listener that works exclusively when multiple people guess on a casket that Jase is about to open. Started as a hacky project, still is a hacky project but slightly nicer.
I'm sure there a lot of changes that could be made, major goals would be:
- Making it fully automated
  - Would require a small change to allow the "bot" to post messages
  - Would require a change to get the actual chest amount from stream, either by someone posting it each time (one of Jase's many determined mods) or maybe by some image analysis.
- Making it less hacked together
- Adding more analysis
  - Would be cool to count PepePls / JasePls / TriDance / TreeDance / pepeD and use Shazam to workout the "best" songs.
- Save all the guesses and do some long term analysis
  - Something like guesses per week, average viewers over time, etc.

For the puposes of the repo I'll refer to this as a "bot", but really it's just a listener. It is entirely possible for it to post messages, just needs a slight code change (passing in an OATH token to allow a login).

Please feel free to do anything with this repo, download it, use it, develop it, make a merge request, bin it, whatever.

## Overview - How does it (barely) work?
This bot requires heavily on [tmi.js](https://github.com/tmijs). It connects anonymously to a twitch chat and logs each message.  
If enough messages come through, E.G. 10 messages in 5 seconds, then the messages are checked, if at least 5 of them are guesses (100k, 100m, 1000gp, 100000, etc) then it carries on processing each message that comes through.  
It also checks for special words, such as "mimic", "bloodhound"/"bh"/"pet"/"hound"/"dog", "jaseCasket" to provide some more fun statistics.  
It also checks for whether the author of the message is a mod, sub or normal user.  
Once hey_jase types in chat (and it isn't a link) the guesses are processed further (total guess, average, total seconds) and saved to a file  
Once I (or anyone else once you setup the config) types (E.G.) "answer: 400k", the file is read and the winner is worked out.  
The message is posted to the console.  

The message could be sent via a bot if the OATH is added. 

## How to develop / use
You will need:  
- Node.js
- npm/yarn  
- More time than sense 

1. Clone the repo  
2. Open the terminal in the folder  
3. Type `npm install` to install all of the libraries (think this also installs dev libraries, if not run `npm install --only=dev`
4. Change the `config.js` if needed
5. Type `npm run dev` and the bot will connect to twitch chat  

Can also run any of the following commands (E.G. `npm run test-watch`):  
- "dev-debug"
  - Runs the bot but also debug logs some stuff (all messages sent)
- "test"
  - Runs the Jest tests, just for Util functions
- "test-watch"
  - Runs the Jest tests but hot reloads if a change is made
- "test-messages"
  - Sends a bunch of random messages to "test" the message handler, basically emulates twitch chat.
