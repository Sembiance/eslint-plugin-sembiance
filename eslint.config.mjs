import {default as nodeConfig} from "/mnt/compendium/DevLab/common/eslint/node.eslint.config.js";

nodeConfig.push({
	ignores :
	[
		"future/",
		"sandbox/"
	]
});

export default nodeConfig;	// eslint-disable-line unicorn/prefer-export-from
