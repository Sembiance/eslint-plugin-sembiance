"use strict";

const XU = require("@sembiance/xu"),
	glob = require("glob"),
	path = require("path");

// Interactive AST explorer, VERY useful: https://astexplorer.net/

const helper =
{
	toSource(context, v)
	{
		return context.getSourceCode().getText(v);
	},

	toText(v)
	{
		if(!v)
			return "";
			
		if(v.type==="BinaryExpression")			// (left operator right)		(eg. left || right)
			return "(" + helper.toText(v.left) + v.operator + helper.toText(v.right) + ")";
		
		if(v.type==="Identifier")				// name
			return v.name;
		
		if(v.type==="Literal")					// value
			return v.raw;

		if(v.type==="TemplateElement")			// value.raw
			return v.value.raw;

		if(v.type==="ThisExpression")			// this
			return "this";

		if(v.type==="BreakStatement")			// break;
			return "break;";

		if(v.type==="ContinueStatement")		// continue;
			return "continue;";

		if(v.type==="MemberExpression")			// object[property]   or  object.property
			return helper.toText(v.object) + (v.computed ? "[" : ".") + helper.toText(v.property) + (v.computed ? "]" : "");
		
		if(v.type==="CallExpression")			// callee(arguments, arguments)
			return helper.toText(v.callee) + "(" + v.arguments.map(arg => helper.toText(arg)).join(", ") + ")";
		
		if(v.type==="ExpressionStatement")		// expression;
			return helper.toText(v.expression) + ";";
		
		if(v.type==="ArrowFunctionExpression")	// (params, params) => body
			return ((v.params.length<2 ? "(" : "") + v.params.map(helper.toText).join(", ") + (v.params.length<2 ? ")" : "")) + " => " + helper.toText(v.body);
		
		if(v.type==="BlockStatement")			// { body }
			return "{" + Array.force(v.body).map(helper.toText).join(" ") + "}";
		
		if(v.type==="AssignmentExpression" || v.type==="LogicalExpression")	// left operator right
			return helper.toText(v.left) + " " + v.operator + " " + helper.toText(v.right);
		
		if(v.type==="IfStatement")				// if(test) consequent
			return "if(" + helper.toText(v.test) + ") " + helper.toText(v.consequent) + (v.alternate ? " else " + helper.toText(v.alternate) : "");
		
		if(v.type==="VariableDeclaration")		// kind declarations, declarations;		(eg const v = 1)
			return v.kind + " " + v.declarations.map(helper.toText).join(", ") + ";";
		
		if(v.type==="VariableDeclarator")		// id = init
			return helper.toText(v.id) + (v.init ? " = " + helper.toText(v.init) : "");

		if(v.type==="NewExpression")			// new callee(arguments, arguments)
			return "new " + helper.toText(v.callee) + "(" + v.arguments.map(helper.toText).join(", ") + ")";
		
		if(v.type==="ArrayExpression")			// [elements, elements]
			return "[" + v.elements.map(helper.toText).join(", ") + "]";
		
		if(v.type==="ObjectExpression")			// { properties, properties }
			return "{" + v.properties.map(helper.toText).join(", ") + "}";
		
		if(v.type==="Property")					// key : value
			return helper.toText(v.key) + " : " + helper.toText(v.value);
		
		if(v.type==="UnaryExpression")			// operator argument	(eg delete variable  or  !var)
			return v.operator + (v.operator==="delete" ? " " : "") + helper.toText(v.argument);
		
		if(v.type==="FunctionExpression" || v.type==="FunctionDeclaration")		// function id(params, params) body
			return "function" + (v.id ? (" " + helper.toText(v.id)) : "") + "(" + v.params.map(helper.toText).join(", ") + ") " + helper.toText(v.body);
		
		if(v.type==="ConditionalExpression")	// test ? consquent : alternate
			return helper.toText(v.test) + " ? " + helper.toText(v.consequent) + " : " + helper.toText(v.alternate);

		if(v.type==="ForStatement")				// for(init;test;update) body
			return "for(" + helper.toText(v.init) + ";" + helper.toText(v.test) + ";" + helper.toText(v.update) + ") " + helper.toText(v.body);
		
		if(v.type==="ForInStatement")			// for(left in right) body
			return "for(" + helper.toText(v.left) + " in " + helper.toText(v.right) + " " + helper.toText(v.body);

		if(v.type==="UpdateExpression")			// operatorargument  or  argumentoperator		(eg ++i  or  i++)
			return (v.prefix ? v.operator : "") + helper.toText(v.argument) + (!v.prefix ? v.operator : "");
		
		if(v.type==="ReturnStatement")			// return argument;
			return "return" + (v.argument ? (" " + helper.toText(v.argument)) : "") + ";";
		
		if(v.type==="SpreadElement" || v.type==="RestElement")		// ...argument
			return "..." + helper.toText(v.argument);
		
		if(v.type==="ObjectPattern")			// function abc({properties})
			return "{" + v.properties.map(property => (helper.toText(property.key)===helper.toText(property.value) ? helper.toText(property.key) : helper.toText(property))).join(", ") + "}";

		if(v.type==="AssignmentPattern")		// function abc({propName : left = right})
			return helper.toText(v.left) + " = " + helper.toText(v.right);
		
		if(v.type==="ArrayPattern")				// [elements]
			return "[" + v.elements.map(element => helper.toText(element));
		
		if(v.type==="ThrowStatement")			// throw argument
			return "throw " + helper.toText(v.argument);

		if(v.type==="TemplateLiteral")			// `quasis${expressions}quasis`
			return "`" + [...v.quasis.map(o => ({t : "quasi", o})), ...v.expressions.map(o => ({t : "expr", o}))].multiSort(n => n.o.start).map(n => (n.t==="expr" ? "${" : "") + helper.toText(n.o) + (n.t==="expr" ? "}" : "")).join("") + "`";
		
		if(v.type==="WhileStatement")			// while(text) body
			return "while(" + helper.toText(v.test) + ") " + helper.toText(v.body);
		
		if(v.type==="TryStatement")				// try block handler
			return "try " + helper.toText(v.block) + " " + helper.toText(v.handler);
		
		if(v.type==="CatchClause")				// catch(param) body
			return "catch(" + helper.toText(v.param) + ") " + helper.toText(v.body);
		
		if(v.type==="SequenceExpression")		// expressions, expressions
			return v.expressions.map(helper.toText).join(", ");
		
		throw new Error("Unsupported helper.toText type [" + v.type + "] at loc: " + JSON.stringify(v.loc));
	}
};

const rules = {};
glob.sync(path.join(__dirname, "rules", "*.js")).forEach(ruleFilename =>
{
	rules[path.basename(ruleFilename, path.extname(ruleFilename))] = require(ruleFilename)(helper);		// eslint-disable-line node/global-require
});

module.exports.rules = rules;
