// main bundle >> main.bundle.js

import YASMIJ from 'yasmij';

/*eslint-disable */
$(function () {
	let initialData = [],
		$initialTable = $('.js-initial-table'),
		$setInitialData = $('.js-table-set'),
		T = 4,
		n = 3;

	let arrToMatrix = function (arr, col) {
		let matrix = [];
		for (let i = 0; i < arr.length; i += col) {
			let srt = arr.slice(i, i + col);
			matrix.push(srt);
		}
		return matrix;
	};

	$setInitialData.on('click', (e) => {
		let arr = [];
		let $result = $('.js-res');
		$.each($initialTable.find('tr'), (k, el) => {
		});
		$.each($initialTable.find('td'), (k, el) => {
			arr.push(parseInt($(el).html()) ? parseInt($(el).html()) : null);
		});
		let m = arrToMatrix(arr, T);
		let capMatrix = getCapitalizationMatrix(m, n);
		let result = getSolveSimplex(capMatrix, T, n);
		$result.html(`V= ${1/result.z} <br> x1= ${result.x1/result.z}; x2= ${result.x2/result.z}; x3= ${result.x3/result.z};`);
		debugger;
	});

	let getSolveSimplex = function (matrix, T, n) {
		debugger;
		let objective = '';
		for (let i = 0; i < n; i++) {
			objective += `x${i + 1} + `;
		}
		objective = objective.substring(0, objective.length - 3);
		let constraintsArr = [];
		// for (let j = 0; j < T+1; j++) {
		// 	let contr = '';
		// 	for (let k = 0; k < n; k++) {
		// 		contr += matrix[j][k] !== 0 ? `${matrix[j][k]}x${k+1} +`: '';
		// 	}
		// }
		debugger;
		let data = {
			type: 'minimize',
			objective: objective,
			constraints: [
				`${matrix[0][0] !== 0 ? matrix[0][0] + 'x1 +': ''} ${matrix[1][0] !== 0 ? matrix[1][0] + 'x2 +': ''} ${matrix[2][0] !== 0 ? matrix[2][0] + 'x3': ''} <= 1`,
				`${matrix[0][1] !== 0 ? matrix[0][1] + 'x1 +': ''} ${matrix[1][1] !== 0 ? matrix[1][1] + 'x2 +': ''} ${matrix[2][1] !== 0 ? matrix[2][1] + 'x3': ''} <= 1`,
				`${matrix[0][2] !== 0 ? matrix[0][2] + 'x1 +': ''} ${matrix[1][2] !== 0 ? matrix[1][2] + 'x2 +': ''} ${matrix[2][2] !== 0 ? matrix[2][2] + 'x3': ''} <= 1`,
				`${matrix[0][3] !== 0 ? matrix[0][3] + 'x1 +': ''} ${matrix[1][3] !== 0 ? matrix[1][3] + 'x2 +': ''} ${matrix[2][3] !== 0 ? matrix[2][3] + 'x3': ''} <= 1`
			]
		};
		let res = YASMIJ.solve(data);
		console.log(res);
		return res.result;
	};

	let getCapitalization = function (Mt, ftY, zt, C, ht, st, t) {
		let Cap = 0;
		if (t == 0 || C == 0) {
			Cap = Mt - ftY + zt;
		} else {
			if (C > 0) {
				Cap = Mt - ftY + zt + (1+ ht) * C;
			} else {
				Cap = Mt - ftY + zt + (1+ st) * C;
			}
		}
		return Cap;
	};

	let getCapitalizationMatrix = function (data, n) {
		let capMatrix = [];
		for (let i = 0; i < n; i++) {
			let capArr = [];
			for (let j = 0; j < data[0].length; j++) {
				let C = capArr.length === 0 ? 0 : capArr[j - 1];
				let el = getCapitalization(data[1+ n][j], data[2+ n][j], data[2+i][j], C, data[0][j], data[1][j], j);
				capArr.push(el);
			}
			capMatrix.push(capArr);
		}
		console.table(capMatrix);
		return capMatrix;
	};

});
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