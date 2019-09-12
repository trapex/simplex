// main bundle >> main.bundle.js

import YASMIJ from 'yasmij';

/*eslint-disable */
$(function () {
	Array.prototype.max = function() {
		return Math.max.apply(null, this);
	};
	Array.prototype.min = function() {
		return Math.min.apply(null, this);
	};

	let initialData = [],
		$initialTable = $('.js-initial-table'),
		$setInitialData = $('.js-table-set'),
		$capitalization = $('.js-index-capitalization'),
		$capText = $('.js-capitalization-text'),
		$regret = $('.js-index-regret'),
		$step = $('.js-index-step'),
		T = 4,
		n = 3;

	$setInitialData.on('click', (e) => {
		let arr = [];
		let $capResult = $('.js-cap-res'),
			$regResult = $('.js-reg-res');
		$.each($initialTable.find('tr'), (k, el) => {
		});
		$.each($initialTable.find('td'), (k, el) => {
			arr.push(parseFloat($(el).html()) ? parseFloat($(el).html()) : null);
		});
		let m = arrToMatrix(arr, T);
		let capMatrix = getCapitalizationMatrix(m, n);
		$capitalization.html(setMatrix(capMatrix));
		setStep(3);
		let capResult = getSolveSimplex(getPositiveMatrix(capMatrix), T, n);
		$capResult.html(`V= ${1/capResult.z} <br> x1= ${capResult.x1/capResult.z}; x2= ${capResult.x2/capResult.z}; x3= ${capResult.x3/capResult.z};`);

		// Regret method
		let regMatrix = getRegretMatrix(capMatrix);
		$regret.html(setMatrix(regMatrix));
		let regResult = getSolveSimplex(getPositiveMatrix(regMatrix), T, n);
		$regResult.html(`V= ${1/regResult.z} <br> x1= ${regResult.x1/regResult.z}; x2= ${regResult.x2/regResult.z}; x3= ${regResult.x3/regResult.z};`);
	});


	// solve of simplex method
	let getSolveSimplex = function (matrix, T, n) {
		let objective = '';
		for (let i = 0; i < n; i++) {
			objective += `x${i + 1} + `;
		}
		objective = objective.substring(0, objective.length - 3);
		let constraintsArr = [];
		for (let j = 0; j < T; j++) {
			let contr = '';
			for (let k = 0; k < n; k++) {
				// contr += matrix[j][k] !== 0 ? `${matrix[j][k]}x${k+1} +`: '';
				let sign = matrix[k][j] >= 0 ? '+' : '-';
				if (k == 0) {
					sign = matrix[k][j] >= 0 ? '' : '-';
					// contr += `${sign}${Math.abs(matrix[k][j])}x${k+1} `;
				}
				if (matrix[k][j] !== 0) {
					contr += `${sign} ${Math.abs(matrix[k][j])}x${k+1} `;
				}
			}
			contr += ' <= 1';
			constraintsArr.push(contr);
			console.log(contr);
		}
		let data = {
			type: 'minimize',
			objective: objective,
			// constraints: [
			// 	`${matrix[0][0] !== 0 ? matrix[0][0] + 'x1 +': ''} ${matrix[1][0] !== 0 ? matrix[1][0] + 'x2 +': ''} ${matrix[2][0] !== 0 ? matrix[2][0] + 'x3': ''} <= 1`,
			// 	`${matrix[0][1] !== 0 ? matrix[0][1] + 'x1 +': ''} ${matrix[1][1] !== 0 ? matrix[1][1] + 'x2 +': ''} ${matrix[2][1] !== 0 ? matrix[2][1] + 'x3': ''} <= 1`,
			// 	`${matrix[0][2] !== 0 ? matrix[0][2] + 'x1 +': ''} ${matrix[1][2] !== 0 ? matrix[1][2] + 'x2 +': ''} ${matrix[2][2] !== 0 ? matrix[2][2] + 'x3': ''} <= 1`,
			// 	`${matrix[0][3] !== 0 ? matrix[0][3] + 'x1 +': ''} ${matrix[1][3] !== 0 ? matrix[1][3] + 'x2 +': ''} ${matrix[2][3] !== 0 ? matrix[2][3] + 'x3': ''} <= 1`
			// ]
			constraints: constraintsArr
		};
		let capHtml = `${objective} -> minimize<br><br>`;
		constraintsArr.forEach((el) =>{
			capHtml += `${el}<br>`;
		});
		let res = YASMIJ.solve(data);
		$capText.html(capHtml);
		console.log(res);
		return res.result;
	};

	let arrToMatrix = function (arr, col) {
		let matrix = [];
		for (let i = 0; i < arr.length; i += col) {
			let srt = arr.slice(i, i + col);
			matrix.push(srt);
		}
		return matrix;
	};

	let getRoundedMatrix = function (data) {
		let mtrx = data;
		mtrx.forEach((el, i) => {
			el.forEach((val, j) => {
				mtrx[i][j] = Math.round(val);
			});
		});
		return mtrx;
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
				let el = getCapitalization(data[2+ n][j], data[3+ n][j], data[2+i][j], C, data[0][j], data[1][j], j);
				capArr.push(el);
			}
			capMatrix.push(capArr);
		}
		return getRoundedMatrix(capMatrix);
	};

	let setMatrix = function (matrix) {
		let html = '<table class="table table_project">';
		matrix.forEach((el) => {
			html += '<tr>';
			el.forEach(val => {
				html += `<td>${val}</td>`;
			});
			html += '</tr>';
		});
		html += '</table>';
		return html;
	};

	let getCol = function (matrix, col) {
		let column = [];
		for(let i=0; i < matrix.length; i++){
			column.push(matrix[i][col]);
		}
		return column;
	};

	let getPositiveMatrix = function (data) {
		let mtrx = [];
		let minEls = [];
		for (let i = 0; i < data[0].length ; i++) {
			minEls.push(Math.min.apply(null, getCol(data, i)));
		}
		console.log(minEls);
		let min = Math.min.apply(null, minEls)
		data.forEach((el) => {
			let arr = [];
			el.forEach((val, k) => {
				arr.push(val + Math.abs(min));
			});
			mtrx.push(arr);
		});
		console.table(mtrx);
		return mtrx;
	};

	let getRegretMatrix = function (data) {
		let mtrx = [];
		let maxEls = [];

		for (let i = 0; i < data[0].length ; i++) {
			console.log(getCol(data, i));
			maxEls.push(Math.max.apply(null, getCol(data, i)));
		}
		console.log(maxEls);
		data.forEach((el) => {
			let arr = [];
			el.forEach((val, k) => {
				arr.push(val - maxEls[k]);
			});
			mtrx.push(arr);
		});
		console.table(mtrx);
		return mtrx;
	};

	let setStep = function (step) {
		$step.removeClass('index__wrap_step1 index__wrap_step2 index__wrap_step3');
		$step.addClass(`index__wrap_step${step}`);
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