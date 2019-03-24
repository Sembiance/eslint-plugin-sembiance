"use strict";
// Big thanks to: https://astexplorer.net/

module.exports =
{
	meta :
	{
		type : "suggestion",
		docs :
		{
			description : "Favor .includes() instead of comparing against ===-1 or !==-1",
			category    : "Node.js and CommonJS",
			recommended : false,
			url         : "https://telparia.com/eslint-plugin-sembiance/rules/favor-includes"
		},
		schema : []
	},

	create(context)
	{
		return {
			BinaryExpression(node)
			{
				if(!["===", "!==", "==", "!="].includes(node.operator))
					return;
				
				if(!node.left || node.left.type!=="CallExpression" || !node.left.callee || node.left.callee.type!=="MemberExpression" ||
					!node.left.callee.property || node.left.callee.property.name!=="indexOf")
					return;

				if(!node.right || node.right.type!=="UnaryExpression" || node.right.operator!=="-" ||
					!node.right.argument || node.right.argument.type!=="Literal" || node.right.argument.value!==1)
					return;

				context.report({node, message : "Don't use .indexOf() to check existence, instead use .includes()"});
			}
		};
	}
};
