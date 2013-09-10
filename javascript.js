var context = new webkitAudioContext();
var osc = context.createOscillator();
var filter = context.createBiquadFilter();
osc.connect(filter);
filter.connect(context.destination);
//osc.noteOn(0);
window.addEventListener('deviceorientation', function(e) {
	//osc.frequency.value = 440*Math.pow(2,tuneMIDI(e.gamma/8, pentaScale)/12);
	//filter.frequency.value = 440*Math.pow(2, e.beta/1);
	
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
	
	var chordNum = 0;
	if (py < pz) chordNum += 2;
	if (py < -pz) chordNum++;
	playChord(chordNum, Math.sqrt(Math.pow(py,2)+Math.pow(pz,2))*4-3);
});

var chords = [
	[0,4,7],
	[7,11,14],
	[5,9,12],
	[9,12,16]
];

var chordOscs = [context.createOscillator(),context.createOscillator(),context.createOscillator()];
var chordFilters = [context.createBiquadFilter(),context.createBiquadFilter(),context.createBiquadFilter()]
for (var i in chordOscs) {
	chordOscs[i].noteOn(0);
	chordOscs[i].type = "square";
	chordOscs[i].connect(chordFilters[i]);
	chordFilters[i].connect(context.destination);
}

function playChord(chordIndex, intensity) {
	console.log(chordIndex, intensity);
	for (var i in chordOscs) {
		chordOscs[i].frequency.value = 440*Math.pow(2,chords[chordIndex][i]/12)
		chordFilters[i].frequency.value = 440*Math.pow(2,intensity);
	}
}

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