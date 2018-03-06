// Create UI namespace
window.app.ui = {};

// Stochastic matrix UI code
(() => {
	// Create the UI for the section stochastic matrix
	window.app.ui.renderStochasticMatrix = (matrix) => {
		const sections = ['crashBreakdown', 'openHatBreakdown', 'tremeloCounterpointSection', 'hitBridgeSection'];
		const readableSectionNames = {
			crashBreakdown: 'Breakdown',
			openHatBreakdown: 'Augmented Breakdown',
			tremeloCounterpointSection: 'Counterpoint',
			hitBridgeSection: 'Chromatic Counterpoint Bridge'
		}

		const numSections = 4;
		const table = document.querySelector('#stochasticMatrixTable');

		let topLabelRow = document.createElement('tr');
		let blankCell = document.createElement('td');
		blankCell.setAttribute('colspan', 2);
		blankCell.setAttribute('rowspan', 2);
		topLabelRow.appendChild(blankCell);
		let topLabelCell = document.createElement('th');
		topLabelCell.innerHTML = 'To Section';
		topLabelCell.setAttribute('colspan', numSections);
		topLabelRow.appendChild(topLabelCell);
		table.appendChild(topLabelRow);

		// create 'to section' labels
		let tableRow = document.createElement('tr');
		for (let i = 0; i < numSections; i++) {
			let tableCell = document.createElement('th');
			tableCell.innerHTML = readableSectionNames[sections[i]];
			tableRow.appendChild(tableCell);
		}
		table.appendChild(tableRow);

		// create 'from section' labels and content
		for (let i = 0; i < numSections; i++) {
			let tableRow = document.createElement('tr');
			if (i === 0) {
				let leftLabelCell = document.createElement('th');
				leftLabelCell.innerHTML = 'From Section';
				leftLabelCell.setAttribute('rowspan', numSections);
				tableRow.appendChild(leftLabelCell);
			}
			let fromSection = sections[i];
			for (let j=0; j < numSections + 1; j++) {
				let tableCell;
				if (j === 0) {
					tableCell = document.createElement('th');
					tableCell.innerHTML = readableSectionNames[fromSection];
				} else {
					tableCell = document.createElement('td');
					let toSection = sections[j - 1];
					tableCell.innerHTML = matrix[fromSection][toSection];
				}
				tableRow.appendChild(tableCell);
			}
			table.appendChild(tableRow);
		}
	};
})();

// Breakdown UI code
(() => {
	// Initialization code
	const numDisplayBreakdownBars = 32;
	let currentBreakdownBar = 0;
	let breakdownImgArray = [];
	const nameToImgSrc = {
		downOne: 'src/breakdownSVGs/downOne.svg',
		downThree: 'src/breakdownSVGs/downThree.svg',
		four: 'src/breakdownSVGs/four.svg',
		upOne: 'src/breakdownSVGs/upOne.svg',
		upThree1: 'src/breakdownSVGs/upThree1.svg',
		upThree2: 'src/breakdownSVGs/upThree2.svg',
		upThreeDownThree1: 'src/breakdownSVGs/upThreeDownThree1.svg',
		upThreeDownThree2: 'src/breakdownSVGs/upThreeDownThree2.svg',
		upThreeFour1: 'src/breakdownSVGs/upThreeFour1.svg',
		upThreeFour2: 'src/breakdownSVGs/upThreeFour2.svg',
		upThreeUpOne1: 'src/breakdownSVGs/upThreeUpOne1.svg',
		upThreeUpOne2: 'src/breakdownSVGs/upThreeUpOne2.svg'
	}
	const breakdownDiv = document.querySelector('#vexFlowBreakdown');

	for (let i = 0; i < numDisplayBreakdownBars; i++) {
		let barDiv = document.createElement('div');
		barDiv.classList.add('breakdownBarDiv');

		let barImg = document.createElement('img');
		barImg.src = 'src/breakdownSVGs/rest.svg';
		breakdownImgArray.push(barImg);

		barDiv.appendChild(barImg);
		breakdownDiv.appendChild(barDiv);

		if (i%16 === 15) {
			let lineBreak = document.createElement('br');
			lineBreak.classList.add('sixteenBreak');
			barDiv.parentNode.insertBefore(lineBreak, barDiv.nextSibling);
		}
		if (i%8 === 7) {
			let lineBreak = document.createElement('br');
			lineBreak.classList.add('eightBreak');
			barDiv.parentNode.insertBefore(lineBreak, barDiv.nextSibling);
		}
		if (i%4 === 3) {
			let lineBreak = document.createElement('br');
			lineBreak.classList.add('fourBreak');
			barDiv.parentNode.insertBefore(lineBreak, barDiv.nextSibling);
		}
	}
	// End Initialization code

	window.app.ui.setBreakdownBarImg = (soundObj) => {
		if (currentBreakdownBar === 0) {
			// Set all to rests
			for (let i = 1; i < numDisplayBreakdownBars; i++) {
				breakdownImgArray[i].src = 'src/breakdownSVGs/rest.svg';
			}
		}
		if (soundObj.bars > 1) {
			for (let i = 0; i < soundObj.bars; i++) {
				breakdownImgArray[currentBreakdownBar + i].src = nameToImgSrc[soundObj.name + (i + 1)];
			}
		} else {
			breakdownImgArray[currentBreakdownBar].src = nameToImgSrc[soundObj.name];
		}

		currentBreakdownBar = (currentBreakdownBar + soundObj.bars)%numDisplayBreakdownBars;
	}
})();

// Counterpoint UI code
(() => {
	window.app.ui.renderCounterpoint = (counterpointObj) => {
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
		let counterpointStrings = counterpointToVexflowStrings(counterpointObj);

		const VF = Vex.Flow;

		// Create an SVG renderer and attach it to the DIV element named 'vexFlowCounterpoint'.
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
	};
})();

// Temporary code for creating premade SVGs
(() => {
	document.querySelector('#temporary').style.display = 'block';
	document.querySelector('#container').style.display = 'none';

	const VF = Vex.Flow;
	// Create an SVG renderer and attach it to the DIV element named 'vexFlowTemp'
	const vf = new VF.Factory({renderer: {elementId: 'vexFlowTemp'}});
	const score = vf.EasyScore();
	const makeSystem = (width) => {
		const system = vf.System({ x: 0, y: 0, width: width, spaceBetweenStaves: 0 });
		return system;
	};
	const concat = (a, b) => { return a.concat(b); };
	const voice = score.voice.bind(score);
	const notes = score.notes.bind(score);
	const beam = score.beam.bind(score);

	score.set({time: '1/4'});
	const system = makeSystem(100);
	system.addStave({
		voices: [
			voice([
				//notes('(C6 E6)/q, (C#6 En6)/q'),
				//beam(notes('(C4 G4)/16, (C4 G4)/16')),
				//notes('(C5 Db5)/8, E4/8/r'),
				notes('(E5 Fb5)/8, E4/8/r')
				//beam(notes('(C4 G4)/16, (C4 G4)/16')),
				//beam(notes('(C4 G4)/8, (C4 G4)/8')),
				//notes('E4/16/r')
			].reduce(concat))
		]
	});
	vf.draw();
});
