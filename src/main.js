(function() {
	'use strict';

	const AudioContext = window.AudioContext || window.webkitAudioContext;
	const audioContext = new AudioContext();

	const BPM = 180;
	const barLength = 60 / BPM;

	const initialLength = 1.0;
	const audioPath = 'AudioFiles/';

	let currentBeat = 0;
	let isPlaying = false;

	const randInt = function(low, high) {
		return Math.floor(Math.random() * (high - low + 1)) + low;
	};

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
				let rand = randInt(0, 10);
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
	const tracks = Object.keys(songDefinition);

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
			const xhr = new XMLHttpRequest();

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
			sound: sound,
			when: when
		});
	};

	// This technique is based off of this:
	// http://www.html5rocks.com/en/tutorials/audio/scheduling/
	const scheduler = function(e) {
		if (!isPlaying) {
			return;
		}
		currentBeat = Math.floor(audioContext.currentTime / barLength);
		const scheduleAheadTime = 0.1;

		let queuedSoundObj = toPlayQueue[0];
		while (queuedSoundObj && queuedSoundObj.when < audioContext.currentTime + scheduleAheadTime) {
			// remove the sound Obj from the queue.
			toPlayQueue.shift();

			const nextSound = queuedSoundObj.sound;

			const buffer = audioContext.createBufferSource();
			// connect the sound to the gain node (which connects to the destination).
			buffer.connect(nextSound.gainNode);

			buffer.buffer = nextSound.audio;
			buffer.start(queuedSoundObj.when);

			queuedSoundObj = toPlayQueue[0];
		}

		tracks.forEach(function(trackName) {
			const track = songDefinition[trackName];
			if (audioContext.currentTime > track.nextSoundPlaysAt - scheduleAheadTime) {
				// If we are in here, it means the track's last queued sound has been scheduled
				// and we are ready to queue another one.
				const nextSound = track.sounds[track.soundSelector(currentBeat)];
				play(nextSound, track.nextSoundPlaysAt);
				track.nextSoundPlaysAt += barLength * nextSound.bars;
			}
		});
	};

	const fixNextSoundPlaysAt = function() {
		// nextSoundPlaysAt must always be at or ahead of the currentTime
		// otherwise you get an explosion of sounds.
		tracks.forEach(function(trackName) {
			const track = songDefinition[trackName];
			if (track.nextSoundPlaysAt < audioContext.currentTime) {
				track.nextSoundPlaysAt = audioContext.currentTime + barLength;
			}
		});
	};

	let schedulerStarted = false;
	const startScheduler = function() {
		const tickRate = 25;
		const workerSrc = `
			const interval = ${tickRate};

			const tick = function() {
				postMessage('tick');
			};

			setInterval(tick, interval);
		`;

		/*
		We use a webworker to truly schedule in a different thread.
		This keeps the audio playing correctly even when you are not
		viewing the same tab (Chrome lowers the priority of the tab).
		This is why we don't use setInterval.
		*/
		const worker = new Worker(makeWorkerSrc(workerSrc));

		worker.addEventListener('message', scheduler);

		schedulerStarted = true;
	};

	const playPauseBtn = document.querySelector('#playPause');
	playPauseBtn.innerText = 'Loading...';
	playPauseBtn.disabled = true;

	const loadAllSounds = function() {
		let allSounds = [];
		tracks.forEach(function(trackName) {
			let track = songDefinition[trackName];
			track.nextSoundPlaysAt = initialLength;
			Object.keys(track.sounds).forEach(function(soundName) {
				let sound = track.sounds[soundName];
				// set up gain nodes per sound so that sounds in the same track can
				// play at different volumes and overlap.
				sound.gainNode = audioContext.createGain();
				sound.gainNode.gain.value = sound.volume;
				// connect the gain nodes to the destination.
				sound.gainNode.connect(audioContext.destination);
				allSounds.push(sound);
			});
		});
		Promise.all(allSounds.map(loadSound))
		.then(function() {
			playPauseBtn.disabled = false;
			playPauseBtn.innerText = 'Play';
		})
		.catch(simpleErr);
	};

	loadAllSounds();

	playPauseBtn.addEventListener('click', function() {
		isPlaying = !isPlaying;
		if (isPlaying) {
			fixNextSoundPlaysAt();
			playPauseBtn.innerText = 'Pause';
		} else {
			playPauseBtn.innerText = 'Play';
		}
		if (!schedulerStarted) {
			startScheduler();
		}
	});

})();
