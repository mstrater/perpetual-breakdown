(function() {
	'use strict';

	const util = window.app.util;

	const audioPath = 'AudioFiles/';

	window.app.songDefinition = {
		cymbalSnare: {
			sounds: {
				crash: {
					url: audioPath + 'crash.wav',
					bars: 4,
					volume: 0.5
				},
				openHat: {
					url: audioPath + 'open_hat.wav',
					bars: 4,
					volume: 0.5
				},
				crashOpenHat: {
					url: audioPath + 'crash_open_hat.wav',
					bars: 4,
					volume: 0.5
				},
				crashRide: {
					url: audioPath + 'crash_ride.wav',
					bars: 4,
					volume: 0.5
				},
				fill1: {
					url: audioPath + 'fill_1.wav',
					bars: 4,
					volume: 0.5
				},
				fill2: {
					url: audioPath + 'fill_2.wav',
					bars: 4,
					volume: 0.5
				},
				fill3: {
					url: audioPath + 'fill_3.wav',
					bars: 4,
					volume: 0.5
				},
				fill4: {
					url: audioPath + 'fill_4.wav',
					bars: 4,
					volume: 0.5
				}
			},
			soundSelector: function(beatNumber) {
				const fills = ['fill1', 'fill2', 'fill3', 'fill4'];
				if (beatNumber % 32 === 28) {
					return util.randArrayEntry(fills);
				} else if (beatNumber % 64 < 32) {
					//crash section
					if (beatNumber % 8 === 4) {
						const r = Math.random();
						if (r < 0.3) {
							return 'crashRide';
						} else {
							return 'crash';
						}
					} else {
						return 'crash';
					}
				} else {
					//open hat section
					if (beatNumber % 32 === 0) {
						return 'crashOpenHat';
					} else {
						return 'openHat';
					}
				}
			}
		},
		hits: {
			sounds: {
				downOne: {
					url: audioPath + 'full_down_one.wav',
					bars: 1,
					volume: 0.5
				},
				downThree: {
					url: audioPath + 'full_down_three.wav',
					bars: 1,
					volume: 0.5
				},
				four: {
					url: audioPath + 'full_four.wav',
					bars: 1,
					volume: 0.5
				},
				upOne: {
					url: audioPath + 'full_up_one.wav',
					bars: 1,
					volume: 0.5
				},
				upThree: {
					url: audioPath + 'full_up_three.wav',
					bars: 2,
					volume: 0.5
				},
				upThreeDownThree: {
					url: audioPath + 'full_up_three_down_three.wav',
					bars: 2,
					volume: 0.5
				},
				upThreeFour: {
					url: audioPath + 'full_up_three_four.wav',
					bars: 2,
					volume: 0.5
				},
				upThreeUpOne: {
					url: audioPath + 'full_up_three_up_one.wav',
					bars: 2,
					volume: 0.5
				},
				highOne: {
					url: audioPath + 'full_guitar_high_one.wav',
					bars: 1,
					volume: 0.5
				},
				highTwo: {
					url: audioPath + 'full_guitar_high_two.wav',
					bars: 1,
					volume: 0.5
				},
				squeal: {
					url: audioPath + 'full_guitar_squeal.wav',
					bars: 2,
					volume: 0.5
				}
			},
			soundSelector: function hitSelector(beatNumber) {
				const downHits = ['downOne', 'downThree', 'four'];
				const upHits = ['upOne', 'upThree', 'upThreeDownThree', 'upThreeFour', 'upThreeUpOne'];
				const allHits = downHits.concat(upHits);
				const highs = ['highOne', 'highTwo'];

				function highSelector() {
					const rand = Math.random();
					if (rand < 0.4) {
						return util.randArrayEntry(highs);
					} else {
						return util.randArrayEntry(allHits);
					}
				}

				if (beatNumber % 8 === 0) {
					//always have a strong downbeat every 8
					return util.randArrayEntry(downHits);
				}

				if (beatNumber % 64 < 32) {
					//no extras
					return util.randArrayEntry(allHits);
				} else {
					//allows extras
					if (beatNumber % 4 === 2) {
						const r = Math.random();
						if (r < 0.4) {
							return 'squeal';
						} else {
							return highSelector();
						}
					} else {
						return highSelector();
					}
				}
			}
		}
	};
})();
