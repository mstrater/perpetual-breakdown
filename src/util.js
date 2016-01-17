(function() {
	'use strict';

	function simpleErr(e) {
		if (e.stack) {
			console.log('=== stack ===');
			console.log(e.stack);
		}
		console.log(e);
	}

	// expects nonnegative ints with low <= high
	function randInt(low, high) {
		return Math.floor(Math.random() * (high - low + 1)) + low;
	}

	// expects array to be nonempty
	function randArrayEntry(array) {
		return array[randInt(0, array.length - 1)];
	}

	function makeWorkerSrc(src) {
		src = '(function() {"use strict";' + src + '})()';
		const blob = new Blob([src], {type: 'text/javascript'});
		return window.URL.createObjectURL(blob);
	}

	window.app.util = {
		simpleErr,
		randInt,
		randArrayEntry,
		makeWorkerSrc
	};
})();
