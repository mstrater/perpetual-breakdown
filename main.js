(function() {
	'use strict';

	const randInt = function(low, high) {
		return Math.floor(Math.random() * (high - low + 1)) + low;
	};
	const initialLength = 1.0;
	const audioPath = "AudioFiles/"
	const songDefinition = {
		cymbalSnare: {
			sounds: {
				crash: {
					url: audioPath + 'crash.wav',
					bars: 4,
					volume: 0.5
				}
			},
			soundSelector: function(beatNumber) {
				return "crash";
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
				let rand = randInt(0, 10);
				switch (rand) {
					case 0:
						return "downOne";
						break;
					case 1:
						return "downThree";
						break;
					case 2:
						return "four";
						break;
					case 3:
						if (beatNumber%4 === 1) {
							return hitSelector(beatNumber);
						} else {
							return "upOne";
						}
						break;
					case 4:
						if (beatNumber%4 === 1) {
							return hitSelector(beatNumber);
						} else {
							return "upThree";
						}
						break;
					case 5:
						if (beatNumber%4 === 1) {
							return hitSelector(beatNumber);
						} else {
							return "upThreeDownThree";
						}
						break;
					case 6:
						if (beatNumber%4 === 1) {
							return hitSelector(beatNumber);
						} else {
							return "upThreeFour";
						}
						break;
					case 7:
						if (beatNumber%4 === 1) {
							return hitSelector(beatNumber);
						} else {
							return "upThreeUpOne";
						}
						break;
					case 8:
						if (beatNumber%4 === 1) {
							return hitSelector(beatNumber);
						} else {
							return "highOne";
						}
						break;
					case 9:
						if (beatNumber%4 === 1) {
							return hitSelector(beatNumber);
						} else {
							return "highTwo";
						}
						break;
					case 10:
						if (beatNumber%4 === 1) {
							return hitSelector(beatNumber);
						} else {
							return "squeal";
						}
						break;
					default:
						console.log("Error: default case in soundSelector")
						return null;
				}
			}
		}
	};

	const AudioContext = window.AudioContext || window.webkitAudioContext;
	const audioContext = new AudioContext();

	const BPM = 180;
	const barLength = 60 / BPM;

	// This var is helpful for scheduling.
	let songLength = initialLength;
	let currentBeat = 0;
	let soundDictionary = {};
	let isPlaying = true;

	const simpleErr = function(e) {
		if (e.stack) {
			console.log('=== stack ===');
			console.log(e.stack);
		}
		console.log(e);
	};

	const makeWorkerSrc = function(src) {
		src = '(function() {"use strict";' + src + '})()';
		const blob = new Blob([src], {type: 'text/javascript'});
		return window.URL.createObjectURL(blob);
	};

	const loadSound = function(soundObj) {
		return new Promise(function(res, rej) {
			var xhr = new XMLHttpRequest();

			xhr.open('GET', soundObj.url);
			xhr.responseType = 'arraybuffer';

			xhr.onload = function() {
				audioContext.decodeAudioData(xhr.response, function(audio) {
					soundObj.audio = audio;
					res();
				});
			};

			xhr.send();
		});
	};

	const toPlayQueue = [];

	const play = function(sound, when) {
		toPlayQueue.push({
			audio: sound.audio,
			when: when,
			gainNode: sound.gainNode
		});
	};

	const scheduler = function(e) {
		if (!isPlaying) {
			return;
		}
		currentBeat++;
		const scheduleAheadTime = 0.5;

		let nextSound = toPlayQueue[0];
		while (nextSound && nextSound.when < audioContext.currentTime + scheduleAheadTime) {
			toPlayQueue.shift();

			const buffer = audioContext.createBufferSource();
			buffer.connect(nextSound.gainNode);
			nextSound.gainNode.connect(audioContext.destination);

			buffer.buffer = nextSound.audio;
			buffer.start(nextSound.when);

			nextSound = toPlayQueue[0];
		}

		//fix for pausing causing a backup of sounds to play
		if (songLength < audioContext.currentTime) {
			songLength = audioContext.currentTime + barLength;
		}

		Object.keys(songDefinition).forEach(function(trackName){
			var track = songDefinition[trackName];
			if (track.trackLength <= songLength) {
				nextSound = soundDictionary[track.soundSelector(currentBeat)];
				play(nextSound, track.trackLength);
				track.trackLength += barLength * nextSound.bars;
			}
		});
		songLength += barLength;
	};

	const start = function() {
		const tickRate = 25;
		const workerSrc = `
			const interval = ${tickRate};

			const tick = function() {
				postMessage('tick');
			};

			setInterval(tick, interval);
		`;

		const worker = new Worker(makeWorkerSrc(workerSrc));

		worker.addEventListener('message', scheduler);
		//setInterval(scheduler, tickRate);
	};

	const loadAllSounds = function() {
		let allSounds = [];
		Object.keys(songDefinition).forEach(function(trackName) {
			let track = songDefinition[trackName];
			track.trackLength = initialLength;
			Object.keys(track.sounds).forEach(function(soundName) {
				let sound = track.sounds[soundName];
				sound.gainNode = audioContext.createGain();
				sound.gainNode.gain.value = sound.volume;
				allSounds.push(sound)
				soundDictionary[soundName] = sound;
			});
		});
		Promise.all(allSounds.map(loadSound)).then(start).catch(simpleErr);
	};

	loadAllSounds();

	document.querySelector('#playPause').addEventListener('click', function() {
		isPlaying = !isPlaying;
	});

})();
