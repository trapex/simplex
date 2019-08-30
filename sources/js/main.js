// main bundle >> main.bundle.js

import YASMIJ from 'yasmij';
$(function () {
	let $send = $('.js-get-solve');

	$send.on('click', (e) => {
		debugger;
	});

	let data2 = {
		type: "minimize",
		objective : "x1 + x2 + x3",
		constraints : [
			"x1 + 7x2 + 5x3 <= 1",
			"4x1 + 2x2 + 3x3 <= 1",
			"6x1 + 2x3 <= 1"
		]
	};
	let res2 = YASMIJ.solve( data2 );
	console.log(res2);
	debugger;
});