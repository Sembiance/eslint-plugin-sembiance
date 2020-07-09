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
				description : "Prefer a ?? b instead of a || b",
				category    : "Node.js and CommonJS",
				recommended : false,
				url         : "https://telparia.com/eslint-plugin-sembiance/rules/prefer-nullish-coalescing"
			},
			schema : []
		},

		create(context)
		{
			return {
				ConditionalExpression(node)
				{
					if(helper.toText(node.test)===helper.toText(node.consequent))
						return context.report({node, message : "Better written as: " + helper.toText(node.test) + " ?? " + helper.toText(node.alternate)});
					
					if(node.test.type==="BinaryExpression" && helper.toText(node.test.left)===helper.toText(node.consequent) && node.test.operator==="!==" && ([null, false].includes(node.test.right.value) || node.test.right.name==="undefined"))
						return context.report({node, message : "Better written as: " + helper.toText(node.test.left) + " ?? " + helper.toText(node.alternate)});
					
					if(node.test.type==="BinaryExpression" && helper.toText(node.test.left)===helper.toText(node.alternate) && node.test.operator==="===" && ([null, false].includes(node.test.right.value) || node.test.right.name==="undefined"))
						return context.report({node, message : "Better written as: " + helper.toText(node.test.left) + " ?? " + helper.toText(node.consequent)});
				},

				VariableDeclarator(node)
				{
					if(node.init && node.init.type==="LogicalExpression" && node.init.operator==="||")
						return context.report({node, message : "Better written as: " + helper.toText(node.id) + " = " + helper.toText(node.init.left) + " ?? " + helper.toText(node.init.right)});
				}
			};
		}
	};
};
