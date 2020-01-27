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
				description : "Disfavor array concat",
				category    : "Node.js and CommonJS",
				recommended : false,
				url         : "https://telparia.com/eslint-plugin-sembiance/rules/disfavor-array-concat"
			},
			schema : []
		},

		create(context)
		{
			return {
				MemberExpression(_node)
				{
					[
						// a = a.concat()
						node =>
						{
							if(!node.parent || !node.parent.parent || node.parent.parent.type!=="AssignmentExpression" ||
								node.parent.type!=="CallExpression" || !node.parent.parent.left.name ||
								!node.parent.callee || !node.parent.callee.object ||
								node.parent.parent.left.name!==node.parent.callee.object.name ||
								node.parent.callee.property.name!=="concat")
								return;

							context.report({node, message : "Don't self assign with Array." + node.property.name + "(). Instead use .push(...val) spread operator."});
						},
						// a.slice().concat()
						node =>
						{
							if(node.object.type!=="CallExpression" || !node.object.callee || !node.object.callee.property ||
							node.object.callee.property.name!=="slice" || !node.property || node.property.name!=="concat")
								return;

							context.report({node, message : "Don't .slice().concat(). Instead use ... spread operator."});
						},
						// [].concat()
						node =>
						{
							if(node.object.type!=="ArrayExpression" || !node.property || node.property.name!=="concat")
								return;

							context.report({node, message : "Don't [].concat(). Instead use [...val1, ...val2] spread operator."});
						}
					].forEach(fun => fun(_node));
				}
			};
		}
	};
};
