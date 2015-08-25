function game() {

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = 800;
  canvas.height = 400;
  
  var availableKeys = new AvailableKeys();
  var keyStroke = new KeyStroke(availableKeys.getKey());
  var p2Keys = new KeyStroke(availableKeys.getKey());
  var p1 = player(10, 20, keyStroke);
  var p2 = player(100, 20, p2Keys);
  var attacks = new Attack(ctx);
  var selectedMsg = null;
  
  var frame = 0;
  var state = {
  		gameState: 'toss',
  		attackingPlayer: null,
  		playerOneHealth: 100,
  		playerTwoHealth: 100,
  		tossWinner: null,
  		chosenAttack: null
  };
  var MAXHEALTH = 10;

  window.requestAnimationFrame(loop);
  window.addEventListener("keydown", function (event) {
  		if (state.gameState === 'toss') {
	  		// player 1
	  		if (event.keyCode === keyStroke.currentLetter) {
	  			availableKeys.keys[keyStroke.currentLetter - 65].available = true;
	  			keyStroke.assignLetter(availableKeys.getKey());
	  			p1.updateScore();
	  		}
	  		// player 2
	  		else if (event.keyCode === p2Keys.currentLetter) {
	  			availableKeys.keys[p2Keys.currentLetter - 65].avaialble = true;
	  			p2Keys.assignLetter(availableKeys.getKey());
	  			p2.updateScore();
	  		}
	  	}
  		else if (state.gameState === 'attackSelection') {
	  		if (attacks.available) {	  			
	  			switch (event.keyCode) {
	  				case 87:
	  					selectedMsg = 'water';
	  					attacks.available = false;
	  					state.gameState = 'attack';
	  					state.chosenAttack = 'water';
	  					break;
	  				case 70:
	  					selectedMsg = 'fire';
	  					attacks.available = false;
	  					state.gameState = 'attack';
	  					state.chosenAttack = 'fire';
	  					break;
	  				case 69:
	  					selectedMsg = 'electric';
	  					attacks.available = false;
	  					state.gameState = 'attack';
	  					state.chosenAttack = 'electric';
	  					break;
	  				case 83:
	  					selectedMsg = 'special';
	  					attacks.available = false;
	  					state.gameState = 'attack';
	  					state.chosenAttack = 'special';
	  					break;
	  			}
	  		}
  		}
  });
  
  function loop() {
  		clear();
  		ctx.textAlign = 'left';
  		ctx.fillText(state.gameState, canvas.width - 200, 20);
  		ctx.fillText('player 1: ' + state.playerOneHealth, 10, canvas.height - 50);
  		ctx.fillText('player 2: ' + state.playerTwoHealth, canvas.width - 200, canvas.height - 50);
  		
  		if (state.gameState === 'toss') {
	  		if (p1.getScore() < MAXHEALTH && p2.getScore() < MAXHEALTH) {
				p1.draw(ctx);
				p2.draw(ctx);
			}
			else {
				var winner = '';
				if (frame < 120) {
					frame++;
					winner = p1.getScore() >= MAXHEALTH ? 'player one' : 'player two';
					state.tossWinner = p1.getScore() >= MAXHEALTH ? 1 : 2;
					winner += ' has the power';
				}
				else if (frame < 240) {
					winner = 'choose your attack';
					frame++;
				}
				else {
					winner = null;
				}
				ctx.textAlign = 'center';
				if (winner !== null) {
					ctx.fillText(winner, getCanvasCentre().x, getCanvasCentre().y);
				}
				else {
					state.gameState = 'attackSelection';
				}
			}
		}
		else if (state.gameState == 'attackSelection') {
			attacks.displayAttacks(getCanvasCentre());
			attacks.selectedAttack(selectedMsg);
			frame = 0;
		}
		else if (state.gameState == 'attack') {
			ctx.textAlign = 'center';
			var aMsg = 'player ' + state.tossWinner + ' does a ' + state.chosenAttack + ' attack';
			ctx.fillText(aMsg, getCanvasCentre().x, getCanvasCentre().y);
			frame++;
			if (frame >= 120) {
				state.gameState = 'defense';
				frame = 0;
			}
		}
		else if (state.gameState == 'defense') {
			ctx.textAlign = 'center';
			var defender = state.tossWinner === 1 ? 2 : 1;
			ctx.fillText('player ' + defender + ', reverse it!', getCanvasCentre().x, getCanvasCentre().y);
			frame++;
			if (frame >= 120) {
				if (defender === 1) {
					state.playerOneHealth -= 10; // this needs to be attack appropriate
				}
				else {
					state.playerTwoHealth -= 10; // this needs to be attack appropriate
				}
				frame = 0;
				state.gameState = 'toss';
				p1.resetScore();
				p2.resetScore();
			}
		}
		
		window.requestAnimationFrame(loop);
  }
  
  function clear() {
  		ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  
  function player(x, y, _keystroke) {
  		var score = 0;
  		
  		ctx.font = '22px sans-serif';
  		  		
  		return {
  			draw: function() {
  				ctx.fillText(_keystroke.getLetter(), x, y);
  				ctx.fillText(score, x, y + 50);
  			},
  			getScore: function() {
  				return score;
  			},
  			updateScore: function(inc) {
  				score += 10;
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
  		}
  }
  
  function doAttack(player, attack) {
  
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