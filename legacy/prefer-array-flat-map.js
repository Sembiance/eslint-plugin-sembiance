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
				description : "Prefer using .flatMap() instead of .map().flat()",
				category    : "Node.js and CommonJS",
				recommended : false,
				url         : "https://telparia.com/eslint-plugin-sembiance/rules/prefer-array-flat-map"
			},
			schema : []
		},

		create(context)
		{
			return {
				CallExpression(node)
				{
					if(!node.callee.property || node.callee.property.type!=="Identifier" || node.callee.property.name!=="flat" || (node.arguments && node.arguments.length>0))
						return;

					if(!node.callee.object || node.callee.object.type!=="CallExpression" || !node.callee.object.callee || node.callee.object.callee.type!=="MemberExpression")
						return;
					
					if(!node.callee.object.callee.property || node.callee.object.callee.property.type!=="Identifier" || node.callee.object.callee.property.name!=="map")
						return;

					context.report({node, message : "Prefer .flatMap(" + Array.from(node.callee.object.arguments, arg => helper.toText(arg)).join(", ") + ")"});
				}
			};
		}
	};
};
