function Sounds() {
  this.audioContext = new AudioContext();
  this.notes = [
    [-3, 2, 9],
    [0, 5, 12],
    [3, 8, 15],
    [6, 11, 18],
    [9, 14, 21]
  ];
}
Sounds.prototype.playSuccess = function(val) {
  var speed = 0.05;
  var place = 0 - speed;
  var duration = 0.05;
  for (var j = 0; j < this.notes[val].length; j++) {
    this.play(place += speed, this.notes[val][j], duration);
  }
};
Sounds.prototype.play = function(startAfter, pitch, duration) {
  //var length = 0.5;
  //var delay = 0.5;

  var time = this.audioContext.currentTime + startAfter;
  var input = this.audioContext.createGain();
  var feedback = this.audioContext.createGain();
  var delay = this.audioContext.createDelay();

  var output = this.audioContext.createGain();
  output.connect(this.audioContext.destination);

  delay.delayTime.value = 0.1;
  feedback.gain.value = 0.4; // dangerous when > 1 ;-)

  // dry path
  input.connect(output);

  // wet path
  input.connect(delay);

  // feedback loop
  delay.connect(feedback);
  feedback.connect(delay);
  feedback.connect(output);


  var oscillator = this.audioContext.createOscillator();
  oscillator.connect(delay);

  oscillator.type = 'square';
  oscillator.detune.value = pitch * 100;

  oscillator.start(time);
  oscillator.stop(time + duration);
};

//var s = new Sounds();
//s.playSuccess(4);
