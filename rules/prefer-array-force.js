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
				description : "Prefer using Array.force(o) instead of Array.isArray(o) ? o : [o]",
				category    : "Node.js and CommonJS",
				recommended : false,
				url         : "https://telparia.com/eslint-plugin-sembiance/rules/prefer-array-force"
			},
			schema : []
		},

		create(context)
		{
			return {
				ConditionalExpression(node)
				{
					if(!node.test || node.test.type!=="CallExpression" || !node.test.callee)
						return;

					const callee = node.test.callee;
					if(!callee.object || callee.object.type!=="Identifier" || callee.object.name!=="Array")
						return;
					
					if(!callee.property || callee.property.type!=="Identifier" || callee.property.name!=="isArray")
						return;
					
					const args = node.test.arguments;
					if(!args || args.length!==1 || !args[0])
						return;
					
					if(!node.consequent || helper.toText(node.consequent)!==helper.toText(args[0]))
						return;
					
					if(!node.alternate || node.alternate.type!=="ArrayExpression")
						return;

					if(!node.alternate.elements || node.alternate.elements.length!==1 || !node.alternate.elements[0])
						return;
					
					if(helper.toText(node.alternate.elements[0])!==helper.toText(args[0]))
						return;
					
					context.report({node, message : `Use Array.force(${helper.toText(args[0])}) instead of Array.isArray(${helper.toText(args[0])}) ? ${helper.toText(args[0])} : [${helper.toText(args[0])}]`});
				}
			};
		}
	};
};
