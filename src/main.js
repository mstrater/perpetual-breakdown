(function() {
	'use strict';

	const util = window.app.util;

	const AudioContext = window.AudioContext || window.webkitAudioContext;
	const audioContext = new AudioContext();

	const BPM = 180;
	const barLength = 60 / BPM;

	const initialLength = 1.0;

	let currentBeat = 0;
	let isPlaying = false;

	const songDefinition = window.app.songDefinition;
	const tracks = Object.keys(songDefinition);

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
		const worker = new Worker(util.makeWorkerSrc(workerSrc));

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
		.catch(util.simpleErr);
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
