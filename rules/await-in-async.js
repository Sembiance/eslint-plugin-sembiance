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
				description : "Requires await to be inside async functions",
				category    : "Node.js and CommonJS",
				recommended : false,
				url         : "https://sembiance.com/eslint-plugin-sembiance/rules/await-in-async"
			},
			schema : []
		},

		create(context)
		{
			return {
				AwaitExpression(node)
				{
					let current = node;
					while(current)
					{
						if(["FunctionDeclaration", "ArrowFunctionExpression"].includes(current.type))
							break;
						
						current = current.parent;
					}

					if(!current)
						return;
					
					if(!current.async)
						context.report({node, message : `Invalid await keyword in non-async function ${current?.id?.name || ""}`});
				}
			};
		}
	};
}
