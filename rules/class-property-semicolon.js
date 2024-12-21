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
				description : "Prefer using .charAt(i) instead of .substring(i, i+1)",
				category    : "Node.js and CommonJS",
				recommended : false,
				url         : "https://sembiance.com/eslint-plugin-sembiance/rules/prefer-char-at"
			},
			schema : []
		},

		create(context)
		{
			return {
				ClassProperty(node)
				{
					const lastToken = context.getLastToken(node);
					if(lastToken.type!=="Punctuator" || lastToken.value!==";")
						context.report({node, message : `Add a semicolon to the end of class properties`});
				}
			};
		}
	};
}
