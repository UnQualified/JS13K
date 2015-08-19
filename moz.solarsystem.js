function game() {
  //var canvas = document.getElementById('canvas');
  //var ctx = canvas.getContext('2d');
  // resize the canvas
  //canvas.width = 800;
  //canvas.height = 400;
  
  var ss = solarSystem();
  ss.init();
}

// mdn animated solar system
var solarSystem = function() {
	var sun   = new Image();
	var moon  = new Image();
	var earth = new Image();
	
	return {
		init: function() {
			sun.src = 'https://mdn.mozillademos.org/files/1456/Canvas_sun.png';
			moon.src = 'https://mdn.mozillademos.org/files/1443/Canvas_moon.png';
			earth.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png';
			window.requestAnimationFrame(draw);
		},
		draw: function() {
			var ctx = document.getElementById('canvas').getContext('2d');
			
			ctx.globalCompositeOperation = 'destination-over';
			ctx.clearRect(0, 0, 300, 300); // clear canvas
			
			ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
			ctx.strokeStyle = 'rgba(0, 153, 255, 0.4)';
			ctx.save();
			ctx.translate(150, 150);
			
			// Earth
			var time = new Date();
			ctx.rotate(((2 * Math.Pi) / 60) * time.getSeconds() +
			           ((2 * Math.Pi) / 60000) * time.getMilliseconds());
			ctx.translate(105, 0);
			ctx.fillRect(0, -12, 50, 24);  // shadow
			ctx.drawImage(earth, -12, -12);
			
			// Moon
			ctx.save();
			ctx.rotate(((2 * Math.Pi) / 6) * time.getSeconds() + 
			           ((2 * Math.Pi) / 6000) * time.getMilliseconds());
			ctx.translate(0, 28.5);
		}		
	}
};

// !mdn colours tutorial
function colour(ctx) {
	for (var i = 0; i < 6; i++) {
		for (var j = 0; j < 6; j++) {
			//ctx.fillStyle = getColour(i, j);
			//ctx.fillRect(j * 25, i * 25, 25, 25);
			// do strokestyle instead of rects -- doesn't work...
			ctx.strokeStyle = getColour(i, j);
			ctx.beginPath();
			ctx.arc(12.5 + j * 25,
						 12.5 + i * 25,
						 10,
						 0,
						 Math.Pi * 2,
						 true);
			ctx.stroke();
		}
	}
	
	function getColour(x, y) {
		var rgb = 'rgb(' + Math.floor(255 - 42.5 * x) + ',';
		rgb += Math.floor(255 - 42.5 * y) + ',0)';
		return rgb;
	}
}

// mdn line dash example
function lines(ctx) {
	var offset = 0;
	var draw = function() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.setLineDash([4, 2]);
		ctx.strokeRect(10, 10, 100, 100);
	};
	var march = function() {
		offset++;
		if (offset > 16) {
			offset = 0;
		}
		draw();
		setTimeout(march, 20);
	};
	march();
}
