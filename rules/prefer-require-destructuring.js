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
				description : "Prefer using {CD} = require('whatever') instead of CD = require('whatever').CD",
				category    : "Node.js and CommonJS",
				recommended : false,
				url         : "https://telparia.com/eslint-plugin-sembiance/rules/prefer-require-destructuring"
			},
			schema : []
		},

		create(context)
		{
			return {
				VariableDeclarator(block)
				{
					// Ensure the left side is a regular identifier
					if(!block.id || block.id.type!=="Identifier")
						return;
					
					// Ensure we are a require().var expression
					if(!block.init || block.init.type!=="MemberExpression")
						return;
					
					// Ensure we have a require() call
					if(!block.init.object || block.init.object.type!=="CallExpression" || !block.init.object.callee || block.init.object.callee.type!=="Identifier" || block.init.object.callee.name!=="require")
						return;
					
					// Ensure the right part of the member expression is a regular identifier
					if(!block.init.property || block.init.property.type!=="Identifier")
						return;

					if(block.id.name===block.init.property.name)
						context.report({node : block, message : `Better written as: {${block.id.name}} = ${helper.toText(block.init.object)}`});
				}
			};
		}
	};
};
