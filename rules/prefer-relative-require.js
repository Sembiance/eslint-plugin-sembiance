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
				description : `Prefer using require("../test.js") instead of require(path.join(__dirname, "..", "test.js))`,
				category    : "Node.js and CommonJS",
				recommended : false,
				url         : "https://sembiance.com/eslint-plugin-sembiance/rules/prefer-relative-require"
			},
			schema : []
		},

		create(context)
		{
			return {
				CallExpression(block)
				{
					// Ensure we have a require() call
					if(block.callee.type!=="Identifier" || block.callee.name!=="require")
						return;
					
					// Ensure we have just 1 arg, a call to path.join
					if(!block.arguments || block.arguments.length!==1 || block.arguments[0].type!=="CallExpression" || block.arguments[0].callee.type!=="MemberExpression" ||
					   !block.arguments[0].callee.object || block.arguments[0].callee.object.type!=="Identifier" || block.arguments[0].callee.object.name!=="path" ||
					   !block.arguments[0].callee.property || block.arguments[0].callee.property.type!=="Identifier" || block.arguments[0].callee.property.name!=="join")
						return;
					
					// Ensure the first property to path.join() is __dirname
					if(!block.arguments[0].arguments || block.arguments[0].arguments.length===0 || block.arguments[0].arguments[0].type!=="Identifier" || block.arguments[0].arguments[0].name!=="__dirname")
						return;
					
					context.report({node : block, message : `Use relative paths '../../' instead of path.join(__dirname)`});
				}
			};
		}
	};
}
