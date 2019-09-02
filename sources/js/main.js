// main bundle >> main.bundle.js

import YASMIJ from 'yasmij';

/*eslint-disable */
$(function () {
	let $send = $('.js-get-solve'),
		$result = $('.js-index-result');

	$('.js-index-table td').on('keyup', () => {
		if (validate()) {
			$send.removeClass('btn_disabled');
		} else {
			$send.addClass('btn_disabled');
		}
	});

	$send.on('click', (e) => {
		if ($(e.target).hasClass('btn_disabled')) {
			return false;
		}
		let $table = $('.js-index-table');
		let arr = [];
		$.each($table.find('tr'), (k, el) => {
		});
		$.each($table.find('td'), (k, el) => {
			arr.push(parseInt($(el).html()));
		});
		let result = getSolve(arrToMatrix(arr));
		// console.log('v= ' + v);
		// let x1 = v / result.x1;
		// let x2 = v / result.x2;
		// let x3 = v / result.x3;
		$result.html(`V= ${1/result.z} <br> x1= ${result.x1/result.z}; x2= ${result.x2/result.z}; x3= ${result.x3/result.z};`);
		debugger;
	});

	let validate = function () {
		let valid = true;
		$.each($('.js-index-table td'), (k, el) => {
			if ($(el).html() === '') {
				valid = false;
				return valid;
			}
		});
		return valid;
	};

	let arrToMatrix = function (arr) {
		let matrix = [];
		for (let i = 0; i < arr.length; i += 3) {
			let srt = arr.slice(i, i + 3);
			matrix.push(srt);
		}
		return matrix;
	};

	let getSolve = function (matrix) {
		let data = {
			type: 'minimize',
			objective : 'x1 + x2 + x3',
			constraints : [
				`${matrix[0][0] !== 0 ? matrix[0][0] + 'x1 +': ''} ${matrix[1][0] !== 0 ? matrix[1][0] + 'x2 +': ''} ${matrix[2][0] !== 0 ? matrix[2][0] + 'x3': ''} <= 1`,
				`${matrix[0][1] !== 0 ? matrix[0][1] + 'x1 +': ''} ${matrix[1][1] !== 0 ? matrix[1][1] + 'x2 +': ''} ${matrix[2][1] !== 0 ? matrix[2][1] + 'x3': ''} <= 1`,
				`${matrix[0][2] !== 0 ? matrix[0][2] + 'x1 +': ''} ${matrix[1][2] !== 0 ? matrix[1][2] + 'x2 +': ''} ${matrix[2][2] !== 0 ? matrix[2][2] + 'x3': ''} <= 1`
			]
		};
		let res = YASMIJ.solve(data);
		console.log(res);
		return res.result;
	}
});