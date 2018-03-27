// Create UI namespace
window.app.ui = {};

// Stochastic matrix UI code
// AND
// Sections description code
// AND
// Section highlighting code/Scroll to section code
(() => {
	// Create the UI for the section stochastic matrix
	window.app.ui.renderStochasticMatrix = (matrix) => {
		const sections = Object.keys(matrix);
		const readableSectionNames = {
			breakdown: 'Breakdown',
			augmentedBreakdown: 'Augmented Breakdown',
			counterpoint: 'Counterpoint',
			chromaticCounterpointBridge: 'Chromatic Counterpoint Bridge'
		};

		const numSections = sections.length;
		const table = document.querySelector('#stochasticMatrixTable');

		let topLabelRow = document.createElement('tr');
		let blankCell = document.createElement('td');
		blankCell.setAttribute('colspan', 2);
		blankCell.setAttribute('rowspan', 2);
		blankCell.classList.add('topLeftNoBorder');
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
			tableCell.classList.add('normalWeight');
			tableRow.appendChild(tableCell);
		}
		table.appendChild(tableRow);

		// create 'from section' labels and content
		for (let i = 0; i < numSections; i++) {
			let tableRow = document.createElement('tr');
			if (i === 0) {
				let leftLabelCell = document.createElement('th');
				leftLabelCell.innerHTML = 'From Section';
				leftLabelCell.classList.add('sideways');
				leftLabelCell.setAttribute('rowspan', numSections);
				tableRow.appendChild(leftLabelCell);
			}
			let fromSection = sections[i];
			for (let j=0; j < numSections + 1; j++) {
				let tableCell;
				if (j === 0) {
					tableCell = document.createElement('th');
					tableCell.classList.add('normalWeight');
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

		// Also add the section description text
		sectionNamesArr = Object.values(readableSectionNames);
		let sectionsString = '';
		for (let i = 0; i < sectionNamesArr.length; i++) {
			sectionsString += '<i>' + sectionNamesArr[i] + '</i>';
			if (i !== sectionNamesArr.length - 1) {
				sectionsString += ', ';
			}
			if (i === sectionNamesArr.length - 2) {
				sectionsString += 'and ';
			}
		}
		const setAllText = (selectorString, textString) => {
			document.querySelectorAll(selectorString).forEach((domElement) => { domElement.innerHTML = textString; });
		};
		setAllText('.sectionsDescription .sectionsNumSections', numSections);
		setAllText('.sectionsDescription .sectionsSectionsString', sectionsString);
		setAllText('.sectionsDescription .sectionsFirstSection', readableSectionNames[sections[0]]);
		setAllText('.sectionsDescription .sectionsSecondSection', readableSectionNames[sections[1]]);
		setAllText('.sectionsDescription .sectionsProbability', matrix[sections[0]][sections[1]]);
	};

	// Section highlighting code and scroll to section code
	let lastSectionIcon = null;
	let scrollToSectionInput = document.querySelector('#scrollToSection');
	window.app.ui.highlightSection = (sectionName) => {
		if (lastSectionIcon) {
			lastSectionIcon.classList.add('hide');
		}
		lastSectionIcon = document.querySelector('#' + sectionName + ' .playingIcon');
		lastSectionIcon.classList.remove('hide');
		if (scrollToSectionInput.checked) {
			document.querySelector('#' + sectionName).scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
		}
	}
})();

// Breakdown UI code
// AND
// Augmented Breakdown UI code
(() => {
	const initializeAndGenerateBreakdownUIFunctions = (sectionName, soundNameToImgSrcObj, containerDivID) => {
		// Initialization code

		// Create component images
		const keys = Object.keys(soundNameToImgSrcObj);
		const values = Object.values(soundNameToImgSrcObj);
		const container = document.querySelector('#' + containerDivID + ' .componentsContainer');
		for (let i=0; i<keys.length; i++) {
			let key = keys[i];
			let path = soundNameToImgSrcObj[key];
			let componentDiv = document.createElement('div');
			componentDiv.classList.add('component');

			let componentImg = document.createElement('img');
			componentImg.src = path;
			componentDiv.appendChild(componentImg);
			if (key.substr(-1) === '1') {
				//Group divided components together
				let coreString = key.substr(0, key.length-1);
				for (let j=i+1; j<keys.length; j++) {
					let nextKey = keys[j];
					let nextPath = soundNameToImgSrcObj[nextKey];
					if (nextKey.substr(0, nextKey.length-1) === coreString) {
						let nextComponentImg = document.createElement('img');
						nextComponentImg.src = nextPath;
						componentDiv.appendChild(nextComponentImg);
						i++;
					} else {
						break;
					}
				}
			}
			container.appendChild(componentDiv);
		}

		// Create notation elements
		const numDisplayBreakdownBars = 32;
		let currentBreakdownBar = 0;
		let breakdownImgArray = [];
		const breakdownNotationDiv = document.querySelector('#' + containerDivID + ' .breakdownNotation');
		// mark the container as a breakdown section for css, see styles.css
		document.querySelector('#' + containerDivID).classList.add('breakdown');

		for (let i = 0; i < numDisplayBreakdownBars; i++) {
			let barDiv = document.createElement('div');
			barDiv.classList.add('breakdownBarDiv');

			let barImg = document.createElement('img');
			barImg.src = 'src/breakdownSVGs/rest.svg';
			breakdownImgArray.push(barImg);

			barDiv.appendChild(barImg);
			breakdownNotationDiv.appendChild(barDiv);

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

		// Create key signature imgs
		const keySignatureDiv = document.querySelector('#' + containerDivID + ' .keySignature');
		for (let i=0; i < 8; i++) {
			let keySignatureImgDiv = document.createElement('div');
			let keySignatureImg = document.createElement('img');
			keySignatureImg.src = 'src/breakdownSVGs/keySignature.svg';
			keySignatureImgDiv.appendChild(keySignatureImg);
			keySignatureDiv.appendChild(keySignatureImgDiv);
		};
		// End Initialization code

		window.app.ui['set' + sectionName + 'BarImg'] = (soundObj) => {
			if (currentBreakdownBar === 0) {
				// Set all to rests
				for (let i = 1; i < numDisplayBreakdownBars; i++) {
					breakdownImgArray[i].src = 'src/breakdownSVGs/rest.svg';
				}
			}
			if (soundObj.bars > 1) {
				for (let i = 0; i < soundObj.bars; i++) {
					breakdownImgArray[currentBreakdownBar + i].src = soundNameToImgSrcObj[soundObj.name + (i + 1)];
				}
			} else {
				breakdownImgArray[currentBreakdownBar].src = soundNameToImgSrcObj[soundObj.name];
			}

			currentBreakdownBar = (currentBreakdownBar + soundObj.bars)%numDisplayBreakdownBars;
		};
	};

	const breakdownNameToImgSrc = {
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
	};
	// Initializes Breakdown UI and Creates window.app.ui.setBreakdownBarImg function
	initializeAndGenerateBreakdownUIFunctions('Breakdown', breakdownNameToImgSrc, 'breakdown');

	const highsNameToImgSrc = {
		highOneUpOne: 'src/breakdownSVGs/highOneUpOne.svg',
		highTwoUpOne: 'src/breakdownSVGs/highTwoUpOne.svg',
		highOneUpThree1: 'src/breakdownSVGs/highOneUpThree1.svg',
		highOneUpThree2: 'src/breakdownSVGs/highOneUpThree2.svg',
		highTwoUpThree1: 'src/breakdownSVGs/highTwoUpThree1.svg',
		highTwoUpThree2: 'src/breakdownSVGs/highTwoUpThree2.svg',
		highOneUpThreeDownThree1: 'src/breakdownSVGs/highOneUpThreeDownThree1.svg',
		highOneUpThreeDownThree2: 'src/breakdownSVGs/highOneUpThreeDownThree2.svg',
		highTwoUpThreeDownThree1: 'src/breakdownSVGs/highTwoUpThreeDownThree1.svg',
		highTwoUpThreeDownThree2: 'src/breakdownSVGs/highTwoUpThreeDownThree2.svg',
		highOneUpThreeFour1: 'src/breakdownSVGs/highOneUpThreeFour1.svg',
		highOneUpThreeFour2: 'src/breakdownSVGs/highOneUpThreeFour2.svg',
		highTwoUpThreeFour1: 'src/breakdownSVGs/highTwoUpThreeFour1.svg',
		highTwoUpThreeFour2: 'src/breakdownSVGs/highTwoUpThreeFour2.svg',
		highOneUpThreeUpOne1: 'src/breakdownSVGs/highOneUpThreeUpOne1.svg',
		highOneUpThreeUpOne2: 'src/breakdownSVGs/highOneUpThreeUpOne2.svg',
		highTwoUpThreeUpOne1: 'src/breakdownSVGs/highTwoUpThreeUpOne1.svg',
		highTwoUpThreeUpOne2: 'src/breakdownSVGs/highTwoUpThreeUpOne2.svg',
		highOne: 'src/breakdownSVGs/highOne.svg',
		highTwo: 'src/breakdownSVGs/highTwo.svg',
		squeal1: 'src/breakdownSVGs/squeal1.svg',
		squeal2: 'src/breakdownSVGs/squeal2.svg'
	};
	const augmentedBreakdownNameToImgSrc = Object.assign({}, breakdownNameToImgSrc, highsNameToImgSrc);
	// Initializes Augmented Breakdown UI and Creates window.app.ui.setAugmentedBreakdownBarImg function
	initializeAndGenerateBreakdownUIFunctions('AugmentedBreakdown', augmentedBreakdownNameToImgSrc, 'augmentedBreakdown');
})();

// Counterpoint UI code
// AND
// Chromatic Counterpoint Bridge UI code
(() => {
	const generateCounterpointUIFunctions = (sectionName, numToNoteObj, renderDivId, noteLengthSeconds, showKeySignature = true) => {
		// Create render function
		window.app.ui['render' + sectionName] = (counterpointObj) => {
			// Helper function that uses numToNoteObj to create note strings for vexflow
			const counterpointToVexflowStrings = (counterpoint) => {
				const counterpointNumToNoteStr = numToNoteObj;
				let lowString = '';
				let highString = '';
				console.assert(counterpoint.lowArray.length === counterpoint.highArray.length);
				for (let i=0; i<counterpoint.lowArray.length; i++) {
					lowString += counterpointNumToNoteStr[counterpoint.lowArray[i]];
					highString += counterpointNumToNoteStr[counterpoint.highArray[i]];
					if (i === 0) {
						lowString += '/q';
						highString += '/q';
					}
					lowString += '[id="note' + sectionName + 'Low' + i + '"]';
					highString += '[id="note' + sectionName + 'High'+ i + '"]';
					if (i != counterpoint.lowArray.length - 1) {
						lowString += ', ';
						highString += ', ';
					}
				}
				return {lowString: lowString, highString: highString}
			}
			let counterpointStrings = counterpointToVexflowStrings(counterpointObj);

			const VF = Vex.Flow;

			// Create an SVG renderer and attach it to the DIV element with specified id
			const vf = new VF.Factory({renderer: {elementId: renderDivId, width: 575, height: 200}});
			const score = vf.EasyScore();
			const system = vf.System({width: 550});

			score.set({time: '16/4'});
			let temp = system.addStave({
				voices: [
					score.voice(score.notes(counterpointStrings.highString, {stem: 'up'})),
					score.voice(score.notes(counterpointStrings.lowString, {stem: 'down'}))
				]
			}).addClef('treble')
			if (showKeySignature) {
				temp.addKeySignature('Eb');
			}

			vf.draw();

			// Remove default fill from notes so we can style them dynamically
			let noteHeads = document.querySelectorAll('#' + renderDivId + ' .vf-notehead path');
			noteHeads.forEach((path) => {
				path.removeAttribute('fill');
			});
		};

		// Create highlight function
		window.app.ui['setHighlight' + sectionName] = (noteNum, highlightOrNot = true) => {
			let highNote = document.querySelector('#vf-note' + sectionName + 'High' + noteNum);
			let lowNote = document.querySelector('#vf-note' + sectionName + 'Low' + noteNum);
			// See 'scheduleAheadTime' in main.js
			window.setTimeout(() => {
				if (highlightOrNot) {
					highNote.classList.add('redFill');
					lowNote.classList.add('redFill');
				} else {
					highNote.classList.remove('redFill');
					lowNote.classList.remove('redFill');
				}

			}, 0.2 * 1000);
			if (highlightOrNot) {
				// schedule de-highlighting note after noteLengthSeconds
				window.setTimeout(() => {
					window.app.ui['setHighlight' + sectionName](noteNum, false);
				}, noteLengthSeconds * 1000);
			}
		};
	};
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
	// Creates window.app.ui.renderCounterpoint and window.app.ui.setHighlightCounterpoint functions
	generateCounterpointUIFunctions('Counterpoint', counterpointNumToNoteStr, 'vexFlowCounterpoint', 1.333, true);

	const chromaticCounterpointBridgeNumToNoteStr = {
		0: 'Cn2',
		1: 'C#3',
		2: 'Dn3',
		3: 'D#3',
		4: 'En3',
		5: 'Fn3',
		6: 'F#3',
		7: 'Gn3',
		8: 'G#3',
		9: 'An3',
		10: 'A#3',
		11: 'Bn3',
		12: 'Cn4',
		13: 'C#4',
		14: 'Dn4',
		15: 'D#4',
		16: 'En4',
		17: 'Fn4',
		18: 'F#4',
		19: 'Gn4',
		20: 'G#4',
		21: 'An4',
		22: 'A#4',
		23: 'Bn4',
		24: 'Cn5',
		25: 'C#5',
		26: 'Dn5',
		27: 'D#5',
		28: 'En5',
		29: 'Fn5',
		30: 'F#5',
		31: 'Gn5',
		32: 'G#5',
		33: 'An5',
		34: 'A#5',
		35: 'Bn5',
		36: 'Cn6'
	};
	// Creates window.app.ui.renderChromaticCounterpointBrudge and window.app.ui.setHighlightChromaticCounterpointBridge functions
	generateCounterpointUIFunctions('ChromaticCounterpointBridge', chromaticCounterpointBridgeNumToNoteStr, 'vexFlowChromaticCounterpointBridge', 0.333, false);
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
		const system = vf.System({x: 0, y: 0, width: width});
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
