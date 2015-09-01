function game() {

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = 960;
  canvas.height = 540;
  //canvas.style.backgroundColor = 'rgb(0,0,0)';
  var centre = getCanvasCentre();

  var availableKeys = new AvailableKeys();
  var keyStroke = new KeyStroke(availableKeys.getKey());
  var p2Keys = new KeyStroke(availableKeys.getKey());
  var p1 = player(240, canvas.height / 2 + 100, keyStroke);
  var p2 = player(720, canvas.height / 2 + 100, p2Keys);
  var attacks = new Attack(ctx);

  var frame = 0;
  var _game = {
  		state: 'menu',
  		attackingPlayer: null,
  		playerOneHealth: 100,
  		playerTwoHealth: 100,
  		tossWinner: null,
  		chosenAttack: null,
  		defender: null,
  		start: false
  };
  var MAXHEALTH = 100;
  var DEBUGHEALTH = 50;
  var powers = {
  		water: {
  			type: 'water',
  			speed: 2,
  			damage: 30
  		},
  		fire: {
  			type: 'fire',
  			speed: 1,
  			damage: 40
  		},
  		electric: {
  			type: 'electric',
  			speed: 3,
  			damage: 15
  		},
  		special: {
  			type: 'special',
  			speed: 2,
  			damage: 50
  		}
  };
  
  var sprites = {
    stars: starField(ctx, 30)
  };

  window.requestAnimationFrame(loop);
  window.addEventListener("keydown", function (event) {
    if (_game.state === 'menu') {
      if (event.keyCode === 32) {
        _game.start = true;
      }
    }
    else if (_game.state === 'toss') {
      // player 1
      if (event.keyCode === keyStroke.currentLetter) {
        availableKeys.keys[keyStroke.currentLetter - 65].available = true;
        keyStroke.assignLetter(availableKeys.getKey());
        p1.updateScore(10);
      }
      // player 2
      else if (event.keyCode === p2Keys.currentLetter) {
        availableKeys.keys[p2Keys.currentLetter - 65].avaialble = true;
        p2Keys.assignLetter(availableKeys.getKey());
        p2.updateScore(10);
      }
    }
    else if (_game.state === 'attackIncoming') {
      if (event.keyCode === keyStroke.currentLetter) {
        availableKeys.keys[keyStroke.currentLetter - 65].available = true;
        keyStroke.assignLetter(availableKeys.getKey());
        p1.updateScore(20);
      }
      else if (event.keyCode === p2Keys.currentLetter) {
        availableKeys.keys[p2Keys.currentLetter - 65].available = true;
        p2Keys.assignLetter(availableKeys.getKey());
        p2.updateScore(20);
      }
    }
    else if (_game.state === 'attackSelection') {
      if (attacks.available) {
        switch (event.keyCode) {
          case 87:
            attacks.available = false;
            _game.state = 'attack';
            _game.chosenAttack = powers.water;
            break;
          case 70:
            attacks.available = false;
            _game.state = 'attack';
            _game.chosenAttack = powers.fire;
            break;
          case 69:
            attacks.available = false;
            _game.state = 'attack';
            _game.chosenAttack = powers.electric;
            break;
          case 83:
            attacks.available = false;
            _game.state = 'attack';
            _game.chosenAttack = powers.special;
            break;
          }
        }
      }
    });

  function loop() {
    clear();
    draw();

    // logic
    ctx.fillStyle = 'black';
    if (_game.state !== 'menu') {
      text(_game.state, canvas.width - 200, 20, 'left');
      text('player 1: ' + _game.playerOneHealth, 10, canvas.height - 50);
      text('player 2: ' + _game.playerTwoHealth, canvas.width - 200, canvas.height - 50);
    }
    else {
      //ctx.font = '52px sans-serif';
      text('GAME TITLE', centre.x, centre.y - 50, 'center', '52px');
      //ctx.font = '22px sans-serif';
      text('press [space] to start', centre.x, centre.y + 20, 'center');
      if (_game.start) {
        _game.state = 'toss';
      }
    }

    if (_game.state === 'toss') {
      if (p1.getScore() < DEBUGHEALTH && p2.getScore() < DEBUGHEALTH) {
        p1.draw(ctx);
        p2.draw(ctx);
      }
      else {
        var winner = '';
        if (frame < 120) {
          frame++;
          winner = p1.getScore() >= DEBUGHEALTH ? 'player one' : 'player two';
          _game.tossWinner = p1.getScore() >= DEBUGHEALTH ? 1 : 2;
          winner += ' has the power';
        }
        else if (frame < 240) {
          winner = 'choose your attack';
          frame++;
        }
        else {
          winner = null;
        }

        if (winner !== null) {
          text(winner, centre.x, centre.y, 'center');
        }
        else {
          _game.state = 'attackSelection';
        }
      }
    }
    else if (_game.state == 'attackSelection') {
      attacks.displayAttacks(centre);
      reset();
    }
    else if (_game.state == 'attack') {
      var aMsg = 'player ' + _game.tossWinner + ' does a ' + _game.chosenAttack.type + ' attack';
      text(aMsg, centre.x, centre.y, 'center');
      frame++;
      if (frame >= 120) {
        reset({state:'defense'});
      }
    }
    else if (_game.state == 'defense') {
      _game.defender = _game.tossWinner === 1 ? 2 : 1;
      text('player ' + _game.defender + ', reverse it!!', centre.x, centre.y, 'center');
      frame++;

      if (frame >= 120) {
        reset({state:'attackIncoming'});
      }
    }
    else if (_game.state == 'attackIncoming') {
      frame++;
      var seconds = 60 / _game.chosenAttack.speed * 10;
      text(seconds + ' : ' + frame, centre.x, canvas.height - 50, 'center');

      switch (_game.defender) {
        case 1:
          //p1.draw(ctx);
          if (p1.getScore() >= 100) {
            _game.state = 'attackFail';
          }
          break;
          case 2:
            //p2.draw(ctx);
            if (p2.getScore() >= 100) {
              _game.state = 'attackFail';
            }
            break;
      }

      if (frame >= seconds) {
        _game.state = 'attackSuccess';
      }
    }
    else if (_game.state == 'attackFail') {
      reset();
      if (_game.defender === 1) {
        _game.playerTwoHealth -= _game.chosenAttack.damage / 2;
        if (_game.playerTwoHealth <= 0) {
          _game.playerTwoHealth = 0;
          reset({state:'gameOver'});
        }
        else {
          _game.state = 'toss';
        }
      }
      else {
        _game.playerOneHealth -= _game.chosenAttack.damage / 2;
        if (_game.playerOneHealth <= 0) {
          _game.playerOneHealth = 0;
          _game.state = 'gameOver';
        }
        else {
          _game.state = 'toss';
        }
      }
    }
    else if (_game.state == 'attackSuccess') {
      var _continue = true;
      if (_game.defender === 1) {
        _game.playerOneHealth -= _game.chosenAttack.damage;
        if (_game.playerOneHealth <= 0) {
          _game.playerOneHealth = 0;
          _game.state = 'gameOver';
          frame = 0;
          _continue = false;
        }
      }
      else {
        _game.playerTwoHealth -= _game.chosenAttack.damage;
        if (_game.playerTwoHealth <= 0) {
          _game.playerTwoHealth = 0;
          _game.state = 'gameOver';
          frame = 0;
          _continue = false;
        }
      }

      if (_continue) {
        reset({state:'toss'});
      }
    }
    else if (_game.state == 'gameOver') {
      var msg = _game.playerOneHealth <= 0 ? 'Player 2' : 'Player 1';
      msg += ' wins';
      text(msg, centre.x, centre.y, 'center');
      frame++;
      if (frame >= 120) {
        _game.start = false;
        reset({state:'menu',health:true});
      }
    }

    window.requestAnimationFrame(loop);

  }

  function clear() {
  		ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function player(x, y, _keystroke) {
  		var score = 0;

  		return {
  			draw: function() {
          ctx.lineWidth = 3;
          ctx.strokeStyle = 'black';
          text(_keystroke.getLetter(), x, y, 'center', '400px', 'rgba(255,255,255,0.8)');
          ctx.strokeText(_keystroke.getLetter(), x, y);
          ctx.lineWidth = 0;
  			},
  			getScore: function() {
  				return score;
  			},
  			updateScore: function(inc) {
  				score += inc;
  			},
  			resetScore: function() {
  				score = 0;
  			}
  		};

  }

  function getCanvasCentre() {
  		return {
  			x: canvas.width / 2,
  			y: canvas.height / 2
  		};
  }

  function reset(options) {
    frame = 0;
    p1.resetScore();
    p2.resetScore();
    if (options === undefined) {
      return;
    }
    if (options.health !== undefined) {
      _game.playerOneHealth = _game.playerTwoHealth = MAXHEALTH;
    }
    if (options.state !== undefined) {
      _game.state = options.state;
    }
  }

  function text(msg, x, y, align, size, colour) {
    if (align !== undefined) {
      ctx.textAlign = align;
    }
    
    if (colour === undefined) {
      ctx.fillStyle = 'rgb(255,255,255)';
    }
    else {
      ctx.fillStyle = colour;
    }
    
    ctx.font = (size === undefined ? '22px' : size) + ' sans-serif';
    ctx.fillText(msg, x, y);
  }

  function draw() {
    //backgroundOne(ctx);
    //backgroundTwo(ctx);
    
    // THESE SHOULD BE DECLARED AS VARIABLES OUTSIDE THE LOOP    
    var m = moon(ctx, 800, 100);
    var g = ground(ctx, 0, 400);
    var ps1 = playerSprite(ctx, 150, g.y - 30);
    var ps2 = playerSprite(ctx, 810, g.y - 30, 2);
    var w = water(ctx, 0, 420);
    
    // stars
    sprites.stars.forEach(function (s) {
      s.draw();
    });
    
    m.draw();
    g.draw();

    ps1.draw();
    ps1.drawReflection();
    
    ps2.draw();
    ps2.drawReflection();
    
    w.draw();
  }
}
