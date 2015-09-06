function Sounds() {
  this.audioContext = new AudioContext();
  // refactor this!!!
  this.notes = [
    {
      notes: [-3, 2, 9],
      delay: 0.1,
      feedback: 0.4
    },
    {
      notes: [0, 5, 12],
      delay: 0.1,
      feedback: 0.4
    },
    {
      notes: [3, 8, 15],
      delay: 0.1,
      feedback: 0.4
    },
    {
      notes: [6, 11, 18],
      delay: 0.1,
      feedback: 0.4
    },
    {
      notes: [9, 14, 21, 22, 28, 30, 32, 32, 35, 9, 9, 9],
      delay: 0.1,
      feedback: 0.6
    }
  ];
  this.p2notes = [
    {
      notes: [-5, -2, -1],
      delay: 0.1,
      feedback: 0.4
    },
    {
      notes: [-3, 0, 1],
      delay: 0.1,
      feedback: 0.4
    },
    {
      notes: [-1, 2, 3],
      delay: 0.1,
      feedback: 0.4
    },
    {
      notes: [1, 4, 5],
      delay: 0.1,
      feedback: 0.4
    },
    {
      notes: [3, 6, 7, 2, 12, 10, 14, 17, 20, 0, 0, 2, 1],
      delay: 0.1,
      feedback: 0.4
    }
  ];
}
Sounds.prototype.playSuccess = function(val, player) {
  var speed = 0.05;
  var place = 0 - speed;
  var duration = 0.15;//0.05;
  var notes = player === 1 ? this.notes : this.p2notes;
  for (var j = 0; j < notes[val].notes.length; j++) {
    this.play(place += speed, notes[val].notes[j], duration, notes[val]);
  }
};
Sounds.prototype.play = function(startAfter, pitch, duration, options) {

  var time = this.audioContext.currentTime + startAfter;
  var input = this.audioContext.createGain();
  var feedback = this.audioContext.createGain();
  var delay = this.audioContext.createDelay();

  var output = this.audioContext.createGain();
  output.connect(this.audioContext.destination);

  delay.delayTime.value = options.delay;
  feedback.gain.value = options.feedback;//0.4; // dangerous when > 1 ;-)

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

function test() {
  var audioContext = new AudioContext();

  var oscillator = audioContext.createOscillator();
  oscillator.type = 'square';
  oscillator.frequency.value = 220;
  oscillator.detune.value = 1500;
  oscillator.connect(audioContext.destination);


  //oscillator.start(audioContext.currentTime);
  //oscillator.stop(audioContext.currentTime + 2);

  var startTime = audioContext.currentTime + 0.100;
  var tempo = 80;
  var _8 = (60/tempo) / 2;

  for (var bar = 0; bar < 2; bar++) {
    var time = startTime + bar * 8 * _8;
    oscillator.start(time);
    oscillator.stop(time + _8);
  }

  /*
   * http://www.html5rocks.com/en/tutorials/webaudio/intro/
  */
}
