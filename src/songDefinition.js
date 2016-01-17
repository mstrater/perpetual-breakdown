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
				}
			},
			soundSelector: function(beatNumber) {
				if (beatNumber%32 < 16) {
					return 'crash';
				} else {
					return 'openHat';
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
				let downHits = ['downOne', 'downThree', 'four'];
				let upHits = ['upOne', 'upThree', 'upThreeDownThree', 'upThreeFour', 'upThreeUpOne'];
				let allHits = downHits.concat(upHits);
				let highs = ['highOne', 'highTwo'];

				if (beatNumber%8 === 0) {
					//always have a strong downbeat every 8
					return util.randArrayEntry(downHits);
				}

				if (beatNumber%32 < 16) {
					//no extras
					return util.randArrayEntry(allHits);
				} else {
					//allows extras
					function highSelector() {
						let rand = Math.random();
						if (rand < 0.4) {
							return util.randArrayEntry(highs);
						} else {
							return util.randArrayEntry(allHits);
						}
					}
					if (beatNumber%4 === 2) {
						let r = Math.random();
						if (r < 0.5) {
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
