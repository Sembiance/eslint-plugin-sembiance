"use strict";
/*eslint no-unused-vars: 0*/
const XU = require("@sembiance/xu"),
	url = require("url"),
	tiptoe = require("tiptoe");

// Should have errors on almost every single line below for each of my "custom" eslint rules

const accounting = { formatNumber() {}, formatMoney() {} };

// disfavor-array-concat
let a = [];
a = a.concat("123");
const b = a.slice().concat();
const c = [].concat(a, b);


// favor-includes
if(a.indexOf(0)===-1)
	console.log("");


// no-accounting-format-number
accounting.formatNumber(123);
accounting.formatMoney(123);


// no-url-parse
const u = url.parse("https://worldofsolitaire.com");


// no-useless-variables
function noUselessVariables()
{
	const config = { abc : 123 };
	return config;
}


// prefer-array-force
const o = Array.isArray(a) ? a : [a];


// shorter-arrow-funs
setTimeout(abc => { this.hello(abc); }, 2000);


// no-return-setImmediate-this
tiptoe(
	function step1()
	{
		return setImmediate(this);
	},
	function ignored() {}
);


// tiptoe-suffix-code
// See error above, at the end of the tiptoe call
console.log("");
