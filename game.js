function game() {

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = 800;
  canvas.height = 400;
  
  var availableKeys = new AvailableKeys();
  var keyStroke = new KeyStroke(availableKeys.getKey());
  var p2Keys = new KeyStroke(availableKeys.getKey());

  window.requestAnimationFrame(loop);
  window.addEventListener("keydown", function (event) {
  		// player 1
  		if (event.keyCode === keyStroke.currentLetter) {
  			availableKeys.keys[keyStroke.currentLetter - 65].available = true;
  			keyStroke.assignLetter(availableKeys.getKey());
  		}
  		// player 2
  		else if (event.keyCode === p2Keys.currentLetter) {
  			availableKeys.keys[p2Keys.currentLetter - 65].avaialble = true;
  			p2Keys.assignLetter(availableKeys.getKey());
  		}
  });
  
  function loop() {
  		clear();
		var p1 = player(10, 20, keyStroke);
		var p2 = player(100, 20, p2Keys);
		
		window.requestAnimationFrame(loop);
  }
  
  function clear() {
  		ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  
  function player(x, y, _keystroke) {
  		ctx.font = '22px sans-serif';
  		ctx.fillText(_keystroke.getLetter(), x, y);
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