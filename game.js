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
  		chosenAttack: null,
  		defender: null
  };
  var MAXHEALTH = 10;
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
  		if (state.gameState === 'toss') {
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
	  	else if (state.gameState === 'attackIncoming') {
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
  		else if (state.gameState === 'attackSelection') {
	  		if (attacks.available) {	  			
	  			switch (event.keyCode) {
	  				case 87:
	  					selectedMsg = 'water';
	  					attacks.available = false;
	  					state.gameState = 'attack';
	  					state.chosenAttack = powers.water; //'water';
	  					break;
	  				case 70:
	  					selectedMsg = 'fire';
	  					attacks.available = false;
	  					state.gameState = 'attack';
	  					state.chosenAttack = powers.fire; //'fire';
	  					break;
	  				case 69:
	  					selectedMsg = 'electric';
	  					attacks.available = false;
	  					state.gameState = 'attack';
	  					state.chosenAttack = powers.electric; //'electric';
	  					break;
	  				case 83:
	  					selectedMsg = 'special';
	  					attacks.available = false;
	  					state.gameState = 'attack';
	  					state.chosenAttack = powers.special; //'special';
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
			var aMsg = 'player ' + state.tossWinner + ' does a ' + state.chosenAttack.type + ' attack';
			ctx.fillText(aMsg, getCanvasCentre().x, getCanvasCentre().y);
			frame++;
			if (frame >= 120) {
				state.gameState = 'defense';
				frame = 0;
			}
		}
		else if (state.gameState == 'defense') {
			ctx.textAlign = 'center';
			state.defender = state.tossWinner === 1 ? 2 : 1;
			ctx.fillText('player ' + state.defender + ', reverse it!', getCanvasCentre().x, getCanvasCentre().y);
			frame++;
			
			if (frame >= 120) {
			  frame = 0;
			  state.gameState = 'attackIncoming';
			  p1.resetScore();
			  p2.resetScore();
			}
		}
		else if (state.gameState == 'attackIncoming') {					
		  frame++;
			var seconds = 60 / state.chosenAttack.speed * 10;
			ctx.textAlign = 'center';
			ctx.fillText(seconds + ' : ' + frame, getCanvasCentre().x, canvas.height - 50);
			
			switch (state.defender) {
			  case 1:
			      p1.draw(ctx);
			      if (p1.getScore() >= 100) {
			        state.gameState = 'attackFail';
			      }
			    break;
			  case 2:
			      p2.draw(ctx);
			      if (p2.getScore() >= 100) {
			        state.gameState = 'attackFail';
			      }
			    break;
			}
			
			if (frame >= seconds) {
				//if (state.defender === 1) {
				//	state.playerOneHealth -= state.chosenAttack.damage;
				//	if (state.playerOneHealth <= 0) {
				//	  state.playerOneHealth = 0;
				//	  state.gameState = 'gameOver';
				//	}
				//	else {
					  state.gameState = 'attackSuccess';
				//	}
				//}
				//else {
				//	state.playerTwoHealth -= state.chosenAttack.damage;
				//	if (state.playerTwoHealth <= 0) {
				//	  state.playerTwoHealth = 0;
				//	  state.gameState = 'gameOver';
				//	}
				//	state.gameState = 'attackSuccess';
				//}
				
				// @todo defence mechanics go here
				// -------------------------------
				
				//frame = 0;
				//if (state.gameState != 'gameOver') {
				//  state.gameState = 'toss';
				//}
				//p1.resetScore();
				//p2.resetScore();
			}
		}
		else if (state.gameState == 'attackFail') {
		  p1.resetScore();
		  p2.resetScore();
		  frame = 0;
		  if (state.defender === 1) {
		    state.playerTwoHealth -= state.chosenAttack.damage / 2;
		    if (state.playerTwoHealth <= 0) {
		      state.playerTwoHealth = 0;
		      state.gameState = 'gameOver';
		    }
		    else {
		      state.gameState = 'toss';
		    }
		  }
		  else {
		    state.playerOneHealth -= state.chosenAttack.damage / 2;
		    if (state.playerOneHealth <= 0) {
		      state.playerOneHealth = 0;
		      state.gameState = 'gameOver';
		    }
		    else {
		      state.gameState = 'toss';
		    }
		  }
		}
		else if (state.gameState == 'attackSuccess') {
			if (state.defender === 1) {
			  state.playerOneHealth -= state.chosenAttack.damage;
			  if (state.playerOneHealth <= 0) {
			    state.playerOneHealth = 0;
			    state.gameState = 'gameOver';
			  }
			}
			else {
			  state.playerTwoHealth -= state.chosenAttack.damage;
			  if (state.playerTwoHealth <= 0) {
			    state.playerTwoHealth = 0;
			    state.gameState = 'gameOver';
			  }
			}
			
			state.gameState = 'toss';
			frame = 0;
			p1.resetScore();
			p2.resetScore();
		}
		else if (state.gameState == 'gameOver') {
			var msg = state.playerOneHealth <= 0 ? 'Player 2' : 'Player 1';
			msg += ' wins';
			ctx.textAlign = 'center';
			ctx.fillText(msg, getCanvasCentre().x, getCanvasCentre().y);
			frame++;
			if (frame >= 120) {
				frame = 0;
				state.gameState = 'toss';
				state.playerOneHealth = state.playerTwoHealth = 100;
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
  		}
  }
  
  function doAttack(player, attack) {
  
  }
}