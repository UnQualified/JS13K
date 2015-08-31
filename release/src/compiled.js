function game() {

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = 960;
  canvas.height = 540;
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

  		//ctx.font = '100px sans-serif';

  		return {
  			draw: function() {
          ctx.fillStyle = 'rgba(0,0,0,0.75)';
          text(_keystroke.getLetter(), x, y, 'center', '400px');
          ctx.fillStyle = 'rgb(0,0,0)';
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

  function text(msg, x, y, align, size) {
    if (align !== undefined) {
      ctx.textAlign = align;
    }
    ctx.font = (size === undefined ? '22px' : size) + ' sans-serif';
    ctx.fillText(msg, x, y);
  }

  function draw() {
    backgroundOne(ctx);
    backgroundTwo(ctx);
    sun(ctx);
  }
}

// paths!
function backgroundOne(ctx) {
	ctx.fillStyle = 'rgb(225,225,225)';
	var p = new Path2D();
	p.moveTo(0, 200);
	p.lineTo(175, 150);
	p.lineTo(225, 175);
	p.lineTo(300, 215);
	p.lineTo(350, 195);
	p.lineTo(400, 135);
	p.lineTo(425, 120);
	p.lineTo(429, 175);
	p.lineTo(500, 230);
	p.lineTo(600, 275);
	p.lineTo(650, 200);
	p.lineTo(675, 170);
	p.lineTo(700, 190);
	p.lineTo(810, 166);
	p.lineTo(850, 150);
	p.lineTo(900, 170);
	p.lineTo(960, 165);
	p.lineTo(960, 540);
	p.lineTo(0, 540);
	ctx.fill(p);
}

function backgroundTwo(ctx) {
	ctx.fillStyle = 'rgb(200,200,200)';
	var p = new Path2D();
	p.moveTo(0,180);
	p.lineTo(100, 300);
	p.lineTo(225, 350);
	p.lineTo(350, 375);
	p.lineTo(400, 310);
	p.lineTo(460, 225);
	p.lineTo(575, 185);
	p.lineTo(645, 237);
	p.lineTo(760, 270);
	p.lineTo(820, 312);
	p.lineTo(960, 250);
	p.lineTo(960, 540);
	p.lineTo(0, 540);
	ctx.fill(p);
}

function sun(ctx) {
	ctx.fillStyle = 'rgb(230,230,230)';
	ctx.beginPath();
	ctx.arc(800, 50, 40, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.fill();
}

function rnd(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// gulp concat??
function KeyStroke(initialKey) {
	this.currentLetter = initialKey; //rnd(65, 90);//this.getRandom(65, 90);
}
KeyStroke.prototype.assignLetter = function(key) {
	this.currentLetter = key;//rnd(65, 90); //this.getRandom(65, 90);
};
KeyStroke.prototype.getLetter = function() {
  return String.fromCharCode(this.currentLetter).toUpperCase();
};
KeyStroke.prototype.getRandom = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function AvailableKeys() {
	this.keys = [];
	for (var i = 65; i < 91; i++) {
		this.keys.push({
			key: i,
			available: true
		});
	}
}
AvailableKeys.prototype.getKey = function() {
	var index = rnd(0, this.keys.length-1);
	var test = this.keys[index];
	if (test.available) {
		this.keys[index].available = false;
		return test.key;
	}
	else {
		return this.getKey();
	}
};

function Attack(context) {
	this.ctx = context;
	this.available = false;
}
Attack.prototype.displayAttacks = function(canvasCentre) {
	this.available = true;
	this.ctx.fillText('fire', canvasCentre.x - 100, canvasCentre.y);
	this.ctx.fillText('water', canvasCentre.x, canvasCentre.y - 100);
	this.ctx.fillText('electric', canvasCentre.x + 100, canvasCentre.y);
	this.ctx.fillText('special', canvasCentre.x, canvasCentre.y + 100);
};
Attack.prototype.selectedAttack = function(msg) {
	if (this.available) {
		this.ctx.textAlign = 'left';
		this.ctx.fillText(msg + ' selected', 20, 100);
	}
};
