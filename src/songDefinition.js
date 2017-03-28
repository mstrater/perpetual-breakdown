(function() {
	'use strict';

	const util = window.app.util;

	const audioPath = 'AudioFiles/';

	const defaultSoundVolume = 0.5;

	const counterpoint = window.app.counterpoint.generate();

	// Holds the chance to move from one section to the next
	// For example sectionTransitionMatrix.crashBreakdown.openHatBreakdown represents the chance to move from crashBreakdown to openHatBreakdown
	// Each section object should contain an entry for each section and the total probability should equal 1.0
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
			tremeloCounterpointSection: 0.6,
			hitBridgeSection: 0.2
		},
		tremeloCounterpointSection: {
			crashBreakdown: 0.40,
			openHatBreakdown: 0.40,
			tremeloCounterpointSection: 0.1,
			hitBridgeSection: 0.1
		},
		hitBridgeSection: {
			crashBreakdown: 0.3,
			openHatBreakdown: 0.3,
			tremeloCounterpointSection: 0.3,
			hitBridgeSection: 0.1
		}
	};

	const checkSectionTransitionMatrix = function() {
		const keys1 = Object.keys(sectionTransitionMatrix);
		for (let i=0; i<keys1.length; i++) {
			const section = sectionTransitionMatrix[keys1[i]];
			const keys2 = Object.keys(section);
			let totalProb = 0;
			for (let j=0; j<keys2.length; j++) {
				totalProb += section[keys2[j]];
			}
			console.assert(Math.abs(totalProb - 1) < 0.000001, keys1[i] + " has probability totals not equal to 1.0!")
		}
	}
	// Verify the transition matrix on start
	checkSectionTransitionMatrix();

	const stochasticSectionSelector = function(sectionName) {
		const probabilities = sectionTransitionMatrix[sectionName];
		const random = Math.random();
		let probabilitySum = 0;
		const keys = Object.keys(probabilities);
		for (let i=0; i<keys.length; i++) {
			probabilitySum += probabilities[keys[i]];
			if (random < probabilitySum) {
				return keys[i];
			}
		}
		console.assert(false, "Couldn't select a section properly!");
		return "crashBreakdown";
	};

	const simulateSectionTransitions = function(numTransitions) {
		let result = "crashBreakdown";
		let currentSection = "crashBreakdown";
		for (let i=0; i<numTransitions; i++) {
			currentSection = stochasticSectionSelector(currentSection);
			result += "\n" + currentSection;
		}
		console.log(result);
	}
	// Uncomment below to get a printout run of sections
	//simulateSectionTransitions(100);

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
		sounds: {
			crash: {
				url: 'crash.wav',
				bars: 4
			},
			openHat: {
				url: 'open_hat.wav',
				bars: 4
			},
			crashOpenHat: {
				url: 'crash_open_hat.wav',
				bars: 4
			},
			crashRide: {
				url: 'crash_ride.wav',
				bars: 4
			},
			// FILLS
			fill1: {
				url: 'fill_1.wav',
				bars: 4,
				groups: ['fills']
			},
			fill2: {
				url: 'fill_2.wav',
				bars: 4,
				groups: ['fills']
			},
			fill3: {
				url: 'fill_3.wav',
				bars: 4,
				groups: ['fills', 'counterpointFills']
			},
			fill4: {
				url: 'fill_4.wav',
				bars: 4,
				groups: ['fills', 'counterpointFills']
			},
			fill5: {
				url: 'fill_5.wav',
				bars: 4,
				groups: ['fills', 'counterpointFills']
			},
			// BREAKDOWN
			downOne: {
				url: 'full_down_one.wav',
				bars: 1,
				groups: ['breakdown', 'breakdownDownbeats']
			},
			downThree: {
				url: 'full_down_three.wav',
				bars: 1,
				groups: ['breakdown', 'breakdownDownbeats']
			},
			four: {
				url: 'full_four.wav',
				bars: 1,
				groups: ['breakdown', 'breakdownDownbeats']
			},
			upOne: {
				url: 'full_up_one.wav',
				bars: 1,
				groups: ['breakdown', 'breakdownUpbeats']
			},
			upThree: {
				url: 'full_up_three.wav',
				bars: 2,
				groups: ['breakdown', 'breakdownUpbeats']
			},
			upThreeDownThree: {
				url: 'full_up_three_down_three.wav',
				bars: 2,
				groups: ['breakdown', 'breakdownUpbeats']
			},
			upThreeFour: {
				url: 'full_up_three_four.wav',
				bars: 2,
				groups: ['breakdown', 'breakdownUpbeats']
			},
			upThreeUpOne: {
				url: 'full_up_three_up_one.wav',
				bars: 2,
				groups: ['breakdown', 'breakdownUpbeats']
			},
			// HIGHS
			highOneUpOne: {
				url: 'full_high_one_up_one.wav',
				bars: 1,
				groups: ['highs']
			},
			highTwoUpOne: {
				url: 'full_high_two_up_one.wav',
				bars: 1,
				groups: ['highs']
			},
			highOneUpThree: {
				url: 'full_high_one_up_three.wav',
				bars: 2,
				groups: ['highs']
			},
			highTwoUpThree: {
				url: 'full_high_two_up_three.wav',
				bars: 2,
				groups: ['highs']
			},
			highOneUpThreeDownThree: {
				url: 'full_high_one_up_three_down_three.wav',
				bars: 2,
				groups: ['highs']
			},
			highTwoUpThreeDownThree: {
				url: 'full_high_two_up_three_down_three.wav',
				bars: 2,
				groups: ['highs']
			},
			highOneUpThreeFour: {
				url: 'full_high_one_up_three_four.wav',
				bars: 2,
				groups: ['highs']
			},
			highTwoUpThreeFour: {
				url: 'full_high_two_up_three_four.wav',
				bars: 2,
				groups: ['highs']
			},
			highOneUpThreeUpOne: {
				url: 'full_high_one_up_three_up_one.wav',
				bars: 2,
				groups: ['highs']
			},
			highTwoUpThreeUpOne: {
				url: 'full_high_two_up_three_up_one.wav',
				bars: 2,
				groups: ['highs']
			},
			highOne: {
				url: 'full_guitar_high_one.wav',
				bars: 1,
				groups: ['highs']
			},
			highTwo: {
				url: 'full_guitar_high_two.wav',
				bars: 1,
				groups: ['highs']
			},
			squeal: {
				url: 'full_guitar_squeal.wav',
				bars: 2
			},
			// TREMELO LEFT
			tremeloL0: {
				url: 'tremeloL0.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL1: {
				url: 'tremeloL1.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL2: {
				url: 'tremeloL2.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL3: {
				url: 'tremeloL3.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL4: {
				url: 'tremeloL4.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL5: {
				url: 'tremeloL5.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL6: {
				url: 'tremeloL6.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL7: {
				url: 'tremeloL7.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL8: {
				url: 'tremeloL8.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL9: {
				url: 'tremeloL9.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL10: {
				url: 'tremeloL10.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL11: {
				url: 'tremeloL11.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL12: {
				url: 'tremeloL12.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL13: {
				url: 'tremeloL13.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL14: {
				url: 'tremeloL14.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL15: {
				url: 'tremeloL15.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL16: {
				url: 'tremeloL16.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL17: {
				url: 'tremeloL17.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL18: {
				url: 'tremeloL18.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL19: {
				url: 'tremeloL19.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL20: {
				url: 'tremeloL20.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			tremeloL21: {
				url: 'tremeloL21.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			// TREMELO RIGHT
			tremeloR0: {
				url: 'tremeloR0.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR1: {
				url: 'tremeloR1.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR2: {
				url: 'tremeloR2.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR3: {
				url: 'tremeloR3.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR4: {
				url: 'tremeloR4.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR5: {
				url: 'tremeloR5.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR6: {
				url: 'tremeloR6.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR6Plus: {
				url: 'tremeloR6+.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR7: {
				url: 'tremeloR7.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR8: {
				url: 'tremeloR8.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR9: {
				url: 'tremeloR9.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR10: {
				url: 'tremeloR10.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR11: {
				url: 'tremeloR11.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR12: {
				url: 'tremeloR12.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR13: {
				url: 'tremeloR13.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR13Plus: {
				url: 'tremeloR13+.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR14: {
				url: 'tremeloR14.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR15: {
				url: 'tremeloR15.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR16: {
				url: 'tremeloR16.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR17: {
				url: 'tremeloR17.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR18: {
				url: 'tremeloR18.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR19: {
				url: 'tremeloR19.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR20: {
				url: 'tremeloR20.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR20Plus: {
				url: 'tremeloR20+.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			tremeloR21: {
				url: 'tremeloR21.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			// COUNTERPOINT DRUMS
			drumCounterpoint1: {
				url: 'drum_counterpoint_1.wav',
				bars: 4,
				volume: defaultSoundVolume - 0.1,
				groups: ['counterpointDrums']
			},
			drumCounterpoint2: {
				url: 'drum_counterpoint_2.wav',
				bars: 4,
				volume: defaultSoundVolume - 0.1,
				groups: ['counterpointDrums']
			},
			drumCounterpoint3: {
				url: 'drum_counterpoint_3.wav',
				bars: 4,
				volume: defaultSoundVolume - 0.1,
				groups: ['counterpointDrums']
			},
			drumCounterpoint4: {
				url: 'drum_counterpoint_4.wav',
				bars: 4,
				groups: ['counterpointDrums']
			},
			drumSingleNoiseCrash: {
				url: 'drum_single_noise_crash.wav',
				bars: 4
			},
			// HITS LEFT
			hitL0: {
				url: 'hitL0.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL1: {
				url: 'hitL1.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL2: {
				url: 'hitL2.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL3: {
				url: 'hitL3.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL4: {
				url: 'hitL4.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL5: {
				url: 'hitL5.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL6: {
				url: 'hitL6.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL7: {
				url: 'hitL7.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL8: {
				url: 'hitL8.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL9: {
				url: 'hitL9.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL10: {
				url: 'hitL10.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL11: {
				url: 'hitL11.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL12: {
				url: 'hitL12.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL13: {
				url: 'hitL13.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL14: {
				url: 'hitL14.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL15: {
				url: 'hitL15.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL16: {
				url: 'hitL16.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL17: {
				url: 'hitL17.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL18: {
				url: 'hitL18.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL19: {
				url: 'hitL19.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL20: {
				url: 'hitL20.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL21: {
				url: 'hitL21.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL22: {
				url: 'hitL22.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL23: {
				url: 'hitL23.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL24: {
				url: 'hitL24.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL25: {
				url: 'hitL25.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL26: {
				url: 'hitL26.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL27: {
				url: 'hitL27.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL28: {
				url: 'hitL28.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL29: {
				url: 'hitL29.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL30: {
				url: 'hitL30.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL31: {
				url: 'hitL31.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL32: {
				url: 'hitL32.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL33: {
				url: 'hitL33.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL34: {
				url: 'hitL34.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL35: {
				url: 'hitL35.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			hitL36: {
				url: 'hitL36.wav',
				bars: 1,
				groups: ['hitsLeft']
			},
			// HITS RIGHT
			hitR0: {
				url: 'hitR0.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR1: {
				url: 'hitR1.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR2: {
				url: 'hitR2.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR3: {
				url: 'hitR3.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR4: {
				url: 'hitR4.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR5: {
				url: 'hitR5.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR6: {
				url: 'hitR6.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR7: {
				url: 'hitR7.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR8: {
				url: 'hitR8.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR9: {
				url: 'hitR9.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR10: {
				url: 'hitR10.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR11: {
				url: 'hitR11.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR12: {
				url: 'hitR12.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR13: {
				url: 'hitR13.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR14: {
				url: 'hitR14.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR15: {
				url: 'hitR15.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR16: {
				url: 'hitR16.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR17: {
				url: 'hitR17.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR18: {
				url: 'hitR18.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR19: {
				url: 'hitR19.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR20: {
				url: 'hitR20.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR21: {
				url: 'hitR21.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR22: {
				url: 'hitR22.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR23: {
				url: 'hitR23.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR24: {
				url: 'hitR24.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR25: {
				url: 'hitR25.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR26: {
				url: 'hitR26.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR27: {
				url: 'hitR27.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR28: {
				url: 'hitR28.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR29: {
				url: 'hitR29.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR30: {
				url: 'hitR30.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR31: {
				url: 'hitR31.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR32: {
				url: 'hitR32.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR33: {
				url: 'hitR33.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR34: {
				url: 'hitR34.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR35: {
				url: 'hitR35.wav',
				bars: 1,
				groups: ['hitsRight']
			},
			hitR36: {
				url: 'hitR36.wav',
				bars: 1,
				groups: ['hitsRight']
			}
		},
		sections: {
			crashBreakdown: {
				// Keep the name for use in the stochasticSectionSelector process
				name: 'crashBreakdown',
				bars: 32,
				tracks: {
					drums: function(barNumber) {
						if (barNumber === 28) {
							return util.randArrayEntry(songDef.soundGroups.fills);
						} else {
							//crash section
							if (barNumber % 8 === 4 && Math.random() < 0.3) {
								return songDef.sounds.crashRide;
							} else {
								return songDef.sounds.crash;
							}
						}
					},
					guitar: function(barNumber) {
						//TODO make sure the last sample fits in the remaining time
						if (barNumber % 8 === 0) {
							//always have a strong downbeat every 8
							return util.randArrayEntry(songDef.soundGroups.breakdownDownbeats);
						}
						//no extras
						return util.randArrayEntry(songDef.soundGroups.breakdown);
					}
				}
			},
			openHatBreakdown: {
				// Keep the name for use in the stochasticSectionSelector process
				name: 'openHatBreakdown',
				bars: 32,
				tracks: {
					drums: function(barNumber) {
						//open hat section
						if (barNumber === 0) {
							return songDef.sounds.crashOpenHat;
						} else if (barNumber === 28) {
							return util.randArrayEntry(songDef.soundGroups.fills);
						} else {
							return songDef.sounds.openHat;
						}
					},
					guitar: function(barNumber) {
						//TODO make sure the last sample fits in the remaining time
						if (barNumber % 8 === 0) {
							//always have a strong downbeat every 8
							return util.randArrayEntry(songDef.soundGroups.breakdownDownbeats);
						} else {
							//allows extras
							if (barNumber % 4 === 2 && Math.random() < 0.3) {
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
				// Keep the name for use in the stochasticSectionSelector process
				name: 'tremeloCounterpointSection',
				bars: 64,
				tracks: {
					leftGuitar: function(barNumber) {
						var note = counterpoint.lowArray[barNumber / 4];
						return songDef.sounds['tremeloL' + note]; //TODO null check
					},
					rightGuitar: function(barNumber) {
						var note = counterpoint.highArray[barNumber / 4];
						if (note === 6.5) {
							return songDef.sounds.tremeloR6Plus;
						} else if (note === 13.5) {
							return songDef.sounds.tremeloR13Plus;
						} else if (note === 20.5) {
							return songDef.sounds.tremeloR20Plus;
						} else {
							return songDef.sounds['tremeloR' + note]; //TODO null check
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
						} else if (barNumber % 32 === 28){
							return util.randArrayEntry(songDef.soundGroups.counterpointFills);
						} else {
							return lastSound;
						}
					}
				}
			},
			hitBridgeSection: {
				// Keep the name for use in the stochasticSectionSelector process
				name: 'hitBridgeSection',
				bars: 16,
				tracks: {
					leftGuitar: function(barNumber) {
						var note = counterpoint.lowArray[barNumber];
						return songDef.sounds['hitL' + note]; //TODO null check
					},
					rightGuitar: function(barNumber) {
						// Need to floor the value to deal with values 6.5, 13.5, 20.5
						var note = Math.floor(counterpoint.highArray[barNumber]);
						return songDef.sounds['hitR' + note]; //TODO null check
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

	// sounds post process: build sound groups, fix audio paths, add volumes if needed.
	songDef.soundGroups = {};
	Object.keys(songDef.sounds).forEach(function(soundName) {
		const sound = songDef.sounds[soundName];
		const groups = sound.groups || [];
		sound.volume = sound.volume === undefined ? defaultSoundVolume : sound.volume;
		sound.url = audioPath + sound.url;
		groups.forEach(function(groupName) {
			let group = songDef.soundGroups[groupName];
			if (!group) {
				group = [];
				songDef.soundGroups[groupName] = group;
			}
			group.push(sound);
		});
	});

	window.app.songDefinition = songDef;
})();
