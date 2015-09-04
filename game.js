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
  			damage: 30,
  			colour: 'rgb(0,0,255)'
  		},
  		fire: {
  			type: 'fire',
  			speed: 1,
  			damage: 40,
  			colour: 'rgb(255,0,0)'
  		},
  		electric: {
  			type: 'electric',
  			speed: 3,
  			damage: 15,
  			colour: 'rgb(255,255,0)'
  		},
  		special: {
  			type: 'special',
  			speed: 2,
  			damage: 50,
  			colour: 'rbg(255,0,255)'
  		}
  };
  
  var sprites = {
    stars: starField(ctx, 30),
    ball: attackBall(ctx, 180, 320, 40, 5, 1),
    g: ground(ctx, 0, 400),
    ps1: playerSprite(ctx, 150, 370), //this.g.y - 30)
    ps2: playerSprite(ctx, 810, 370, 2),
    w: water(ctx, 0, 410),
    m: moon(ctx, 800, 100)
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
    sprites.ball.update();

    // logic
    ctx.fillStyle = 'black';
    if (_game.state !== 'menu') {
      //text(_game.state, canvas.width - 200, 20, 'left');
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
          sprites.ball.setPlayer(_game.tossWinner);
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
      sprites.ball.setAttack(_game.chosenAttack);
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
      
      sprites.ball.speed = 575 / (seconds / 10) / 10;
      sprites.ball.show = true;

      switch (_game.defender) {
        case 1:
          p1.draw(ctx);
          if (p1.getScore() >= 100) {
            _game.state = 'attackFail';
          }
          break;
        case 2:
          p2.draw(ctx);
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
      sprites.ball.show = false;
      if (_game.defender === 1) {
        _game.playerTwoHealth -= _game.chosenAttack.damage / 2;
        sprites.ps2.health = _game.playerTwoHealth;
        if (_game.playerTwoHealth <= 0) {
          _game.playerTwoHealth = 0;
          sprites.ps2.health = _game.playerTwoHealth;
          reset({state:'gameOver'});
        }
        else {
          _game.state = 'toss';
        }
      }
      else {
        _game.playerOneHealth -= _game.chosenAttack.damage / 2;
        sprites.ps1.health = _game.playerOneHealth;
        if (_game.playerOneHealth <= 0) {
          _game.playerOneHealth = 0;
          sprites.ps1.health = _game.playerOneHealth;
          _game.state = 'gameOver';
        }
        else {
          _game.state = 'toss';
        }
      }
    }
    else if (_game.state == 'attackSuccess') {
      sprites.ball.show = false;
      var _continue = true;
      if (_game.defender === 1) {
        _game.playerOneHealth -= _game.chosenAttack.damage;
        sprites.ps1.health = _game.playerOneHealth;
        if (_game.playerOneHealth <= 0) {
          _game.playerOneHealth = 0;
          sprites.ps1.health = _game.playerOneHealth;
          _game.state = 'gameOver';
          frame = 0;
          _continue = false;
        }
      }
      else {
        _game.playerTwoHealth -= _game.chosenAttack.damage;
        sprites.ps2.health = _game.playerTwoHealth;
        if (_game.playerTwoHealth <= 0) {
          _game.playerTwoHealth = 0;
          sprites.ps2.health = _game.playerTwoHealth;
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
      ctx.shadowColor = 'white';
    }
    else {
      ctx.fillStyle = colour;
      ctx.shadowColor = colour;
    }
    
    ctx.font = (size === undefined ? '22px' : size) + ' sans-serif';
    ctx.shadowBlur = 10;
    ctx.fillText(msg, x, y);
    ctx.shadowBlur = 0;
  }

  function draw() {
    //backgroundOne(ctx);
    //backgroundTwo(ctx);
    
    // stars
    sprites.stars.forEach(function (s) {
      s.draw();
    });
    sprites.ball.draw();
    sprites.ball.drawReflection();
    sprites.m.draw();
    sprites.g.draw();

    sprites.ps1.draw();
    sprites.ps1.drawReflection();
    
    sprites.ps2.draw();
    sprites.ps2.drawReflection();
    
    sprites.w.draw();
  }
}
