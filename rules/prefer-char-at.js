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
				description : "Prefer using .charAt(i) instead of .substring(i, i+1)",
				category    : "Node.js and CommonJS",
				recommended : false,
				url         : "https://telparia.com/eslint-plugin-sembiance/rules/prefer-char-at"
			},
			schema : []
		},

		create(context)
		{
			return {
				CallExpression(node)
				{
					if(!node.callee || !node.callee.property || node.callee.property.name!=="substring")
						return;
					
					if(node.arguments.length!==2 || node.arguments[0].type!=="Literal" || node.arguments[1].type!=="Literal")
						return;
					
					if((+node.arguments[0].value)!==(node.arguments[1].value-1))
						return;
					
					context.report({node, message : `Use .charAt(${node.arguments[0].value}) instead of ${helper.toText(node)}`});
				}
			};
		}
	};
};
