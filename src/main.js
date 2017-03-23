(function() {
	'use strict';

	const util = window.app.util;

	const AudioContext = window.AudioContext || window.webkitAudioContext;
	const audioContext = new AudioContext();

	const songDefinition = window.app.songDefinition;

	// Number of seconds to wait before song starts playing after user clicks play.
	// This should be no less than 0.1. Things start weirdly otherwise (not sure why).
	const startPadding = 0.1;

	const barLength = 60 / songDefinition.bpm;

	let isPlaying = false;
	let lastPausedAt = 0;
	let totalTimePaused = 0;

	let currentSection;
	let nextSectionPlaysAt = 0;
	let currentTracks;

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
		We also have "sections" and "tracks". Sections are objects that hold tracks. Tracks are actually
		sound selector functions that return the next sound to be played. We calculate
		a "global bar number" var (schedulingForBar) to know when sections need to change.
		Tracks have their own "local" bar number that gets set to 0 when a section switch happens.
		*/

		// convert audioContext time to song time.
		const songTime = audioContext.currentTime - totalTimePaused;

		// The bar number we are currently scheduling for. This is like the global bar number that always grows.
		const schedulingForBar = Math.floor((songTime + scheduleAheadTime) / barLength);

		if (songTime > nextSectionPlaysAt - scheduleAheadTime) {
			// Need to select the next section.
			currentSection = songDefinition.selectSection(schedulingForBar, currentSection);
			// keep track of what bar this section started at - needed for adding to the track bar numbers.
			currentSection.startingBar = schedulingForBar;
			// calculate when the next section switch happens (a "song time" var).
			nextSectionPlaysAt = (schedulingForBar + currentSection.bars) * barLength + startPadding;
			// get the tracks (sound selector functions) and init their local bar numbers to 0.
			currentTracks = Object.keys(currentSection.tracks).map(function(trackName) {
				const track = currentSection.tracks[trackName];
				track.currentBar = 0;
				return track;
			});
		}

		// loop through the tracks (sound selector functions) and check if we need to schedule.
		currentTracks.forEach(function(selectSound) {
			// nextSoundPlaysAt is a "song time" variable.
			const nextSoundPlaysAt = (selectSound.currentBar + currentSection.startingBar) * barLength + startPadding;
			if (songTime > nextSoundPlaysAt - scheduleAheadTime) {
				// we are close enough to the next sound playing, so schedule it.
				const nextSound = selectSound(selectSound.currentBar);

				if (!nextSound.rest) {
					const buffer = audioContext.createBufferSource();
					// connect the sound to the gain node (which connects to the destination).
					buffer.connect(nextSound.gainNode);
					// Make the buffer point at the AudioBuffer.
					buffer.buffer = nextSound.audio;

					// this is a fun variable.
					buffer.playbackRate.value = songDefinition.playbackRate || 1.0;

					// convert nextSoundPlaysAt to a "audioContext time" and perform the schedule.
					buffer.start(nextSoundPlaysAt + totalTimePaused);
				}

				selectSound.currentBar += nextSound.bars;
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

	const loadAllSounds = function() {
		Promise.all(Object.keys(songDefinition.sounds).map(function(soundName) {
			const sound = songDefinition.sounds[soundName];
			// set up gain nodes per sound so that sounds in the same track can
			// play at different volumes and overlap.
			sound.gainNode = audioContext.createGain();
			sound.gainNode.gain.value = sound.volume;
			// connect the gain nodes to the destination.
			sound.gainNode.connect(audioContext.destination);
			// load the sound file.
			return loadSound(sound);
		})).then(function() {
			playPauseBtn.disabled = false;
			playPauseBtn.textContent = 'Play';
		}).catch(util.simpleErr);
	};

	loadAllSounds();
})();
