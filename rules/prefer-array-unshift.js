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
				description : "Prefer using .unshift(...) instead of .splice(0, 0, ...)",
				category    : "Node.js and CommonJS",
				recommended : false,
				url         : "https://telparia.com/eslint-plugin-sembiance/rules/prefer-array-unshift"
			},
			schema : []
		},

		create(context)
		{
			return {
				CallExpression(node)
				{
					if(!node.callee.property || node.callee.property.type!=="Identifier" || node.callee.property.name!=="splice" || !node.arguments || node.arguments.length<3)
						return;
					
					if(node.arguments[0].type!=="Literal" || node.arguments[0].value!==0)
						return;

					if(node.arguments[1].type!=="Literal" || node.arguments[1].value!==0)
						return;

					context.report({node, message : "Prefer .unshift(" + Array.from(node.arguments).slice(2).map(arg => helper.toText(arg)).join(", ") + ")"});
				}
			};
		}
	};
};
