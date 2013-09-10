var context = new webkitAudioContext();
var osc = context.createOscillator();
var filter = context.createBiquadFilter();
osc.connect(filter);
filter.connect(context.destination);
osc.noteOn(0);
window.addEventListener('deviceorientation', function(e) {
  osc.frequency.value = 440*Math.pow(2,tuneMIDI(e.gamma/8, pentaScale)/12);
  filter.frequency.value = 440*Math.pow(2, e.beta/1);
  
  
  document.getElementById('beta').innerHTML = "beta:"+Math.round(e.beta); document.getElementById('gamma').innerHTML = "gamma:"+Math.round(e.gamma);
  var abg = document.getElementById('abg');
  abg.style.top = (e.beta+180)+"px";
  abg.style.left = (e.gamma+180)+"px";
  
  var alpha = e.alpha*Math.PI/180;
  alpha = 0;
  var beta = e.beta*Math.PI/180;
  var gamma = e.gamma*Math.PI/180;
  
  var theta = gamma;
  var phi = beta+Math.PI/2;
  var px = Math.sin(phi)*Math.cos(theta);
  var py = Math.sin(phi)*Math.sin(theta);
  var pz = Math.cos(phi);
  
  document.getElementById('rx').i=nnerHTML = "px:"+px;
  document.getElementById('ry').innerHTML = "py:"+py;
  document.getElementById('rz').innerHTML = "pz:"+pz;
  var rxyz = document.getElementById('rxyz');
  rxyz.style.left = (py*90+180)+"px";
  rxyz.style.top = (-pz*90+180)+"px";
});

var chords = [
    [0,3,7],
    [10,2,5],
    [8,0,3],
    [7,11,2]
];

var pentaScale = [0,2,4,7,9];

function tuneMIDI(val, tuning) {
  //find the first above, and then the first below
  
  var octave = Math.floor(val/12-1)*12;
  var i = 0;
  var noteAbove = -Infinity;
  var noteBelow = -Infinity;
  while (true) {
    noteAbove = octave + tuning[i];
    if (noteAbove < val) {
      noteBelow = noteAbove;
    } else {
      break; 
    }
    i++;
    if (i == tuning.length) {
      octave += 12;
      i = 0;
    }
  }
  return noteAbove;
}