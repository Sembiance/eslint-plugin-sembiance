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
				description : "Prefer using const {C, G} = WOS instead of const C = WOS.C, G = WOS.G",
				category    : "Node.js and CommonJS",
				recommended : false,
				url         : "https://sembiance.com/eslint-plugin-sembiance/rules/prefer-object-destructuring"
			},
			schema : []
		},

		create(context)
		{
			const fun = block =>
			{
				if(!block.body || block.body.length<2)
					return;

				const assignments = {};
				
				for(let i=0;i<block.body.length;i++)
				{
					const node = block.body[i];
					getAssignemnts(node);
				}

				for(const [fromName, toData] of Object.entries(assignments))
				{
					if(toData.varNames.length>1)
						context.report({node : toData.nodes[0], message : `Better written as: {${toData.nodes.map(node => helper.toText(node.id)).join(", ")}} = ${fromName}`});
				}

				// Currently treats const, var and let the same
				function getAssignemnts(node)
				{
					if(node.type!=="VariableDeclaration")
						return {};
					
					for(let i=0;i<node.declarations.length;i++)
					{
						const d = node.declarations[i];
						if(!d.init || d.init.type!=="MemberExpression" || d.init.computed || d.init.property.type!=="Identifier" || d.init.object.type==="ThisExpression" || d.id.name!==d.init.property.name)
							continue;

						const assignmentObjText = helper.toText(d.init.object);
						if(!assignments.hasOwnProperty(assignmentObjText))
							assignments[assignmentObjText] = {varNames : [], nodes : []};
						
						assignments[assignmentObjText].varNames.push(d.id.name);
						assignments[assignmentObjText].nodes.push(d);
					}

					return assignments;
				}
			};
			return {Program : fun, BlockStatement : fun};
		}
	};
}
