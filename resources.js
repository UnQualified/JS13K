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

function modesty(ctx, x, y, offset) {
  var originalY = y;
  return {
    x: x,
    y: y + offset,
    height: 250,
    draw: function() {
      ctx.fillStyle = 'black';
      ctx.rect(this.x, this.y, canvas.width, this.height);
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

function playerSprite(ctx, x, y, offset, number) {
  var originalY = y;
  var dir = number === 2 ? -1 : 1;
  return {
    x: x,
    y: y + offset,
    health: 100,
    scrollComplete: false,
    draw: function(reversals, health) {
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

      // draw the special counter
      if (reversals > 0) {
        reversals = reversals > 3 ? 3 : reversals;
        var rad = 7;
        for (var i = 1; i <= reversals; i++) {
          ctx.fillStyle = 'white';
          ctx.shadowColor = 'white';
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.arc(this.x - (dir * 45), this.y - 20 - (i * 20), rad, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.fill();
        }
      }

      // draw the health bar
      ctx.fillStyle = 'white';
      ctx.fillRect(this.x - (dir * 70), this.y, 10, health * -1);


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
