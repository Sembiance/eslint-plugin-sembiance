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
				description : "Prefer using .append() and .prepend() instead of .appendChild() and .createTextNode()",
				category    : "Node.js and CommonJS",
				recommended : false,
				url         : "https://telparia.com/eslint-plugin-sembiance/rules/prefer-append-prepend"
			},
			schema : []
		},

		create(context)
		{
			return {
				CallExpression(node)
				{
					if(!node.callee || !node.callee.property || node.callee.property.type!=="Identifier")
						return;
					
					if(node.callee.property.name==="appendChild")
						return context.report({node, message : "Use .append() instead of .appendChild()"});
					
					if(node.callee.property.name==="createTextNode")
						return context.report({node, message : "Use .append(" + Array.from(node.arguments, helper.toText) + ") instead of .createTextNode()"});
				}
			};
		}
	};
};
