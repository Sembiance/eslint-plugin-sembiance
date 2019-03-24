"use strict";

const requireIndex = require("requireindex"),
	path = require("path");

// import all rules in lib/rules
module.exports.rules = requireIndex(path.join(__dirname, "rules"));
