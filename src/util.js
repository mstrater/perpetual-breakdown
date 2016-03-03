(function() {
	'use strict';

	function simpleErr(e) {
		if (e.stack) {
			console.log('=== stack ===');
			console.log(e.stack);
		}
		console.log(e);
	}

	// returns a int between [low , high] inclusive.
	function randInt(low, high) {
		if (low > high) {
			throw new Error('randInt: low must be <= high. : ' + low + ' , ' + high);
		}
		return Math.floor(Math.random() * (high - low + 1)) + low;
	}

	// expects array to be nonempty
	function randArrayEntry(array) {
		if (!array || !array.length) {
			throw new Error('randArrayEntry: Must pass array that is not empty.');
		}
		return array[randInt(0, array.length - 1)];
	}

	function makeWorkerSrcFromFunc(func) {
		const src = '"use strict"; (' + func.toString() + ')();';
		const blob = new Blob([src], {type: 'text/javascript'});
		return window.URL.createObjectURL(blob);
	}

	window.app.util = {
		simpleErr,
		randInt,
		randArrayEntry,
		makeWorkerSrcFromFunc
	};
})();
