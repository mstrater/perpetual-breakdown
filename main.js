(function() {
    'use strict';

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();

    const BPM = 180;
    const beatLength = 60 / BPM;

    // This var is helpful for scheduling.
    let songLength = 0.5;

    let isPlaying = true;

    const simpleErr = function(e) {
        if (e.stack) {
            console.log('=== stack ===');
            console.log(e.stack);
        }
        console.log(e);
    };

    const randInt = function(low, high) {
        return Math.floor(Math.random() * (high - low + 1)) + low;
    };

    const randItemInArr = function(arr) {
        return arr[randInt(0, arr.length - 1)];
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

    const sounds = {
        kick: {
            url: 'kick.wav',
            bars: 1
        },
        cym: {
            url: 'cym.wav',
            bars: 3
        },
        snare: {
            url: 'snare.wav',
            bars: 2
        }
    };
    const soundNames = Object.keys(sounds);

    const toPlayQueue = [];

    const play = function(sound, when) {
        toPlayQueue.push({
            audio: sound.audio,
            when: when
        });
    };

    const scheduler = function(e) {
        if (!isPlaying) {
            return;
        }

        const scheduleAheadTime = 0.1;

        let nextSound = toPlayQueue[0];
        while (nextSound && nextSound.when < audioContext.currentTime + scheduleAheadTime) {
            toPlayQueue.shift();

            const buffer = audioContext.createBufferSource();
            buffer.connect(audioContext.destination);
            buffer.buffer = nextSound.audio;
            buffer.start(nextSound.when);

            nextSound = toPlayQueue[0];
        }

        if (songLength < audioContext.currentTime) {
            songLength = audioContext.currentTime + beatLength;
        }

        // this code is temp!
        if (toPlayQueue.length === 0) {
            nextSound = sounds[randItemInArr(soundNames)];
            play(nextSound, songLength);
            songLength += beatLength * nextSound.bars;
        }
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
        const allSounds = [];
        soundNames.forEach(function(soundName) {
            allSounds.push(sounds[soundName]);
        });
        Promise.all(allSounds.map(loadSound)).then(start).catch(simpleErr);
    };

    loadAllSounds();

    document.querySelector('#playPause').addEventListener('click', function() {
        isPlaying = !isPlaying;
    });

})();
