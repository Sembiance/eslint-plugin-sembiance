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
				description : "Prefer shorter arrow functions () => abc() instead of () => { abc(); }",
				category    : "Node.js and CommonJS",
				recommended : false,
				url         : "https://telparia.com/eslint-plugin-sembiance/rules/shorter-arrow-funs"
			},
			schema : []
		},

		create(context)
		{
			return {
				ArrowFunctionExpression(node)
				{
					const body = Array.force(node.body);

					if(!body || body.length!==1 || body[0].type!=="BlockStatement")
						return;
					
					const blockBodyArr = Array.force(body[0].body);
					if(blockBodyArr.length!==1)
						return;
					
					const blockBody = blockBodyArr[0];
					if(["IfStatement", "ForStatement", "TryStatement"].includes(blockBody.type))
						return;
					
					if(blockBody.type==="ExpressionStatement" && ["AssignmentExpression", "UnaryExpression", "ForStatement"].includes(blockBody.expression.type))
						return;
					
					if(blockBody.type==="ExpressionStatement" && blockBody.expression.type==="CallExpression" && (blockBody.expression.callee.name==="tiptoe" || blockBody.expression.arguments.map(v => v.type).includes("ArrowFunctionExpression")))
						return;

					if(helper.toText(node.parent).length>260)
						return;
					
					const params = Array.force(node.params);
					context.report({node, message : `Better written as ${(params.length!==1 ? "(" : "") + params.map(helper.toText).join(", ") + (params.length!==1 ? ")" : "")} => ${helper.toText(blockBody)}`});
				}
			};
		}
	};
};
