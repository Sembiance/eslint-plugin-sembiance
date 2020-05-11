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
				description : "Warn about using this.<whatever> inside of a tipoe call inside a class",
				category    : "Node.js and CommonJS",
				recommended : false,
				url         : "https://telparia.com/eslint-plugin-sembiance/rules/warn-this-in-tiptoe-in-class"
			},
			schema : []
		},

		create(context)
		{
			return {
				MemberExpression(node)
				{
					if(!node.object || node.object.type!=="ThisExpression" || !node.property || node.property.type!=="Identifier")
						return;
					
					if(["data", "exit", "finish", "back", "jump", "capture", "parallel"].includes(node.property.name))
						return;
					
					let isInTiptoe = false;
					let p=node.parent;
					while(p)
					{
						if(p.type==="CallExpression" && p.callee && p.callee.type==="Identifier" && p.callee.name==="tiptoe")
							isInTiptoe = true;
						p = p.parent;
					}

					if(!isInTiptoe)
						return;
					
					context.report({node, message : "Invalid 'this' in tiptoe. Instead do: self." + helper.toText(node.property) + " Use self"});
				}
			};
		}
	};
};
