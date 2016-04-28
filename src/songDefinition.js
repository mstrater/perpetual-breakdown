(function() {
	'use strict';

	const util = window.app.util;

	const audioPath = 'AudioFiles/';

	const defaultSoundVolume = 0.5;

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
				groups: ['fills']
			},
			fill4: {
				url: 'fill_4.wav',
				bars: 4,
				groups: ['fills']
			},
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
			}
		},
		sections: {
			cymbalAndHitsSection: {
				bars: 64,
				tracks: {
					drums: function(barNumber) {
						if (barNumber % 32 === 28) {
							return util.randArrayEntry(songDef.soundGroups.fills);
						} else if (barNumber % 64 < 32) {
							//crash section
							if (barNumber % 8 === 4 && Math.random() < 0.3) {
								return songDef.sounds.crashRide;
							} else {
								return songDef.sounds.crash;
							}
						} else {
							//open hat section
							if (barNumber % 32 === 0) {
								return songDef.sounds.crashOpenHat;
							} else {
								return songDef.sounds.openHat;
							}
						}
					},
					guitar: function(barNumber) {
						if (barNumber % 8 === 0) {
							//always have a strong downbeat every 8
							return util.randArrayEntry(songDef.soundGroups.downHits);
						}

						if (barNumber % 64 < 32) {
							//no extras
							return util.randArrayEntry(songDef.soundGroups.hits);
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
			testSection: {
				bars: 32,
				tracks: {
					wtf: function(barNumber) {
						const r = Math.random();
						if (r < 0.33) {
							return songDef.sounds.squeal;
						} else if (r < 0.66) {
							return songDef.sounds.highOne;
						} else {
							return songDef.sounds.highTwo;
						}
					}
				}
			}
		},
		selectSection: function(barNumber, lastSection) {
			if (!lastSection) {
				return songDef.sections.cymbalAndHitsSection;
			}
			if (Math.random() < 0.5) {
				return songDef.sections.cymbalAndHitsSection;
			} else {
				return songDef.sections.testSection;
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
