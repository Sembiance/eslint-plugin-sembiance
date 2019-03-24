"use strict";
// Big thanks to: https://astexplorer.net/

module.exports =
{
	meta :
	{
		type : "suggestion",
		docs :
		{
			description : "disallow use of accounting.formatNumber or accounting.formatMoney in favor of .toLocaleString()",
			category    : "Node.js and CommonJS",
			recommended : false,
			url         : "https://telparia.com/eslint-plugin-sembiance/rules/no-accounting-format-number"
		},
		schema : []
	},

	create(context)
	{
		return {
			CallExpression(node)
			{
				if(!node.callee || node.callee.type!=="MemberExpression" || !node.callee.object || node.callee.object.type!=="Identifier" || !node.callee.property || node.callee.property.type!=="Identifier")
					return;
				
				if(node.callee.object.name!=="accounting" || !["formatNumber", "formatMoney"].includes(node.callee.property.name))
					return;

				context.report({node, message : "Don't call accounting." + node.callee.property.name + " Instead use .toLocaleString()"});
			}
		};
	}
};
