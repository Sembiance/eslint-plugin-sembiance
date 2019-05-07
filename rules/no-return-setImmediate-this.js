"use strict";
// Big thanks to: https://astexplorer.net/

module.exports =
{
	meta :
	{
		type : "suggestion",
		docs :
		{
			description : "disallow use of return setImmediate(this); due to the fact that setImmediate returns an ID number which thus calls this() twice",
			category    : "Node.js and CommonJS",
			recommended : false,
			url         : "https://telparia.com/eslint-plugin-sembiance/rules/no-accounting-format-number"
		},
		schema : []
	},

	create(context)
	{
		return {
			ReturnStatement(node)
			{
				if(node.type!=="ReturnStatement" || !node.argument || node.argument.type!=="CallExpression" || node.argument.callee.type!=="Identifier" || node.argument.callee.name!=="setImmediate")
					return;
				
				if(!node.argument.arguments || node.argument.arguments.length>1 || node.argument.arguments[0].type!=="ThisExpression")
					return;

				context.report({node, message : "Don't use 'return setImmediate(this)' as setImmediate returns an ID and thus this() is executed twice."});
			}
		};
	}
};
