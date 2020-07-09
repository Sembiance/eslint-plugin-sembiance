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
				description : "Prefer using util.callbackify(fun) instead of promise style fun().then()",
				category    : "Node.js and CommonJS",
				recommended : false,
				url         : "https://telparia.com/eslint-plugin-sembiance/rules/prefer-callbackify"
			},
			schema : []
		},

		create(context)
		{
			return {
				MemberExpression(node)
				{
					if(!node.property || node.property.type!=="Identifier" || node.property.name!=="then")
						return;
					
					context.report({node, message : "Use util.callbackify(" + helper.toText(node.object) + ") instead of .then()"});
				}
			};
		}
	};
};
