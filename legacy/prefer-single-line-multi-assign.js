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
				description : "Prefer assigning multiple variables in one line instead of seperate lines IF it reduces a block (TODO on that last part rofl)",
				category    : "Node.js and CommonJS",
				recommended : false,
				url         : "https://telparia.com/eslint-plugin-sembiance/rules/prefer-single-line-multi-assign"
			},
			schema : []
		},

		create(context)
		{
			return {
				ExpressionStatement(node)
				{
					if(!node.parent.body || !node.parent.body.indexOf)
						return;
					
					// Allow them in constructors for easier readability
					if(node.parent.parent && node.parent.parent.parent && node.parent.parent.parent.type==="MethodDefinition" && node.parent.parent.parent.kind==="constructor")
						return;

					if(node.expression.type!=="AssignmentExpression" || node.expression.operator!=="=")
						return;

					// Only check Literal and MemberExpression assignments
					if(!["Literal", "MemberExpression"].includes(node.expression.right.type))
						return;
					
					const childLoc = node.parent.body.indexOf(node);
					for(let i=childLoc-1;i>=0;i--)
					{
						const n = node.parent.body[i];
						if(n.type!=="ExpressionStatement" || n.expression.type!=="AssignmentExpression" || n.expression.operator!=="=")
							return;

						if(n.expression.right.type!==node.expression.right.type || helper.toText(node.expression.right)!==helper.toText(n.expression.right))
							continue;
						
						console.log(helper.toText(node.expression.right));
						
						context.report({node, message : "Better rewritten as: " + helper.toText(n.expression.left) + " = " + helper.toText(node.expression.left) + " = " + helper.toText(node.expression.right)});
					}
				}
			};
		}
	};
};
