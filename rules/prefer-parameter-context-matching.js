"use strict";
/*eslint no-unused-vars: [2, {"argsIgnorePattern" : "^helper$" }]*/

// Interactive AST explorer, VERY useful: https://astexplorer.net/

module.exports = function rule(helper)
{
	// NOTE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	// NOTE: I created this in Feb 2020, but it's not as precise as it needs to be in order to always turn on, there are flaws in how I do this. So I disabled it.
	// NOTE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	return {
		meta :
		{
			type : "suggestion",
			docs :
			{
				description : "Prefer doing function abc({a, b : z}) instead of function abc(o) { const a = o.a; const z = o.b; }",
				category    : "Node.js and CommonJS",
				recommended : false,
				url         : "https://telparia.com/eslint-plugin-sembiance/rules/prefer-parameter-context-matching"
			},
			schema : []
		},

		create(context)
		{
			function getParamNames(params)
			{
				return Array.from(params, param => helper.toText(param.type==="AssignmentPattern" ? param.left : param));
			}

			function checkFunction(target, funName, params, body)
			{
				const paramNames = getParamNames(params);
				if(paramNames.length<0 || !body || body.type!=="BlockStatement")
					return;
				
				const rewrittenObjects = {};
				function addRewrittenObject(paramName, r)
				{
					if(!rewrittenObjects.hasOwnProperty(paramName))
						rewrittenObjects[paramName] = [];

					rewrittenObjects[paramName].push(r);
				}

				Array.from(body.body).forEach(statement =>
				{
					if(statement.type!=="VariableDeclaration")
						return;

					Array.from(statement.declarations).forEach(node =>
					{
						if(node.type!=="VariableDeclarator" || !node.init)
							return;
						
						if(node.init.type==="MemberExpression" && paramNames.includes(helper.toText(node.init.object)))
							addRewrittenObject(helper.toText(node.init.object), {from : helper.toText(node.init.property), to : helper.toText(node.id)});
						else if(node.init.type==="LogicalExpression" && node.init.left.type==="MemberExpression" && paramNames.includes(helper.toText(node.init.left.object)))
							addRewrittenObject(helper.toText(node.init.left.object), {from : helper.toText(node.init.left.property), to : helper.toText(node.id), defaultValue : helper.toText(node.init.right)});
						else if(node.id && node.id.type==="ObjectPattern" && paramNames.includes(helper.toText(node.init)))
							node.id.properties.forEach(property => addRewrittenObject(helper.toText(node.init), {from : helper.toText(property.key), to : helper.toText(property.value)}));
					});
				});

				if(Object.keys(rewrittenObjects).length===0)
					return;
				
				const message = "Better rewritten as: " + funName + "(" + paramNames.map(paramName =>
				{
					const rewrittenObject = rewrittenObjects[paramName];
					if(!rewrittenObject)
						return paramName;

					let r = "{";
					r += rewrittenObject.map(rewrite =>
					{
						let subr = rewrite.from;
						if(rewrite.from!==rewrite.to)
							subr += " : " + rewrite.to;
						if(rewrite.defaultValue)
							subr += " = " + rewrite.defaultValue;
						return subr;
					}).join(", ");
					return r + "}";
				}).join(", ") + ")";

				context.report({node : target, message});
			}

			return {
				FunctionDeclaration(fun)
				{
					checkFunction(fun.id, helper.toText(fun.id), fun.params, fun.body);
				},

				Property(prop)
				{
					if(prop.kind!=="init" || prop.key.type!=="Identifier" || !prop.value || prop.value.type!=="FunctionExpression")
						return;
					
					checkFunction(prop.key, helper.toText(prop.key), prop.value.params, prop.value.body);
				},

				MethodDefinition(method)
				{
					checkFunction(method.key, helper.toText(method.key), method.value.params, method.value.body);
				},

				VariableDeclarator(varDec)
				{
					if(!varDec.init || varDec.init.type!=="CallExpression" || !varDec.init.callee || helper.toText(varDec.init.callee)!=="Object.assign")
						return;
					
					if(!varDec.init.arguments || varDec.init.arguments.length!==2 || varDec.init.arguments[0].type!=="CallExpression" || helper.toText(varDec.init.arguments[0].callee)!=="XU.clone")
						return;
					
					if(["FunctionExpression", "FunctionDeclaration"].includes(varDec.parent.parent.parent.type) && getParamNames(varDec.parent.parent.parent.params).includes(helper.toText(varDec.init.arguments[0].arguments[0])))
						context.report({node : varDec, message : "Instead of Object.assign() for defaults use function parameter context matching: function abc({a=true, b=5})"});
				}
			};
		}
	};
};
