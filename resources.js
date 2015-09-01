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

function moon(ctx, x, y) {  
  return {
    x: x,
    y: y,
    radius: 40,
    draw: function() {
      // bright side
      ctx.fillStyle = 'rgb(255,255,255)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
      
      // dark side
      ctx.fillStyle = 'rgb(0,0,0)';
      ctx.beginPath();
      ctx.arc(this.x + 10, this.y - 10, this.radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
    }
  };
}

function ground(ctx, x, y) {
  return {
    x: x,
    y: y,
    height: 20,
    draw: function() {
      ctx.fillStyle = 'rgb(99,99,99)';
      ctx.fillRect(this.x, this.y, canvas.width, this.height);
    }
  };
}

function playerSprite(ctx, x, y) {
  return {
    x: x,
    y: y,
    draw: function() {
      var p = new Path2D();
      // body
      ctx.fillStyle = 'rgb(255,255,255)';
      p.moveTo(this.x, this.y);
      p.lineTo(this.x - 40, this.y);
      p.lineTo(this.x - 10, this.y - 100);
      p.lineTo(this.x + 20, this.y - 100);
      p.lineTo(this.x + 30, this.y);
      // left leg
      p.moveTo(this.x - 10, this.y);
      p.lineTo(this.x - 12, this.y + 30);
      p.lineTo(this.x - 20, this.y + 30);
      p.lineTo(this.x - 18, this.y);
      // right leg
      p.moveTo(this.x + 15, this.y);
      p.lineTo(this.x + 15, this.y + 30);
      p.lineTo(this.x + 7, this.y + 30);
      p.lineTo(this.x + 7, this.y);
      
      ctx.fill(p);
      
      // hood
      var h = new Path2D();
      ctx.fillStyle = 'rgb(40,40,40)';
      h.moveTo(this.x + 17, this.y - 98);
      h.lineTo(this.x + 19, this.y - 75);
      h.lineTo(this.x + 4, this.y - 75);
      h.lineTo(this.x + 9, this.y - 98);
      ctx.fill(h);
    },
    drawReflection: function() {
      var p = new Path2D();
      // body
      ctx.translate(400, 400);
      ctx.scale(1, -1);
      ctx.fillStyle = 'rgb(255,255,255)';
      p.moveTo(this.x, this.y);
      p.lineTo(this.x - 40, this.y);
      p.lineTo(this.x - 10, this.y - 100);
      p.lineTo(this.x + 20, this.y - 100);
      p.lineTo(this.x + 30, this.y);
      // left leg
      p.moveTo(this.x - 10, this.y);
      p.lineTo(this.x - 12, this.y + 30);
      p.lineTo(this.x - 20, this.y + 30);
      p.lineTo(this.x - 18, this.y);
      // right leg
      p.moveTo(this.x + 15, this.y);
      p.lineTo(this.x + 15, this.y + 30);
      p.lineTo(this.x + 7, this.y + 30);
      p.lineTo(this.x + 7, this.y);
      
      ctx.fill(p);
      
      // hood
      var h = new Path2D();
      ctx.fillStyle = 'rgb(40,40,40)';
      h.moveTo(this.x + 17, this.y - 98);
      h.lineTo(this.x + 19, this.y - 75);
      h.lineTo(this.x + 4, this.y - 75);
      h.lineTo(this.x + 9, this.y - 98);
      ctx.fill(h);
      
      ctx.translate(0,0);
      ctx.scale(1,1);
    }
  }
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
