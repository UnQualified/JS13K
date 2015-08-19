function game() {

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = 800;
  canvas.height = 400;

  window.requestAnimationFrame(game);

  var keyStroke = new KeyStroke();
  ctx.font = "22px sans-serif";
  ctx.fillText(keyStroke.getLetter(), 10, 20);
}

function KeyStroke() {}
KeyStroke.prototype.getLetter = function() {
  var MIN = 65;
  var MAX = 90;
  return String.fromCharCode(this.getRandom(MIN, MAX)).toLowerCase();
};
KeyStroke.prototype.getRandom = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
