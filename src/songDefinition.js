//(function() {
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
			openHatBreakdown: 0.6,
			tremeloCounterpointSection: 0.35
		},
		openHatBreakdown: {
			crashBreakdown: 0.05,
			openHatBreakdown: 0.15,
			tremeloCounterpointSection: 0.8
		},
		tremeloCounterpointSection: {
			crashBreakdown: 0.45,
			openHatBreakdown: 0.45,
			tremeloCounterpointSection: 0.1
		}
	};

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
			// HITS
			downOne: {
				url: 'full_down_one.wav',
				bars: 1,
				groups: ['hits', 'downHits']
			},
			downThree: {
				url: 'full_down_three.wav',
				bars: 1,
				groups: ['hits', 'downHits']
			},
			four: {
				url: 'full_four.wav',
				bars: 1,
				groups: ['hits', 'downHits']
			},
			upOne: {
				url: 'full_up_one.wav',
				bars: 1,
				groups: ['hits', 'upHits']
			},
			upThree: {
				url: 'full_up_three.wav',
				bars: 2,
				groups: ['hits', 'upHits']
			},
			upThreeDownThree: {
				url: 'full_up_three_down_three.wav',
				bars: 2,
				groups: ['hits', 'upHits']
			},
			upThreeFour: {
				url: 'full_up_three_four.wav',
				bars: 2,
				groups: ['hits', 'upHits']
			},
			upThreeUpOne: {
				url: 'full_up_three_up_one.wav',
				bars: 2,
				groups: ['hits', 'upHits']
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
			TremeloL0: {
				url: 'TremeloL0.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			TremeloL1: {
				url: 'TremeloL1.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			TremeloL2: {
				url: 'TremeloL2.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			TremeloL3: {
				url: 'TremeloL3.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			TremeloL4: {
				url: 'TremeloL4.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			TremeloL5: {
				url: 'TremeloL5.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			TremeloL6: {
				url: 'TremeloL6.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			TremeloL7: {
				url: 'TremeloL7.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			TremeloL8: {
				url: 'TremeloL8.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			TremeloL9: {
				url: 'TremeloL9.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			TremeloL10: {
				url: 'TremeloL10.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			TremeloL11: {
				url: 'TremeloL11.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			TremeloL12: {
				url: 'TremeloL12.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			TremeloL13: {
				url: 'TremeloL13.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			TremeloL14: {
				url: 'TremeloL14.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			TremeloL15: {
				url: 'TremeloL15.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			TremeloL16: {
				url: 'TremeloL16.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			TremeloL17: {
				url: 'TremeloL17.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			TremeloL18: {
				url: 'TremeloL18.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			TremeloL19: {
				url: 'TremeloL19.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			TremeloL20: {
				url: 'TremeloL20.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			TremeloL21: {
				url: 'TremeloL21.wav',
				bars: 4,
				groups: ['tremeloLeft']
			},
			// TREMELO RIGHT
			TremeloR0: {
				url: 'TremeloR0.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			TremeloR1: {
				url: 'TremeloR1.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			TremeloR2: {
				url: 'TremeloR2.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			TremeloR3: {
				url: 'TremeloR3.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			TremeloR4: {
				url: 'TremeloR4.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			TremeloR5: {
				url: 'TremeloR5.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			TremeloR6: {
				url: 'TremeloR6.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			TremeloR6Plus: {
				url: 'TremeloR6+.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			TremeloR7: {
				url: 'TremeloR7.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			TremeloR8: {
				url: 'TremeloR8.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			TremeloR9: {
				url: 'TremeloR9.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			TremeloR10: {
				url: 'TremeloR10.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			TremeloR11: {
				url: 'TremeloR11.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			TremeloR12: {
				url: 'TremeloR12.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			TremeloR13: {
				url: 'TremeloR13.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			TremeloR13Plus: {
				url: 'TremeloR13+.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			TremeloR14: {
				url: 'TremeloR14.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			TremeloR15: {
				url: 'TremeloR15.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			TremeloR16: {
				url: 'TremeloR16.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			TremeloR17: {
				url: 'TremeloR17.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			TremeloR18: {
				url: 'TremeloR18.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			TremeloR19: {
				url: 'TremeloR19.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			TremeloR20: {
				url: 'TremeloR20.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			TremeloR20Plus: {
				url: 'TremeloR20+.wav',
				bars: 4,
				groups: ['tremeloRight']
			},
			TremeloR21: {
				url: 'TremeloR21.wav',
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
							return util.randArrayEntry(songDef.soundGroups.downHits);
						}
						//no extras
						return util.randArrayEntry(songDef.soundGroups.hits);
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
							return util.randArrayEntry(songDef.soundGroups.downHits);
						} else {
							//allows extras
							if (barNumber % 4 === 2 && Math.random() < 0.3) {
								return songDef.sounds.squeal;
							} else if (Math.random() < 0.5) {
								return util.randArrayEntry(songDef.soundGroups.highs);
							} else {
								return util.randArrayEntry(songDef.soundGroups.hits);
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
						return songDef.sounds['TremeloL' + note]; //TODO null check
					},
					rightGuitar: function(barNumber) {
						var note = counterpoint.highArray[barNumber / 4];
						if (note === 6.5) {
							return songDef.sounds.TremeloR6Plus;
						} else if (note === 13.5) {
							return songDef.sounds.TremeloR13Plus;
						} else if (note === 20.5) {
							return songDef.sounds.TremeloR20Plus;
						} else {
							return songDef.sounds['TremeloR' + note]; //TODO null check
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
//})();
