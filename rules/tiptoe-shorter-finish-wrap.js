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
				description : "Prefer a shorter finish wrap syntax",
				category    : "Node.js and CommonJS",
				recommended : false,
				url         : "https://telparia.com/eslint-plugin-sembiance/rules/tiptoe-shorter-finish-wrap"
			},
			schema : []
		},

		create(context)
		{
			return {
				CallExpression(node)
				{
					if(!node.callee || !node.callee.object || node.callee.object.type!=="MemberExpression" || !node.callee.object.object || node.callee.object.object.type!=="ThisExpression")
						return;
					
					if(!node.callee.object.property || node.callee.object.property.type!=="Identifier" || node.callee.object.property.name!=="finish")
						return;

					if(!node.callee.property || node.callee.property.type!=="Identifier" || node.callee.property.name!=="bind")
						return;
					
					if(!node.arguments || node.arguments.length!==1 || node.arguments[0].type!=="ThisExpression")
						return;

					context.report({node, message : `Just pass 'this.finish' instead of: ${helper.toText(node)}`});
				}
			};
		}
	};
};
