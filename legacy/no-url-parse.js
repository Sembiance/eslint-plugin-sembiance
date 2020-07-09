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
				description : "disallow use of url.parse as it is deprecated",
				category    : "Node.js and CommonJS",
				recommended : false,
				url         : "https://telparia.com/eslint-plugin-sembiance/rules/no-url-parse"
			},
			schema : []
		},

		create(context)
		{
			return {
				MemberExpression(node)
				{
					if(!node.object || !node.property || node.object.type!=="Identifier" || node.object.name!=="url" || node.property.type!=="Identifier" || node.property.name!=="parse")
						return;
					
					context.report({node, message : "Don't use 'url.parse()' as it is deprecated. Instead use new url.URL(\"/the/url/path.html?hello=world\", \"http://host.com/\")"});
				}
			};
		}
	};
};
