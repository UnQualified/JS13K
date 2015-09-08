function game() {
  var TITLE = 'The Odul Mages';
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = 960;
  canvas.height = 540;
  //canvas.style.backgroundColor = 'rgb(0,0,0)';
  var centre = getCanvasCentre();

  var sounds = new Sounds();

  var availableKeys = new AvailableKeys();
  var keyStroke = new KeyStroke(availableKeys.getKey());
  var p2Keys = new KeyStroke(availableKeys.getKey());
  var p1 = player(240, canvas.height / 2 + 100, keyStroke);
  var p2 = player(720, canvas.height / 2 + 100, p2Keys);
  var attacks = new Attack(ctx);

  var frame = 0;
  var offsets = {
    yOffset: canvas.height * 1.25,
    medYOffset: canvas.height * 1.25 * 0.1,
    slowYOffset: canvas.height * 1.25 * 0.05
  };
  var offsetSpeeds = {
    fast: 2,
    med: 2 * 0.1,
    slow: 2 * 0.05
  };
  var _game = {
  		state: 'menu',
  		attackingPlayer: null,
  		playerOneHealth: 100,
  		playerTwoHealth: 100,
      playerOneReversed: 0,
      playerTwoReversed: 0,
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
    stars: starField(ctx, 30, offsets, offsetSpeeds),
    ball: attackBall(ctx, 180, 320 - 30, 40, 5, 1),
    g: ground(ctx, 0, 400 - 30, offsets.yOffset),
    ps1: playerSprite(ctx, 150, 370 - 30, offsets.yOffset), //this.g.y - 30)
    ps2: playerSprite(ctx, 810, 370 - 30, offsets.yOffset, 2),
    w: water(ctx, 0, 410 - 30, offsets.yOffset),
    m: moon(ctx, 800, 100, offsets.medYOffset)
  };

  window.requestAnimationFrame(loop);
  window.addEventListener("keydown", function (event) {
    if (_game.state === 'menu') {
      if (event.keyCode === 32) {
        //_game.start = true;
        _game.state = 'intro';
      }
    }
    else if (_game.state === 'toss') {
      // player 1
      if (event.keyCode === keyStroke.currentLetter) {
        availableKeys.keys[keyStroke.currentLetter - 65].available = true;
        keyStroke.assignLetter(availableKeys.getKey());
        p1.updateScore(10);
        sounds.playSuccess(Math.round(p1.getScore()/10 - 1), 1);
      }
      // player 2
      else if (event.keyCode === p2Keys.currentLetter) {
        availableKeys.keys[p2Keys.currentLetter - 65].avaialble = true;
        p2Keys.assignLetter(availableKeys.getKey());
        p2.updateScore(10);
        sounds.playSuccess(Math.round(p2.getScore()/10 - 1), 2);
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
            // this might need to be >= 2
            if ((_game.defender === 1 && _game.playerTwoReversed >= 3) ||
                (_game.defender === 2 && _game.playerOneReversed >= 3)) {
                
                attacks.available = false;
                _game.state = 'attack';
                _game.chosenAttack = powers.special;

                _game.playerTwoReversed = _game.defender === 2 ? 0 : _game.playerTwoReversed;
                _game.playerOneReversed = _game.defender === 1 ? 0 : _game.playerOneReversed;

                // play bad sound...                
            }
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

    if (_game.state === 'menu') {
      text(TITLE.toUpperCase(), centre.x, centre.y -50, 'center', '52px');
      text('press [space]', centre.x, centre.y + 20, 'center');
    }
    else if (_game.state === 'intro') {
      text('INTRO', centre.x, centre.y + 100, 'center');
      sprites.g.reduceOffset(offsetSpeeds.fast);
      sprites.w.reduceOffset(offsetSpeeds.fast);
      sprites.ps1.reduceOffset(offsetSpeeds.fast);
      sprites.ps2.reduceOffset(offsetSpeeds.fast);
      sprites.m.reduceOffset(offsetSpeeds.med);
      sprites.stars.forEach(function (item) {
        item.reduceOffset();
      });
      if (sprites.ps1.scrollComplete) {
        _game.start = true;
      }
      if (_game.start) {
        _game.state = 'toss';
      }
    }
    else if (_game.state === 'toss') {
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
          _game.defender = _game.tossWinner === 1 ? 2 : 1;
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
      var specialAvailable = false;
      // might need to be >= 3
      if ((_game.defender === 1 && _game.playerTwoReversed >= 2) ||
          (_game.defender === 2 && _game.playerOneReversed >= 2)) {

          specialAvailable = true;
      }
      attacks.displayAttacks(centre, specialAvailable);
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
            _game.playerOneReversed++;
          }
          break;
        case 2:
          p2.draw(ctx);
          if (p2.getScore() >= 100) {
            _game.state = 'attackFail';
            _game.playerTwoReversed++;
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

function moon(ctx, x, y, offset) {
  var originalY = y;
  return {
    x: x,
    y: y + offset,
    radius: 40,
    draw: function() {
      // bright side
      ctx.fillStyle = 'rgb(255,255,255)';
      ctx.shadowColor = 'rgba(255,255,255,0.8)';
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      // dark side
      ctx.fillStyle = 'rgb(0,0,0)';
      ctx.beginPath();
      ctx.arc(this.x + 10, this.y - 10, this.radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
    },
    reduceOffset: function(speed) {
      if (this.y <= originalY) {
        this.y = originalY;
      }
      else {
        this.y -= speed;
      }
    }
  };
}

function attackBall(ctx, x, y, radius, speed, player) {
  var initialX = x;
  return {
    x: x,
    y: y,
    speed: speed,
    player: player,
    radius: radius,
    show: false,
    colour: 'rgb(255,255,255)',
    gradient: this.colour,
    setPlayer: function(plyr) {
      this.player = plyr;
      this.x = this.player === 1 ? 180 : 780;
    },
    setAttack: function(attack) {
      this.colour = attack.colour;
      this.radius = attack.damage;
    },
    draw: function() {
      if (this.show) {
        //this.updateGradient();
        ctx.fillStyle = this.colour; //'rgb(255,0,0)';
        ctx.shadowColor = this.colour;
        ctx.shadowBlur = 40;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        this.shadowBlur = 0;
      }
    },
    drawReflection: function() {
      if (this.show) {
        ctx.fillStyle = this.colour;
        ctx.shadowColor = this.colour;
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.arc(this.x, this.y + 170, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    },
    update: function() {
      if (this.show) {
        this.x += this.player === 1 ? this.speed : this.speed * -1;
      }
      else {
        //this.x = this.player === 1 ? 180;
      }
    }
  };
}

function star(ctx, x, y, offset, offsetSpeed) {
  var originalY = y;
  return {
    x: x,
    y: y + offset,
    radius: rnd(1,3),
    draw: function() {
      ctx.fillStyle = 'rgb(255,255,255)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
    },
    reduceOffset: function() {
      if (this.y <= originalY) {
        this.y = originalY;
      }
      else {
        this.y -= offsetSpeed;
      }
    }
  };
}

function starField(ctx, num, offsets, offsetSpeeds) {
  var stars = [];
  for (var i = 0; i < num; i++) {
    var x = rnd(0, 960);
    var y = rnd(0, 540);
    var spd = rnd(0,1);
    var offset = {};
    if (spd === 1) {
      offset.speed = offsetSpeeds.med;
      offset.offset = offsets.medYOffset;
    }
    else {
      offset.speed = offsetSpeeds.slow;
      offset.offset = offsets.slowYOffset;
    }
    stars.push(star(ctx, x, y, offset.offset, offset.speed));
  }
  return stars;
}

function ground(ctx, x, y, offset) {
  var originalY = y;
  return {
    x: x,
    y: y + offset,
    height: 10,
    draw: function() {
      ctx.fillStyle = 'rgb(99,99,99)';
      ctx.fillRect(this.x, this.y, canvas.width, this.height);
    },
    reduceOffset: function(speed) {
      if (this.y <= originalY) {
        this.y = originalY;
      }
      else {
        this.y -= speed;
      }
    }
  };
}

function water(ctx, x, y, offset) {
  var originalY = y;
  return {
    x: x,
    y: y + offset,
    height: 70,
    draw: function() {
      //var grad = ctx.createLinearGradient(480,420,480,490);
      var grad = ctx.createLinearGradient(canvas.width/2, this.y, canvas.width/2, this.y+this.height);
      grad.addColorStop(0, 'rgba(0,0,0,1)');
      grad.addColorStop(0.5, 'rgba(0,0,0,0.4)');
      grad.addColorStop(0.6, 'rgba(0,0,0,0.2)');
      grad.addColorStop(0.65, 'rgba(0,0,0,0.1)');
      grad.addColorStop(0.7, 'rgba(0,0,0,0.05)');
      grad.addColorStop(0.75, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.rect(this.x, this.y, canvas.width, this.height);
      ctx.fill();
      ctx.fillStyle = 'black';
    },
    reduceOffset: function(speed) {
      if (this.y <= originalY) {
        this.y = originalY;
      }
      else {
        this.y -= speed;
      }
    }
  };
}

function playerSprite(ctx, x, y, offset, number) {
  var originalY = y;
  var dir = number === 2 ? -1 : 1;
  return {
    x: x,
    y: y + offset,
    health: 100,
    scrollComplete: false,
    draw: function() {
      var p = new Path2D();
      ctx.fillStyle = 'rgb(255,255,255)';
      // health
      //ctx.fillRect(this.x - 50, this.y - 130, 100, 10);
      ctx.shadowColor = 'white';
      ctx.shadowBlur = 10;

      // body
      p.moveTo(this.x, this.y);
      p.lineTo(this.x - (40 * dir), this.y);
      p.lineTo(this.x - (10 * dir), this.y - 100);
      p.lineTo(this.x + (20 * dir), this.y - 100);
      p.lineTo(this.x + (30 * dir), this.y);
      // left leg
      p.moveTo(this.x - (10 * dir), this.y);
      p.lineTo(this.x - (12 * dir), this.y + 30);
      p.lineTo(this.x - (20 * dir), this.y + 30);
      p.lineTo(this.x - (18 * dir), this.y);
      // right leg
      p.moveTo(this.x + (15 * dir), this.y);
      p.lineTo(this.x + (15 * dir), this.y + 30);
      p.lineTo(this.x + (7 * dir), this.y + 30);
      p.lineTo(this.x + (7 * dir), this.y);

      ctx.fill(p);
      ctx.shadowBlur = 0;

      // hood
      var h = new Path2D();
      ctx.fillStyle = 'rgb(40,40,40)';
      h.moveTo(this.x + (17 * dir), this.y - 98);
      h.lineTo(this.x + (19 * dir), this.y - 75);
      h.lineTo(this.x + (4 * dir), this.y - 75);
      h.lineTo(this.x + (9 * dir), this.y - 98);
      ctx.fill(h);
    },
    drawReflection: function() {
      var p = new Path2D();
      // body
      //ctx.translate(0, 820);
      //ctx.scale(1, -1);
      ctx.fillStyle = 'rgba(255,255,255,' + this.health / 100 + ')';
      ctx.shadowColor = 'rgba(255,255,255,' + this.health / 100 + ')';
      ctx.shadowBlur = 20;
      var _y = this.y + 70;
      p.moveTo(this.x, _y);
      p.lineTo(this.x - (40 * dir), _y);
      p.lineTo(this.x - (10 * dir), _y + 100);
      p.lineTo(this.x + (20 * dir), _y + 100);
      p.lineTo(this.x + (30 * dir), _y);
      // left leg
      p.moveTo(this.x - (10 * dir), _y);
      p.lineTo(this.x - (12 * dir), _y - 30);
      p.lineTo(this.x - (20 * dir), _y - 30);
      p.lineTo(this.x - (18 * dir), _y);
      // right leg
      p.moveTo(this.x + (15 * dir), _y);
      p.lineTo(this.x + (15 * dir), _y - 30);
      p.lineTo(this.x + (7 * dir), _y - 30);
      p.lineTo(this.x + (7 * dir), _y);

      ctx.fill(p);
      ctx.shadowBlur = 0;

      // hood
      var h = new Path2D();
      ctx.fillStyle = 'rgba(40,40,40,' + this.health/100 + ')';
      h.moveTo(this.x + (17 * dir), _y + 98);
      h.lineTo(this.x + (19 * dir), _y + 75);
      h.lineTo(this.x + (4 * dir), _y + 75);
      h.lineTo(this.x + (9 * dir), _y + 98);
      ctx.fill(h);

      //ctx.setTransform(1, 0, 0, 1, 0, 0);
    },
    reduceOffset: function(speed) {
      if (this.y <= originalY) {
        this.y = originalY;
        this.scrollComplete = true;
      }
      else {
        this.y -= speed;
      }
    }
  };
}

function rnd(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

function Attack(context, specialAvailable) {
	this.ctx = context;
	this.available = false;
  this.special = specialAvailable;
}
Attack.prototype.displayAttacks = function(canvasCentre) {
	this.available = true;
  this.ctx.fillStyle = 'white';
  this.ctx.shadowBlur = 20;
  this.ctx.shadowColor = 'white';
	this.ctx.fillText('fire', canvasCentre.x - 100, canvasCentre.y);
	this.ctx.fillText('water', canvasCentre.x, canvasCentre.y - 100);
	this.ctx.fillText('electric', canvasCentre.x + 105, canvasCentre.y);
  if (!this.special) {
    this.ctx.fillStyle = 'rgba(255,255,255,0.4)';
  }
	this.ctx.fillText('special', canvasCentre.x, canvasCentre.y + 100);
  if (!this.special) {
    this.ctx.fillStyle = 'white';
  }
};
Attack.prototype.selectedAttack = function(msg) {
	if (this.available) {
		this.ctx.textAlign = 'left';
		this.ctx.fillText(msg + ' selected', 20, 100);
	}
};

function Sounds() {
  this.audioContext = new AudioContext();
  // refactor this!!!
  this.notes = [
    {
      notes: [-3, 2, 9],
      delay: 0.1,
      feedback: 0.4
    },
    {
      notes: [0, 5, 12],
      delay: 0.1,
      feedback: 0.4
    },
    {
      notes: [3, 8, 15],
      delay: 0.1,
      feedback: 0.4
    },
    {
      notes: [6, 11, 18],
      delay: 0.1,
      feedback: 0.4
    },
    {
      notes: [9, 14, 21, 22, 28, 30, 32, 32, 35, 9, 9, 9],
      delay: 0.1,
      feedback: 0.6
    }
  ];
  this.p2notes = [
    {
      notes: [-5, -2, -1],
      delay: 0.1,
      feedback: 0.4
    },
    {
      notes: [-3, 0, 1],
      delay: 0.1,
      feedback: 0.4
    },
    {
      notes: [-1, 2, 3],
      delay: 0.1,
      feedback: 0.4
    },
    {
      notes: [1, 4, 5],
      delay: 0.1,
      feedback: 0.4
    },
    {
      notes: [3, 6, 7, 2, 12, 10, 14, 17, 20, 0, 0, 2, 1],
      delay: 0.1,
      feedback: 0.4
    }
  ];
}
Sounds.prototype.playSuccess = function(val, player) {
  var speed = 0.05;
  var place = 0 - speed;
  var duration = 0.15;//0.05;
  var notes = player === 1 ? this.notes : this.p2notes;
  for (var j = 0; j < notes[val].notes.length; j++) {
    this.play(place += speed, notes[val].notes[j], duration, notes[val]);
  }
};
Sounds.prototype.play = function(startAfter, pitch, duration, options) {

  var time = this.audioContext.currentTime + startAfter;
  var input = this.audioContext.createGain();
  var feedback = this.audioContext.createGain();
  var delay = this.audioContext.createDelay();

  var output = this.audioContext.createGain();
  output.connect(this.audioContext.destination);

  delay.delayTime.value = options.delay;
  feedback.gain.value = options.feedback;//0.4; // dangerous when > 1 ;-)

  // dry path
  input.connect(output);

  // wet path
  input.connect(delay);

  // feedback loop
  delay.connect(feedback);
  feedback.connect(delay);
  feedback.connect(output);


  var oscillator = this.audioContext.createOscillator();
  oscillator.connect(delay);

  oscillator.type = 'square';
  oscillator.detune.value = pitch * 100;

  oscillator.start(time);
  oscillator.stop(time + duration);
};

function test() {
  var audioContext = new AudioContext();

  var oscillator = audioContext.createOscillator();
  oscillator.type = 'square';
  oscillator.frequency.value = 220;
  oscillator.detune.value = 1500;
  oscillator.connect(audioContext.destination);


  //oscillator.start(audioContext.currentTime);
  //oscillator.stop(audioContext.currentTime + 2);

  var startTime = audioContext.currentTime + 0.100;
  var tempo = 80;
  var _8 = (60/tempo) / 2;

  for (var bar = 0; bar < 2; bar++) {
    var time = startTime + bar * 8 * _8;
    oscillator.start(time);
    oscillator.stop(time + _8);
  }

  /*
   * http://www.html5rocks.com/en/tutorials/webaudio/intro/
  */
}
