(function() {
	'use strict';

	function randInt(low, high) {
		return Math.floor(Math.random() * (high - low + 1)) + low;
	}

	function randEntry(array) {
		return array[randInt(0, array.length - 1)];
	}

	function removeEntry(entry, array) {
		var index = array.indexOf(entry);
		if (index > -1) {
			array.splice(index, 1);
		}
	}

	var scales = {
		ionian: {
			deltas: [2, 2, 1, 2, 2, 2, 1],
			useLeadingTone: false,
			flatFifthNote: 6
		},
		dorian: {
			deltas: [2, 1, 2, 2, 2, 1, 2],
			useLeadingTone: true,
			flatFifthNote: 5
		},
		phrygian: {
			deltas: [1, 2, 2, 2, 1, 2, 2],
			useLeadingTone: true,
			flatFifthNote: 4
		},
		lydian: {
			deltas: [2, 2, 2, 1, 2, 2, 1],
			useLeadingTone: false,
			flatFifthNote: 3
		},
		mixolydian: {
			deltas: [2, 2, 1, 2, 2, 1, 2],
			useLeadingTone: true,
			flatFifthNote: 2
		},
		aeolian: {
			deltas: [2, 1, 2, 2, 1, 2, 2],
			useLeadingTone: true,
			flatFifthNote: 1
		},
		locrian: {
			deltas: [1, 2, 2, 1, 2, 2, 2],
			useLeadingTone: true,
			flatFifthNote: 0
		},
		chromatic: {
			deltas: [1],
			useLeadingTone: false
		},
		halfTone: {
			deltas: [2],
			useLeadingTone: false
		},
		octatonic1: {
			deltas: [1, 2],
			useLeadingTone: false
		},
		octatonic2: {
			deltas: [2, 1],
			useLeadingTone: false
		}
	};

	// brute force it lol...
	// The array answers will get you to 1, so you can do a -1 for the final move.
	// I probably wouldn't try to look more than 9 moves ahead.
	// 9 moves takes about 70ms. I think that should be ok.
	// This also means that if you start at 14 or higher, there wont be any answers.
	function bruteForce(start, movesLeft) {
		movesLeft -= 2;
		let next = [[1], [2], [3], [4], [-1], [-2], [-3], [-4]];
		while (movesLeft-- > 0) {
			next = bruteHelper(next);
		}
		return next.filter(function(x) {
			const last = x[x.length - 1];
			return last < 2 && x.reduce(function(a, b) {
				return a - b;
			}, start) === 1;
		});
	}

	function bruteHelper(arr) {
		const ans = [];
		const len = arr.length;
		for (let x = 0; x < len; x++) {
			const seq = arr[x];
			const lastNum = seq[seq.length - 1];
			if (lastNum === 1 || lastNum === -1) {
				for (let y = 1; y < 5; y++) {
					let copy = seq.slice(0);
					copy.push(y);
					ans.push(copy);
					copy = seq.slice(0);
					copy.push(-y);
					ans.push(copy);
				}
			} else {
				const copy = seq.slice(0);
				if (lastNum > 0) {
					copy.push(-1);
				} else {
					copy.push(1);
				}
				ans.push(copy);
			}
		}
		return ans;
	}

	function nextNote(prevPrevNote, prevNote) {
		if (prevNote === undefined) {
			prevNote = 0;
		}
		if (prevPrevNote === undefined) {
			//this means if we are just starting we will tend to step upwards
			prevPrevNote = prevNote - 1;
		}
		const prevInterval = prevNote - prevPrevNote;
		let prevDir = Math.sign(prevInterval);
		if (Math.abs(prevInterval) <= 1) {
			//we didn't just jump
			const jumpChance = Math.random();
			if (jumpChance > 0.7) {
				//we will jump
				const intervalChance = Math.random();
				if (intervalChance < 0.3) {
					//jump a third up
					return prevNote + 2;
				} else if (intervalChance < 0.6) {
					//jump a third down
					return prevNote - 2;
				} else if (intervalChance < 0.7) {
					//jump a fourth up
					return prevNote + 3;
				} else if (intervalChance < 0.8) {
					//jump a fourth down
					return prevNote - 3;
				} else if (intervalChance < 0.9) {
					//jump a fifth up
					return prevNote + 4;
				} else {
					//jump a fifth down
					return prevNote - 4;
				}
			} else {
				//we won't jump
				if (Math.random() < 0.3) {
					//usually want to step in the same direction we were headed, but sometimes switch
					prevDir *= -1;
				}
				return prevNote + prevDir;
			}
		} else {
			//we just jumped, step in the opposite direction
			return prevNote - prevDir;
		}
	}

	function createCantusFirmus() {
		const desiredLength = 16;
		const lengthToBruteForce = 8;
		const actualLength = desiredLength - lengthToBruteForce - 1; //minus one because we need to tack on 0 as the last note
		const cantusFirmus = [0];
		for (let i = 0; i < actualLength; i++) {
			if (i === 0) {
				//Just starting out so there's no prevPrevNote
				cantusFirmus.push(nextNote(undefined, cantusFirmus[0]));
			} else {
				cantusFirmus.push(nextNote(cantusFirmus[cantusFirmus.length - 2], cantusFirmus[cantusFirmus.length - 1]));
			}
		}
		//now finish it up by brute forcing the ending
		const possibleEndings = bruteForce(cantusFirmus[cantusFirmus.length - 1], lengthToBruteForce);
		const endingDeltas = possibleEndings[randInt(0, possibleEndings.length - 1)];

		//What we do here is throw away what we have and start again if we can't finish
		//An improvement would be to make sure you dont get into this situation
		//However, this would likely change the results we get so it's probably not worth it
		if (!endingDeltas) {
			return createCantusFirmus();
		}

		for (let i = 0; i < endingDeltas.length; i++) {
			//Have to reverse the signs because of how the brute force function was defined
			cantusFirmus.push(cantusFirmus[cantusFirmus.length - 1] - endingDeltas[i]);
		}
		cantusFirmus[desiredLength - 1] = 0;
		return cantusFirmus;
	}

	function validateNextNote(lowThirdPrevNote, lowSecondPrevNote, lowFirstPrevNote, lowNextNote, highThirdPrevNote, highSecondPrevNote, highFirstPrevNote, highNextNote) {
		//intervals
		const thirdPrevInterval = highThirdPrevNote - lowThirdPrevNote;
		const secondPrevInterval = highSecondPrevNote - lowSecondPrevNote;
		const firstPrevInterval = highFirstPrevNote - lowFirstPrevNote;
		const nextInterval = highNextNote - lowNextNote;
		//jumps
		const highToFirstPrev = highFirstPrevNote - highSecondPrevNote;
		const highToNext = highNextNote - highFirstPrevNote;
		const lowToNext = lowNextNote - lowFirstPrevNote;
		//check for repeating notes
		if (highFirstPrevNote === highNextNote) {
			return false;
		}
		//check for repeating octaves
		if (firstPrevInterval === 7 && nextInterval === 7) {
			return false;
		}
		//check for repeating fifths
		if (firstPrevInterval === 4 && nextInterval === 4) {
			return false;
		}
		//check for melodic structure
		if (highToFirstPrev > 1 && highToNext !== -1 && highSecondPrevNote !== -1) {
			return false;
		}
		if (highToFirstPrev < -1 && highToNext !== 1 && highSecondPrevNote !== 1) {
			return false;
		}
		//check for 4 thirds in a row
		if (thirdPrevInterval === 2 && secondPrevInterval === 2 && firstPrevInterval === 2 && nextInterval === 2) {
			return false;
		}
		//check for 4 sixths in a row
		if (thirdPrevInterval === 5 && secondPrevInterval === 5 && firstPrevInterval === 5 && nextInterval === 5) {
			return false;
		}
		//check for 4 tenths in a row
		if (thirdPrevInterval === 9 && secondPrevInterval === 9 && firstPrevInterval === 9 && nextInterval === 9) {
			return false;
		}
		//check for jumps in the same direction
		if (highToNext >= 2 && lowToNext >= 2) {
			return false;
		}
		if (highToNext <= -2 && lowToNext <= -2) {
			return false;
		}
		//check for similar motion to an octave
		if (nextInterval === 7 && highToNext >= 1 && lowToNext >= 1) {
			return false;
		}
		if (nextInterval === 7 && highToNext <= -1 && lowToNext <= -1) {
			return false;
		}
		//check for similar motion to an fifth
		if (nextInterval === 4 && highToNext >= 1 && lowToNext >= 1) {
			return false;
		}
		if (nextInterval === 4 && highToNext <= -1 && lowToNext <= -1) {
			return false;
		}
		return true;
	}

	function findHarmony(cantusFirmus, scale) {
		const possibleHarmonies = [];
		const flatFifthNote = scale.flatFifthNote;
		for (let i = 0; i < cantusFirmus.length; i++) {
			if (i === 0) {
				possibleHarmonies.push([cantusFirmus[i] + 7]);
			} else if (i === 1) { //can't have 2 octaves in a row
				const lowNote = cantusFirmus[i];
				possibleHarmonies.push([lowNote + 2, lowNote + 4, lowNote + 5, lowNote + 9]);
			} else if (i === 14) {
				possibleHarmonies.push([cantusFirmus[i] + 5]);
			} else if (i === 15) {
				possibleHarmonies.push([cantusFirmus[i] + 7]);
			} else {
				const lowNote = cantusFirmus[i];
				possibleHarmonies.push([lowNote + 2, lowNote + 4, lowNote + 5, lowNote + 7, lowNote + 9]);
			}
			if (flatFifthNote && Math.abs(cantusFirmus[i] % 7) === flatFifthNote) { //avoid flat fifths
				removeEntry(flatFifthNote + 4, possibleHarmonies[i]);
			}
		}

		//copy possible harmonies for later use
		const originalArray = [];
		for (let i = 0; i < cantusFirmus.length; i++) {
			originalArray.push(possibleHarmonies[i].slice(0));
		}

		const finalHarmony = [16];

		for (let i = 0; i < cantusFirmus.length; i++) {
			if (possibleHarmonies[i].length <= 0) {
				if (i === 0) {
					//there are no valid solutions
					return false;
				}
				//restore the current array
				possibleHarmonies[i] = originalArray[i].slice(0);
				i -= 2;//go back a note to try a different note
				continue;
			}
			//choose an option at random
			finalHarmony[i] = randEntry(possibleHarmonies[i]);
			//remove that option to mark it as tested
			removeEntry(finalHarmony[i], possibleHarmonies[i]);
			//check whether it's valid
			const validNote = validateNextNote(
				cantusFirmus[i - 3],
				cantusFirmus[i - 2],
				cantusFirmus[i - 1],
				cantusFirmus[i],
				finalHarmony[i - 3],
				finalHarmony[i - 2],
				finalHarmony[i - 1],
				finalHarmony[i]);
			if (!validNote) {
				i--;//try again on the next loop
			}
		}

		//finally raise the last high note by a half step if necessary
		if (scale.useLeadingTone) {
			finalHarmony[finalHarmony.length - 2] = 6.5;
		}

		return finalHarmony;
	}

	function melodyHasValidRange(array) {
		for (let i = 0; i < array.length; i++) {
			if (array[i] < -7 || array[i] > 14) {
				return false;
			}
		}
		return true;
	}

	function findValidRangeLowArray() {
		let lowArray = createCantusFirmus();
		while (!melodyHasValidRange(lowArray)) {
			lowArray = createCantusFirmus();
		}
		return lowArray;
	}

	function findLowAndHighArray(scale) {
		let lowArray = findValidRangeLowArray();
		let highArray = findHarmony(lowArray, scale);
		while (!highArray) {
			//in case we can't find a harmony, start over
			lowArray = findValidRangeLowArray();
			highArray = findHarmony(lowArray, scale);
		}
		return {lowArray: lowArray, highArray: highArray};
	}

	function findValidRangeLowAndHighArray(scale) {
		let lowAndHigh = findLowAndHighArray(scale);
		while (!melodyHasValidRange(lowAndHigh.highArray)) {
			lowAndHigh = findLowAndHighArray(scale);
		}
		return lowAndHigh;
	}

	function transposeHighAndLowUpOctave(highAndLow) {
		for (let i = 0; i < highAndLow.lowArray.length; i++) {
			highAndLow.lowArray[i] += 7;
		}
		for (let i = 0; i < highAndLow.highArray.length; i++) {
			highAndLow.highArray[i] += 7;
		}
		return highAndLow;
	}

	function generate() {
		const scale = scales.aeolian;
		return transposeHighAndLowUpOctave(findValidRangeLowAndHighArray(scale));
	}

	window.app.counterpoint = {
		generate: generate
	};
})();
