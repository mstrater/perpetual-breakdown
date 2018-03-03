const counterpointToVexflowStrings = (counterpoint) => {
	const counterpointNumToNoteStr = {
		0: 'C2',
		1: 'D3',
		2: 'E3',
		3: 'F3',
		4: 'G3',
		5: 'A3',
		6: 'B3',
		6.5: 'Bn3',
		7: 'C4',
		8: 'D4',
		9: 'E4',
		10: 'F4',
		11: 'G4',
		12: 'A4',
		13: 'B4',
		13.5: 'Bn4',
		14: 'C5',
		15: 'D5',
		16: 'E5',
		17: 'F5',
		18: 'G5',
		19: 'A5',
		20: 'B5',
		20.5: 'Bn5',
		21: 'C6'
	};
	let lowString = '';
	let highString = '';
	console.assert(counterpoint.lowArray.length === counterpoint.highArray.length);
	for (let i=0; i<counterpoint.lowArray.length; i++) {
		lowString += counterpointNumToNoteStr[counterpoint.lowArray[i]];
		highString += counterpointNumToNoteStr[counterpoint.highArray[i]];
		if (i === 0) {
			lowString+='/q';
			highString+='/q';
		}
		if (i != counterpoint.lowArray.length - 1) {
			lowString += ', ';
			highString += ', ';
		}
	}
	return {lowString: lowString, highString: highString}
}
let counterpointStrings = counterpointToVexflowStrings(window.app.ui.counterpoint);

const VF = Vex.Flow;

// Create an SVG renderer and attach it to the DIV element named "vexFlowCounterpoint".
const vf = new VF.Factory({renderer: {elementId: 'vexFlowCounterpoint'}});
const score = vf.EasyScore();
const system = vf.System();

score.set({time: '16/4'});
system.addStave({
	voices: [
		score.voice(score.notes(counterpointStrings.highString, {stem: 'up'})),
		score.voice(score.notes(counterpointStrings.lowString, {stem: 'down'}))
	]
}).addClef('treble').addKeySignature('Eb');

vf.draw();

(function(){
// Create an SVG renderer and attach it to the DIV element named "vexFlowCounterpoint".
const vf = new VF.Factory({renderer: {elementId: 'vexFlowBreakdown'}});
const score = vf.EasyScore();
var x = 120;
var y = 80;
function makeSystem(width) {
	var system = vf.System({ x: 0, y: 0, width: width, spaceBetweenStaves: 0 });
	x += width;
	return system;
}
function concat(a, b) { return a.concat(b); }
var voice = score.voice.bind(score);
var notes = score.notes.bind(score);
var beam = score.beam.bind(score);

score.set({time: '1/4'});

var system = makeSystem(100);
system.addStave({
	voices: [
		voice([
			notes('E4/8/r, E4/8/r'),
			//beam(notes('(C4 G4)/16, (C4 G4)/16'))
		].reduce(concat))
	]
});

/*
score.set({time: '4/4'});
system.addStave({
	voices: [
		score.voice(score.notes('C#5/q, B4, A4, G#4'))
	]
}).addClef('treble').addTimeSignature('4/4').addKeySignature('Eb');
*/
vf.draw();
});

const numDisplayBreakdownBars = 32;
let currentBreakdownBar = 0;
let breakdownImgArray = [];
const nameToImgSrc = {
	downOne: 'src/breakdownSVGs/downOne.svg',
	downThree: 'src/breakdownSVGs/downThree.svg',
	four: 'src/breakdownSVGs/four.svg',
	upOne: 'src/breakdownSVGs/upOne.svg',
	upThree: 'src/breakdownSVGs/upThree.svg',
	upThreeDownThree: 'src/breakdownSVGs/upThreeDownThree.svg',
	upThreeFour: 'src/breakdownSVGs/upThreeFour.svg',
	upThreeUpOne: 'src/breakdownSVGs/upThreeUpOne.svg'
}
window.setBreakdownBarImg = (soundObj) => {
	if (currentBreakdownBar === 0) {
		// Set all to rests
		for (let i = 1; i < numDisplayBreakdownBars; i++) {
			breakdownImgArray[i].src = 'src/breakdownSVGs/rest.svg';
		}
	}
	breakdownImgArray[currentBreakdownBar].src = nameToImgSrc[soundObj.name];
	for (let i = 1; i < soundObj.bars; i++) {
		breakdownImgArray[currentBreakdownBar + i].src = 'src/breakdownSVGs/blank.svg';
	}
	currentBreakdownBar = (currentBreakdownBar + soundObj.bars)%numDisplayBreakdownBars;
}
const breakdownDiv = document.querySelector('#vexFlowBreakdown');

for (let i = 0; i < numDisplayBreakdownBars; i++) {
	let barDiv = document.createElement("div");
	barDiv.classList.add('breakdownBarDiv');

	let barImg = document.createElement("img");
	barImg.src = 'src/breakdownSVGs/rest.svg';
	breakdownImgArray.push(barImg);

	barDiv.appendChild(barImg);
	breakdownDiv.appendChild(barDiv);

	//if (i%8 === 7) {
	//	barDiv.append(document.createElement("br"));
	//}
}
