"use strict";
/*eslint no-unused-vars: [2, {"argsIgnorePattern" : "^helper$" }]*/

// Interactive AST explorer, VERY useful: https://astexplorer.net/

module.exports = function rule(helper)
{
	return {
		meta :
		{
			type : "suggestion",
			docs :
			{
				description : "I always want to include dot files in glob",
				category    : "Node.js and CommonJS",
				recommended : false,
				url         : "https://telparia.com/eslint-plugin-sembiance/rules/glob-dot-files"
			},
			schema : []
		},

		create(context)
		{
			return {
				CallExpression(node)
				{
					if(!node.callee || node.callee.type!=="Identifier" || node.callee.name!=="glob")
						return;
					
					if(node.arguments.length!==3 || node.arguments[1].type!=="ObjectExpression" || !node.arguments[1].properties.some(property => property.key.name==="dot"))
						context.report({node, message : "glob by default doesn't return .dot files, pass an option: {dot : true}"});

					if(node.arguments.length!==3 || node.arguments[1].type!=="ObjectExpression" || !node.arguments[1].properties.some(property => property.key.name==="cwd"))
						context.report({node, message : "glob chokes on paths with odd characters. Always set to avoid issues: {cwd : '/starting/path/'}"});

					if(node.arguments.length!==3 || node.arguments[1].type!=="ObjectExpression" || !node.arguments[1].properties.some(property => property.key.name==="absolute"))
						context.report({node, message : "glob should always return absolute paths: {absolute : true}"});
				}
			};
		}
	};
};
