function moon(ctx, x, y) {  
  return {
    x: x,
    y: y,
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
    updateGradient: function() {
      this.gradient = ctx.createRadialGradient(this.x, this.y, 5, this.x, this.y, this.radius * 0.9);
      this.gradient.addColorStop(0, 'white');
      this.gradient.addColorStop(1, this.colour);
    },
    draw: function() {
      if (this.show) {
        this.updateGradient();
        this.shadowColor = this.colour;
        this.shadowBlur = 40;
        ctx.fillStyle = this.gradient;//this.colour; //'rgb(255,0,0)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        this.shadowBlur = 0;
      }
    },
    drawReflection: function() {
      if (this.show) {
        ctx.fillStyle = this.gradient;//this.colour;
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
  }
}

function star(ctx, x, y) {
  return {
    x: x,
    y: y,
    radius: rnd(1,3),
    draw: function() {
      ctx.fillStyle = 'rgb(255,255,255)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
    }
  }
}

function starField(ctx, num) {
  var stars = [];
  for (var i = 0; i < num; i++) {
    var x = rnd(0, 960);
    var y = rnd(0, 540);
    stars.push(star(ctx, x, y));
  }
  return stars;
}

function ground(ctx, x, y) {
  return {
    x: x,
    y: y,
    height: 10,
    draw: function() {
      ctx.fillStyle = 'rgb(99,99,99)';
      ctx.fillRect(this.x, this.y, canvas.width, this.height);
    }
  };
}

function water(ctx, x, y) {
  return {
    x: x,
    y: y,
    height: 70,
    draw: function() {
      var grad = ctx.createLinearGradient(480,420,480,490);
      grad.addColorStop(0, 'rgb(0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.rect(this.x, this.y, canvas.width, this.height);
      ctx.fill();
      ctx.fillStyle = 'black';
    }
  };
}

function playerSprite(ctx, x, y, number) {
  var dir = number === 2 ? -1 : 1;
  return {
    x: x,
    y: y,
    health: 100,
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
      ctx.translate(0, 820);
      ctx.scale(1, -1);
      ctx.fillStyle = 'rgba(255,255,255,' + this.health / 100 + ')';
      ctx.shadowColor = 'rgba(255,255,255,' + this.health / 100 + ')';
      ctx.shadowBlur = 20;
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
      ctx.fillStyle = 'rgba(40,40,40,' + this.health/100 + ')';
      h.moveTo(this.x + (17 * dir), this.y - 98);
      h.lineTo(this.x + (19 * dir), this.y - 75);
      h.lineTo(this.x + (4 * dir), this.y - 75);
      h.lineTo(this.x + (9 * dir), this.y - 98);
      ctx.fill(h);
      
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  }
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

