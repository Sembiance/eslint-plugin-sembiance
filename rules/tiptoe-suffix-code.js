/*eslint no-unused-vars: [2, {"argsIgnorePattern" : "^helper$" }]*/

// Interactive AST explorer, VERY useful: https://astexplorer.net/
export default function rule(helper)
{
	return {
		meta :
		{
			type : "suggestion",
			docs :
			{
				description : "Warn if content is after a tiptoe() call",
				category    : "Node.js and CommonJS",
				recommended : false,
				url         : "https://sembiance.com/eslint-plugin-sembiance/rules/tiptoe-suffix-code"
			},
			schema : []
		},

		create(context)
		{
			return {
				CallExpression(node)
				{
					if(!node.callee || node.callee.type!=="Identifier" || node.callee.name!=="tiptoe" || !node.parent || !node.parent.parent || !node.parent.parent.body)
						return;
					
					const loc = node.parent.parent.body.indexOf(node.parent);
					if(loc===-1 || (loc+1)===node.parent.parent.body.length)
						return;

					let hasActualCodeAfterTiptoe = false;
					node.parent.parent.body.slice(loc+1).forEach(subNode =>
					{
						if(!["FunctionDeclaration", "VariableDeclaration"].includes(subNode.type))
							hasActualCodeAfterTiptoe = true;
					});

					if(hasActualCodeAfterTiptoe)
						context.report({node, message : "Code after a tiptoe() will execute immediately due to async nature of tiptoe"});
				}
			};
		}
	};
}
