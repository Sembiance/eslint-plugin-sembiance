"use strict";

function abc(a, b)
{
	return a ? a : b;
}

function abc2(a, b)
{
	return a!==undefined ? a : b;
}

function abc3(a, b)
{
	return a!==null ? a : b;
}

function abc4(a, b)
{
	return a!==false ? a : b;
}

function abc5(a, b)
{
	return a===false ? b : a;
}

function abc6(a, b)
{
	return a===undefined ? b : a;
}

function abc7(a, b)
{
	return a===null ? b : a;
}

function abc8(a, b, c)
{
	const d = (a || b) ? c : "hi";
	if(b || c)
		console.log("yup");

	const e = a || "yup2";
	return [a, b, c, d, e];
}

function abc9(a)
{
	const b = a || "yup3";
	return b || "z";
}

abc();
abc2();
abc3();
abc4();
abc5();
abc6();
abc7();
abc8();
abc9();
