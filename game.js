function game() {
  
  var game = new Core();
  game.init();
}

function Core() {
	this.canvas = document.getElementById('canvas');
	this.ctx = this.canvas.getContext('2d');
	
	// resize the canvas
	this.canvas.width = 800;
	this.canvas.height = 400;
}

Core.prototype.init = function() {
	window.requestAnimationFrame(this.draw);
};

Core.prototype.draw = function() {
	this.ctx.font = "22px sans-serif";
	this.ctx.fillText(this.getLetter(), 10, 50);
	window.requestAnimationFrame();
};

Core.prototype.getLetter = function() {
	var MIN = 65;
	var MAX = 90;
	return String.fromCharCode(MIN).toLowerCase();
};