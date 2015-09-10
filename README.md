TODO:

- Make the frame increments time dependant...
- Add contextual stuff to the game (intro, player hit, player dead)...
- Make health and special counter parallel to the reflection

*The Odul Mages* is a local multiplayer game for two people who must share/fight over the keyboard in order to defeat their foe in this take on a 2D fighting game!

# THE ODUL MAGES #

There are only two mages who remain on on the Odul plains after their brethren where locked away. They are bound by and ancient vow so must stay together... But they really hate each other. 

So they spend all their time firing spells and generally trying to injure/annoy their fellow mage. Due to their limited power, only one mage can cast a spell at a time, so each must compete to harness the power of the mages by pressing the correct ~~keys~~ runes to be chosen as the mage who can cast a spell.

Although these reluctant companions detest one another, they respect the rules of mage combat. The mage who does not have the ability to cast a spell can press the ~~keys~~ runes in the correct order to reverse the spell - yeah!

And it just goes on and on until one mage wins. And then it starts again.

### Compiling locally
If you want to get this running locally to edit or whatever, clone the repo and then `$ npm install` to install all the dependencies. To build, run:
```
$ gulp build
$ gulp zip
```
Zip is optional, but that's how I got it under 13k as per the rules of JS13K :rocket:

### A note on quality
The game isn't as polished as I would have liked, and the code is a bit of a mess but it's my first game and I spent **a lot** of time learning how to do this on `<canvas>`. So that aside, the game loop is complete and works so although I ran out of time I still managed to submit it to to JS13K 2015 - the best thing about this jam is that it got me thinking and forced me to actually call something 'good enough' and submit it! :smile: