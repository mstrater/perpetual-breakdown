(function() {
	'use strict';

	function simpleErr(e) {
		if (e.stack) {
			console.log('=== stack ===');
			console.log(e.stack);
		}
		console.log(e);
	}

	function randInt(low, high) {
		return Math.floor(Math.random() * (high - low + 1)) + low;
	}

	function makeWorkerSrc(src) {
		src = '(function() {"use strict";' + src + '})()';
		const blob = new Blob([src], {type: 'text/javascript'});
		return window.URL.createObjectURL(blob);
	}

	window.app.util = {
		simpleErr,
		randInt,
		makeWorkerSrc
	};
})();
