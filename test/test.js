/*eslint no-unused-vars: 0*/
const WOS = {C : "hello", G : "world"};
function test()
{
	const WOS = {C : "hello", G : "world"};	// eslint-disable-line no-shadow
	const C = WOS.C, G = WOS.G;
}
test();

const C = WOS.C, G = WOS.G;

let a = [];
const othen = { then() { } };

// Should have an error on EVERY LINE BELOW

const accounting = require("accounting"),	// node/no-restricted-require
	nan = require("nan"),	// node/no-restricted-require
	glob = require("glob"),	// node/no-restricted-require
	mkdirp = require("mkdirp"),	// node/no-restricted-require
	rimraf = require("rimraf");	// node/no-restricted-require

a = a.concat("123");
const b = a.slice().concat();
const c = [].concat(a, b);
a.splice(0, 0, "hi");

console.log(a.indexOf(0)===-1);

const u = url.parse("https://worldofsolitaire.com");

function noUselessVariables() {	const config = { abc : 123 }; return config; }

const o = Array.isArray(a) ? a : [a];

setTimeout(abc => { this.hello(abc); }, 2000);

othen.then();

console.log("test".substring(0, 1));

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
