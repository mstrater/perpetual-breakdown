(function() {
	'use strict';

	const util = window.app.util;

	const AudioContext = window.AudioContext || window.webkitAudioContext;
	const audioContext = new AudioContext();

	const BPM = 180;
	const barLength = 60 / BPM;

	// The rate at which the samples are played back (this changes pitch).
	const playbackRate = 1.0;

	// Number of seconds to wait before song starts playing after user clicks play.
	// This should be no less than 0.1. Things start weirdly otherwise (not sure why).
	const startPadding = 0.1;

	let isPlaying = false;
	let lastPausedAt = 0;
	let totalTimePaused = 0;

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

	// This technique is inspired by this:
	// http://www.html5rocks.com/en/tutorials/audio/scheduling/
	const scheduler = function(e) {
		if (!isPlaying) {
			return;
		}
		// max number of seconds a sound can be scheduled before it plays.
		// This keeps things playing at the right time even with laggy js.
		const scheduleAheadTime = 0.2;

		/*
		How this works:
		First we have our "song time" which is the number of seconds the user has been hearing sound.
		This does not include the time when the audio is paused or the time before the user clicks play.
		Then there is the "audioContext time" which is the number of seconds since the audioContext was
		made (when the page loads).
		To convert a audio context time to a song time, you just subtract the seconds paused. Do the
		inverse for song time to audio context time.
		*/

		// convert audioContext time to song time.
		const songTime = audioContext.currentTime - totalTimePaused;

		tracks.forEach(function(trackName) {
			const track = songDefinition[trackName];
			// nextSoundPlaysAt is a "song time" variable.
			const nextSoundPlaysAt = track.currentBarNumber * barLength + startPadding;
			if (songTime > nextSoundPlaysAt - scheduleAheadTime) {
				// we are close enough to the next sound playing, so schedule it.
				const nextSound = track.sounds[track.soundSelector(track.currentBarNumber)];

				const buffer = audioContext.createBufferSource();
				// connect the sound to the gain node (which connects to the destination).
				buffer.connect(nextSound.gainNode);
				// Make the buffer point at the AudioBuffer.
				buffer.buffer = nextSound.audio;

				// this is a fun variable.
				buffer.playbackRate.value = playbackRate;

				// convert nextSoundPlaysAt to a "audioContext time" and perform the schedule.
				buffer.start(nextSoundPlaysAt + totalTimePaused);

				track.currentBarNumber += nextSound.bars;
			}
		});
	};

	let schedulerStarted = false;
	const startScheduler = function() {
		const workerFunc = function() {
			const tickRate = 25;

			const tick = function() {
				postMessage('tick');
			};

			setInterval(tick, tickRate);
		};

		/*
		We use a webworker to truly schedule in a different thread.
		This keeps the audio playing correctly even when you are not
		viewing the same tab (Chrome lowers the priority of the tab).
		This is why we don't use setInterval.
		*/
		const worker = new Worker(util.makeWorkerSrcFromFunc(workerFunc));

		worker.addEventListener('message', scheduler);

		schedulerStarted = true;
	};

	const playPauseBtn = document.querySelector('#playPause');
	playPauseBtn.textContent = 'Loading...';
	playPauseBtn.disabled = true;

	const loadAllSounds = function() {
		let allSounds = [];
		tracks.forEach(function(trackName) {
			let track = songDefinition[trackName];
			track.currentBarNumber = 0;
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
			playPauseBtn.textContent = 'Play';
		})
		.catch(util.simpleErr);
	};

	loadAllSounds();

	playPauseBtn.addEventListener('click', function() {
		isPlaying = !isPlaying;
		if (isPlaying) {
			totalTimePaused += audioContext.currentTime - lastPausedAt;
			playPauseBtn.textContent = 'Pause';
		} else {
			lastPausedAt = audioContext.currentTime;
			playPauseBtn.textContent = 'Play';
		}
		if (!schedulerStarted) {
			startScheduler();
		}
	});

})();
