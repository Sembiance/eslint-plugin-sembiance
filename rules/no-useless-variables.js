"use strict";
// Big thanks to: https://astexplorer.net/

module.exports =
{
	meta :
	{
		type : "suggestion",
		docs :
		{
			description : "disallow creation of a variable that is just immediately returned",
			category    : "Node.js and CommonJS",
			recommended : false,
			url         : "https://telparia.com/eslint-plugin-sembiance/rules/no-useless-variables"
		},
		schema : []
	},

	create(context)
	{
		return {
			VariableDeclaration(node)
			{
				if(!node.parent || !node.parent.body || !node.parent.body.indexOf || !node.declarations || node.declarations.length===0 || node.declarations[0].type!=="VariableDeclarator" || !node.declarations[0].id || !node.declarations[0].id.name)
					return;
				
				const loc = node.parent.body.indexOf(node);
				if(loc===-1 || (loc+1)===node.parent.body.length || node.parent.body[loc+1].type!=="ReturnStatement" || !node.parent.body[loc+1].argument)
					return;

				const varName = node.declarations[0].id.name;
				if(node.parent.body[loc+1].argument.name!==varName)
					return;

				context.report({node, message : "Variable '" + varName + "' is not needed. Just return it directly."});
			}
		};
	}
};
