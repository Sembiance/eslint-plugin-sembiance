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
				description : "Prefer using .dataset.whatever instead of (set|get)Attribute(\"data-whatever\")",
				category    : "Node.js and CommonJS",
				recommended : false,
				url         : "https://telparia.com/eslint-plugin-sembiance/rules/prefer-dataset"
			},
			schema : []
		},

		create(context)
		{
			return {
				CallExpression(node)
				{
					if(node.arguments.length===0 || node.arguments[0].type!=="Literal" || typeof node.arguments[0].value!=="string" || !node.arguments[0].value.startsWith("data-"))
						return;
					
					
					if(!node.callee || node.callee.type!=="MemberExpression" || !node.callee.property || node.callee.property.type!=="Identifier" || !["getAttribute", "setAttribute", "removeAttribute"].includes(node.callee.property.name))
						return;

					context.report({node, message : `Better written as: ${node.callee.property.name==="removeAttribute" ? "delete " : ""}${helper.toText(node.callee.object)}.dataset.${node.arguments[0].value.substring(5)}`});
				}
			};
		}
	};
};
