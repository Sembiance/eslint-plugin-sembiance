"use strict";
// Big thanks to: https://astexplorer.net/

module.exports =
{
	meta :
	{
		type : "suggestion",
		docs :
		{
			description : "Prefer using Array.force(o) instead of Array.isArray(o) ? o : [o]",
			category    : "Node.js and CommonJS",
			recommended : false,
			url         : "https://telparia.com/eslint-plugin-sembiance/rules/prefer-array-force"
		},
		schema : []
	},

	create(context)
	{
		return {
			ConditionalExpression(node)
			{
				if(!node.test || node.test.type!=="CallExpression" || !node.test.callee)
					return;

				const callee = node.test.callee;
				if(!callee.object || callee.object.type!=="Identifier" || callee.object.name!=="Array")
					return;
				
				if(!callee.property || callee.property.type!=="Identifier" || callee.property.name!=="isArray")
					return;
				
				const args = node.test.arguments;
				if(!args || args.length!==1 || !args[0])
					return;
				
				const arg = args[0];

				function flattenMemberExpression(v)
				{
					return (v.object.type==="MemberExpression" ? flattenMemberExpression(v.object) : v.object.name) + "." + v.property.name;
				}

				function toText(v)
				{
					return (v.type==="Identifier" ? v.name : (v.type==="MemberExpression" ? flattenMemberExpression(v) : v));
				}

				function equalToArg(v)
				{
					if(arg.type==="Identifier" && v.type==="Identifier" && arg.name===v.name)
						return true;

					if(arg.type==="MemberExpression" && v.type==="MemberExpression" && flattenMemberExpression(arg)===flattenMemberExpression(v))
						return true;
					
					return false;
				}
				
				if(!node.consequent || !equalToArg(node.consequent))
					return;
				
				if(!node.alternate || node.alternate.type!=="ArrayExpression")
					return;

				if(!node.alternate.elements || node.alternate.elements.length!==1 || !node.alternate.elements[0])
					return;
				
				if(!equalToArg(node.alternate.elements[0]))
					return;
				
				context.report({node, message : "Use Array.force(" + toText(arg) + ") instead of Array.isArray(" + toText(arg) + ") ? " + toText(arg) + " : [" + toText(arg) + "]"});
			}
		};
	}
};
