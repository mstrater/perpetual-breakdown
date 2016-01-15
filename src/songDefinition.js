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
				}
			},
			soundSelector: function(beatNumber) {
				return 'crash';
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
				let rand = util.randInt(0, 10);
				switch (rand) {
					case 0:
						return 'downOne';
						break;
					case 1:
						return 'downThree';
						break;
					case 2:
						return 'four';
						break;
					case 3:
						if (beatNumber % 4 === 1) {
							return hitSelector(beatNumber);
						} else {
							return 'upOne';
						}
						break;
					case 4:
						if (beatNumber % 4 === 1) {
							return hitSelector(beatNumber);
						} else {
							return 'upThree';
						}
						break;
					case 5:
						if (beatNumber % 4 === 1) {
							return hitSelector(beatNumber);
						} else {
							return 'upThreeDownThree';
						}
						break;
					case 6:
						if (beatNumber % 4 === 1) {
							return hitSelector(beatNumber);
						} else {
							return 'upThreeFour';
						}
						break;
					case 7:
						if (beatNumber % 4 === 1) {
							return hitSelector(beatNumber);
						} else {
							return 'upThreeUpOne';
						}
						break;
					case 8:
						if (beatNumber % 4 === 1) {
							return hitSelector(beatNumber);
						} else {
							return 'highOne';
						}
						break;
					case 9:
						if (beatNumber % 4 === 1) {
							return hitSelector(beatNumber);
						} else {
							return 'highTwo';
						}
						break;
					case 10:
						if (beatNumber % 4 === 1) {
							return hitSelector(beatNumber);
						} else {
							return 'squeal';
						}
						break;
					default:
						console.log('Error: default case in soundSelector');
						return null;
				}
			}
		}
	};
})();
