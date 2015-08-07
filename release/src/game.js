function draw() {
  var canvas = document.getElementById('canvas');
  // resize the canvas
  canvas.width = 800;
  canvas.height = 400;
  console.log(canvas);
  var ctx = canvas.getContext('2d');
  ctx.fillRect(25, 25, 100, 100);
  ctx.clearRect(45, 45, 60, 60);
  ctx.strokeRect(50, 50, 50, 50);
}
