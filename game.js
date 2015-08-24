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
  
  var frame = 0;

  window.requestAnimationFrame(loop);
  window.addEventListener("keydown", function (event) {
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
  });
  
  function loop() {
  		clear();
  		if (p1.getScore() < 100 && p2.getScore() < 100) {
			p1.draw(ctx);
			p2.draw(ctx);
		}
		else {
			var winner = '';
			if (frame < 120) {
				frame++;
				winner = p1.getScore() >= 100 ? 'player one' : 'player two';
				winner += ' has the power';
			}
			else {
				winner = 'choose your attack';
			}
			ctx.textAlign = 'center';
			ctx.fillText(winner, getCanvasCentre().x, getCanvasCentre().y);
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
  			}
  		};
  		
  }
  
  function getCanvasCentre() {
  		return {
  			x: canvas.width / 2,
  			y: canvas.height / 2
  		}
  }
}