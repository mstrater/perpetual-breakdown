(function() {
	'use strict';

	const util = window.app.util;

	const counterpoint = window.app.counterpoint.generate();
	window.app.ui.renderCounterpoint(counterpoint);
	const hitCounterpoint = window.app.counterpoint.createHitCounterpoint(counterpoint);

	// Holds the chance to move from one section to the next
	// For example sectionTransitionMatrix.crashBreakdown.openHatBreakdown represents the chance to move
	// from crashBreakdown to openHatBreakdown. Each section object should contain an entry for each section
	// and the total probability should equal 1.0
	const sectionTransitionMatrix = {
		crashBreakdown: {
			crashBreakdown: 0.05,
			openHatBreakdown: 0.5,
			tremeloCounterpointSection: 0.25,
			hitBridgeSection: 0.2
		},
		openHatBreakdown: {
			crashBreakdown: 0.15,
			openHatBreakdown: 0.05,
			tremeloCounterpointSection: 0.5,
			hitBridgeSection: 0.3
		},
		tremeloCounterpointSection: {
			crashBreakdown: 0.35,
			openHatBreakdown: 0.35,
			tremeloCounterpointSection: 0.1,
			hitBridgeSection: 0.2
		},
		hitBridgeSection: {
			crashBreakdown: 0.3,
			openHatBreakdown: 0.3,
			tremeloCounterpointSection: 0.3,
			hitBridgeSection: 0.1
		}
	};
	window.app.ui.renderStochasticMatrix(sectionTransitionMatrix);

	const checkSectionTransitionMatrix = function() {
		const keys1 = Object.keys(sectionTransitionMatrix);
		for (let i = 0; i < keys1.length; i++) {
			const section = sectionTransitionMatrix[keys1[i]];
			const keys2 = Object.keys(section);
			let totalProb = 0;
			for (let j = 0; j < keys2.length; j++) {
				totalProb += section[keys2[j]];
			}
			console.assert(Math.abs(totalProb - 1) < 0.000001, keys1[i] +
				' has probability totals not equal to 1.0!');
		}
	};
	// Verify the transition matrix on start
	checkSectionTransitionMatrix();

	const stochasticSectionSelector = function(currentSectionName) {
		const probabilities = sectionTransitionMatrix[currentSectionName];
		const random = Math.random();
		let probabilitySum = 0;
		const keys = Object.keys(probabilities);
		for (let i = 0; i < keys.length; i++) {
			const sectionName = keys[i];
			probabilitySum += probabilities[sectionName];
			if (random < probabilitySum) {
				return sectionName;
			}
		}
		console.error('Couldn\'t select a section properly!');
		return 'crashBreakdown';
	};

	const simulateSectionTransitions = function(numTransitions) {
		let result = 'crashBreakdown';
		let currentSection = 'crashBreakdown';
		for (let i = 0; i < numTransitions; i++) {
			currentSection = stochasticSectionSelector(currentSection);
			result += '\n' + currentSection;
		}
		console.log(result);
	};
	// Uncomment below to get a printout run of sections
	// simulateSectionTransitions(100);

	const makeRest = function(bars) {
		return {
			rest: true,
			bars: bars
		};
	};

	const songDef = {
		bpm: 180,
		// The rate at which the samples are played back (this changes pitch).
		playbackRate: 1.0,
		sounds: window.app.soundsDefinition.sounds,
		soundGroups: window.app.soundsDefinition.soundGroups,
		sections: {
			crashBreakdown: {
				bars: 32,
				tracks: {
					drums: function(barNumber) {
						if (barNumber === 28) {
							return util.randArrayEntry(songDef.soundGroups.fills);
						} else {
							// Crash section
							if (barNumber % 8 === 4 && Math.random() < 0.3) {
								return songDef.sounds.crashRide;
							} else {
								return songDef.sounds.crash;
							}
						}
					},
					guitar: function(barNumber) {
						// If we're at the last bar pick a one bar sample to make sure it fits
						let ret;
						if (barNumber === 31) {
							ret =  util.randArrayEntry(songDef.soundGroups.breakdownOneBar);
						} else if (barNumber % 8 === 0) {
							// Always have a strong downbeat every 8
							ret = util.randArrayEntry(songDef.soundGroups.breakdownDownbeats);
						} else {
							// No extras
							ret = util.randArrayEntry(songDef.soundGroups.breakdown);
						}
						window.app.ui.setBreakdownBarImg(ret);
						return ret;
					}
				}
			},
			openHatBreakdown: {
				bars: 32,
				tracks: {
					drums: function(barNumber) {
						// Open hat section
						if (barNumber === 0) {
							return songDef.sounds.crashOpenHat;
						} else if (barNumber === 28) {
							return util.randArrayEntry(songDef.soundGroups.fills);
						} else {
							return songDef.sounds.openHat;
						}
					},
					guitar: function(barNumber) {
						// If we're at the last bar pick a one bar sample to make sure it fits
						if (barNumber === 31) {
							return util.randArrayEntry(songDef.soundGroups.breakdownWithHighsOneBar);
						} else if (barNumber % 8 === 0) {
							// Always have a strong downbeat every 8
							return util.randArrayEntry(songDef.soundGroups.breakdownDownbeats);
						} else {
							// Allows extras
							if (barNumber % 4 === 2 && Math.random() < 0.25) {
								return songDef.sounds.squeal;
							} else if (Math.random() < 0.5) {
								return util.randArrayEntry(songDef.soundGroups.highs);
							} else {
								return util.randArrayEntry(songDef.soundGroups.breakdown);
							}
						}
					}
				}
			},
			tremeloCounterpointSection: {
				bars: 64,
				tracks: {
					leftGuitar: function(barNumber) {
						const note = counterpoint.lowArray[barNumber / 4];
						return songDef.sounds['tremeloL' + note];
					},
					rightGuitar: function(barNumber) {
						const note = counterpoint.highArray[barNumber / 4];
						if (note === 6.5) {
							return songDef.sounds.tremeloR6Plus;
						} else if (note === 13.5) {
							return songDef.sounds.tremeloR13Plus;
						} else if (note === 20.5) {
							return songDef.sounds.tremeloR20Plus;
						} else {
							return songDef.sounds['tremeloR' + note];
						}
					},
					startingCrash: function(barNumber) {
						if (barNumber % 16 === 0) {
							return songDef.sounds.drumSingleNoiseCrash;
						} else {
							return makeRest(4);
						}
					},
					drums: function(barNumber, lastSound) {
						if (barNumber % 32 === 0) {
							return util.randArrayEntry(songDef.soundGroups.counterpointDrums);
						} else if (barNumber % 32 === 28) {
							return util.randArrayEntry(songDef.soundGroups.counterpointFills);
						} else {
							return lastSound;
						}
					}
				}
			},
			hitBridgeSection: {
				bars: 16,
				tracks: {
					leftGuitar: function(barNumber) {
						const note = hitCounterpoint.lowArray[barNumber];
						return songDef.sounds['hitL' + note];
					},
					rightGuitar: function(barNumber) {
						const note = hitCounterpoint.highArray[barNumber];
						return songDef.sounds['hitR' + note];
					},
					drums: function() {
						return util.randArrayEntry(songDef.soundGroups.hitsDrums);
					}
				}
			}
		},
		selectSection: function(barNumber, lastSection) {
			if (!lastSection) {
				return songDef.sections.crashBreakdown;
			} else {
				return songDef.sections[stochasticSectionSelector(lastSection.name)];
			}
		}
	};

	// section post process: add section name to section object for use in the stochasticSectionSelector process.
	Object.keys(songDef.sections).forEach(function(sectionName) {
		songDef.sections[sectionName].name = sectionName;
	});

	window.app.songDefinition = songDef;
})();
