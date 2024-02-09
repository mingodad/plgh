import * as std from "std";
import * as os from "os";

//print(typeof process);
//if(typeof std == "undefined") {
//}

const fname_list = [
	//"tree-sitter-abnf/src/grammar.json",
	//"tree-sitter-ada/src/grammar.json",
	//"tree-sitter-agda/src/grammar.json",
	//"tree-sitter-bash/src/grammar.json",
	//"tree-sitter-beancount/src/grammar.json",
	//"tree-sitter-c/src/grammar.json",
	//"tree-sitter-c-dad/src/grammar.json",
	//"tree-sitter-c-sharp/src/grammar.json",
	//"tree-sitter-carp/src/grammar.json",
	//"tree-sitter-clojure/src/grammar.json",
	//"tree-sitter-commonlisp/src/grammar.json",
	"tree-sitter-cpp/src/grammar.json",
	//"tree-sitter-css/src/grammar.json",
	//"tree-sitter-dart/src/grammar.json",
	//"tree-sitter-d/src/grammar.json",
	//"tree-sitter-dockerfile/src/grammar.json",
	//"tree-sitter-elm/src/grammar.json",
	//"tree-sitter-embedded-template/src/grammar.json",
	//"tree-sitter-eno/src/grammar.json",
	//"tree-sitter-erlang/src/grammar.json",
	//"tree-sitter-fennel/src/grammar.json",
	//"tree-sitter-fortran/src/grammar.json",
	//"tree-sitter-go/src/grammar.json",
	//"tree-sitter-graphql/src/grammar.json",
	//"tree-sitter-haskell/src/grammar.json",
	//"tree-sitter-html/src/grammar.json",
	//"tree-sitter-janet/src/grammar.json",
	//"tree-sitter-javascript/src/grammar.json",
	//"tree-sitter-java/src/grammar.json",
	//"tree-sitter-jsdoc/src/grammar.json",
	//"tree-sitter-julia/src/grammar.json",
	//"tree-sitter-kotlin/src/grammar.json",
	//"tree-sitter-lbnf/src/grammar.json",
	//"tree-sitter-lean/src/grammar.json",
	//"tree-sitter-ledger/src/grammar.json",
	//"tree-sitter-lp/src/grammar.json",
	//"tree-sitter-lua/src/grammar.json",
	//"tree-sitter-markdown/src/grammar.json",
	//"tree-sitter-menhir/src/grammar.json",
	//"tree-sitter-minizinc/src/grammar.json",
	//"tree-sitter-nim/src/grammar.json",
	//"tree-sitter-nim2/src/grammar.json",
	//"tree-sitter-nix/src/grammar.json",
	//"tree-sitter-ocaml/ocaml/src/grammar.json",
	//"tree-sitter-perl/src/grammar.json",
	//"tree-sitter-php/src/grammar.json",
	//"tree-sitter-powershell/src/grammar.json",
	//"tree-sitter-prolog/src/grammar.json",
	//"tree-sitter-python/src/grammar.json",
	//"tree-sitter-ql/src/grammar.json",
	//"tree-sitter-r/src/grammar.json",
	//"tree-sitter-reason/src/grammar.json",
	//"tree-sitter-regex/src/grammar.json",
	//"tree-sitter-ruby/src/grammar.json",
	//"tree-sitter-rust/src/grammar.json",
	//"tree-sitter-scala/src/grammar.json",
	//"tree-sitter-sexp/src/grammar.json",
	//"tree-sitter-sml/src/grammar.json",
	//"tree-sitter-souffle/src/grammar.json",
	//"tree-sitter-sourcepawn/src/grammar.json",
	//"tree-sitter-sparql/src/grammar.json",
	//"tree-sitter-stan/src/grammar.json",
	//"tree-sitter-svelte/src/grammar.json",
	//"tree-sitter-systemrdl/src/grammar.json",
	//"tree-sitter-swift/src/grammar.json",
	//"tree-sitter-tablegen/src/grammar.json",
	//"tree-sitter-teal/src/grammar.json",
	//"tree-sitter-tlaplus/src/grammar.json",
	//"tree-sitter-toml/src/grammar.json",
	//"tree-sitter-turtle/src/grammar.json",
	//"tree-sitter-typescript/typescript/src/grammar.json",
	//"tree-sitter-verilog/src/grammar.json",
	//"tree-sitter-vhdl/src/grammar.json",
	//"tree-sitter-vue/src/grammar.json",
	////"tree-sitter-wasm/wast/src/grammar.json",
	//"tree-sitter-yaml/src/grammar.json",
	//"tree-sitter-zig/src/grammar.json",
	//"minizinc.json",
];

//const fname_base = "A_grammars/tree-sitter/";
const fname_base = "../tree-sitter/";

const INDENT = "\t";

function pattern2str(pattern) {
	return "/" + pattern.replace(/\\\\/g, "\\").replace(/\\"/g, '"') + "/";
}

function pattern2ebnf(pattern) {
	let inClass = false;
	let inQuote = false;
	let hasDQ = false;
	let hasSQ = false;
	let imax = pattern.length;
	let quote = "'";
	let inString = "";
	let ch = "";
	var result = "";
	var chAt = function(idx) {if(idx < imax) return pattern[idx]; return null;}
	var addCh = function(ach) {if(inClass) result += ach; else inString += ach;}
	var checkAddStr = function() {
			if(inString.length > 0) {
				if(hasSQ) quote = '"';
				let new_str = quote + inString + quote; inString = "";
				result += new_str
				if(hasSQ) quote = "'";
			}
		}
	var addClass = function(aclass) {if(inClass) result += aclass; else { checkAddStr(); result += '[' + aclass + ']';}}
	for (let i = 0; i < imax; ++i) {
		ch = pattern[i];
		//print(ch);
		switch(ch) {
			case '[': {
				checkAddStr();
				result += ch; inClass = true;
			}
			break;
			case ']': {
				result += ch; inClass = false;
			}
			break;
			case '|':
			case '(': {
				checkAddStr();
				result += ch;
			}
			break;
			case ')': {
				checkAddStr();
				result += ch;
			}
			break;
			case '#': {
				if(inClass) result += "#x23";
				else addCh(ch);
			}
			break;
			case '\t':
				if(inClass) result += "#x09";
				else addCh("\\t");
			break;
			case '\n':
				if(inClass) result += "#x0A";
				else addCh("\\n");
			break;
			case '\r':
				if(inClass) result += "#x0D";
				else addCh("\\r");
			break;
			case '\\': {
				let i2 = i+1;
				let ch2 = chAt(i2);
				if(ch2 != null) {
					//print(ch, ch2);
					switch(ch2) {
						case '[': addCh("#x5B"); i=i2; break;
						case ']': addCh("#x5D"); i=i2; break;
						case 'a': addCh("#x07"); i=i2; break;
						case 'b': addCh("#x08"); i=i2; break;
						case 't': addCh("#x09"); i=i2; break;
						case 'n': addCh("#x0A"); i=i2; break;
						case 'v': addCh("#x0B"); i=i2; break;
						case 'f': addCh("#x0C"); i=i2; break;
						case 'r': addCh("#x0D"); i=i2; break;
						case '\\': addCh("\\"); i=i2; break;
						case 's': addClass(" #x09#x0A#x0B#x0C#x0D");i=i2; break;
						case 'd': addClass("0-9");i=i2; break;
						case 'w': addClass("a-zA-Z_");i=i2; break;
						case '-': addCh("#x2D"); ++i2; break;
						case '.': ++i2; break;
						case 'u': {
							if( chAt(i2+2) == '{') {
								i2 += 3;
								addCh("#x");
								for (; i2 < imax; ++i2) {
									ch2 = chAt(i2);
									if(ch2 == '}') break;
									addCh(ch2);
								}

							}
							else {addCh("\\u"); i=i2;}
						}
						break;
						default:
							addCh(ch);
					}
				}
			}
			break;
			case '*':
			case '+':
			case '?': {
				checkAddStr();
				result += ch;
			}
			break;
			case '"': hasDQ = true; addCh(ch); break;
			case "'": hasSQ = true; addCh(ch); break;
			default:
				addCh(ch);
			break;
		}
	}
	checkAddStr();
	return result;
}

function extractPattern(json) {
	//"type": "PATTERN",
	//"value": "\\$[a-zA-Z\\u{80}-\\u{10FFFF}][0-9a-zA-Z_\\u{80}-\\u{10FFFF}]*"
	const regexp = /"type": "PATTERN",\s+"value": ([^\n]+)/g;
	let match;
	while ((match = regexp.exec(json)) !== null) {
		print(pattern2str(match[1].slice(1,-1)));
		print(pattern2ebnf(match[1].slice(1,-1)));
	}
}

function parseJsonGrammar(fname, rule_sep, choice_sep, rule_terminator, isEbnfRR)
{
	let fd = std.open(fname_base + fname, "r");
	let json;
	try {
		json = fd.readAsString();
	}
	catch(e) {
		print(e);
		return;
	}
	fd.close();

	let out_fname = fname.replace(/\/.+/, ".ebnf0");
	//print(out_fname); return;
	//fd = std.open(out_fname, "w");
	fd = std.open("/dev/stdout", "w"); //std.stdout;

	json = JSON.parse(json);
	//print(json);
	fd.printf("//\n// From %s\n//\n", fname);
	fd.printf("//\n// EBNF to generate railroad diagram at https://www.bottlecaps.de/rr/ui\n//\n\n");

	let isRuleOptional = function(rule) {
		let isChoice = rule.type == "CHOICE";
		let isOptional = isChoice && rule.members.length == 2 && rule.members[1].type == "BLANK";
		return isOptional;
	};

	let manageRule = function (name, rule, depth) {
		//print(name, rule.type); //, typeof rule);
		switch(rule.type)
		{
			case "ALIAS": {
				let needGroup = rule.content.hasOwnProperty('members');
				let isOptional = isRuleOptional(rule.content);
				if(isOptional && !rule.content.members[0].hasOwnProperty('members')) {
					needGroup = false;
				}
				if(needGroup) fd.printf(" (");
				manageRule(rule.type, rule.content, depth+1);
				if(needGroup) fd.printf(" )");
				if(isOptional) fd.printf("?");
			}
			break;

			case "BLANK":
				fd.printf(" /*empty*/");
			break;

			case "CHOICE": {
				let members = rule.members;
				let isOptional = isRuleOptional(rule);
				if(isOptional) {
					manageRule(rule.type, members[0], depth+1);
				}
				else
				{
					//fd.printf("=== %d : %d : %d ===", mcount, depth, mcount > 1 && depth);
					for(var idx in members) {
						let child = members[idx];
						let isChildChoice = child.type == "CHOICE";
						if(idx > 0) {
							if((depth <1)) {
								fd.printf("\n%s%s", INDENT, choice_sep);
								//fd.printf("\n\t|%d:%d:%d:%d:x", idx, mcount, scount, depth);
							}
							else
							{
								fd.printf(" %s", choice_sep);
								//fd.printf(" |%d:%d:%d:%d:x", idx, mcount, scount, depth);
							}
						}
						manageRule(rule.type, child, (isChildChoice ? depth : depth+1));
					}
				}
			}
			break;

			case "FIELD": {
				//print(rule.type, rule.name);
				let needGroup = rule.content.hasOwnProperty('members');
				let isOptional = isRuleOptional(rule.content);
				if(isOptional && !rule.content.members[0].hasOwnProperty('members')) {
					needGroup = false;
				}
				if(needGroup) fd.printf(" (");
				manageRule(rule.type, rule.content, depth+1);
				if(needGroup) fd.printf(" )");
				if(isOptional) fd.printf("?");
			}
			break;

			case "PATTERN": {
				let value =  pattern2ebnf(rule.value);
				fd.printf(" %s", value);
			}
			break;

			case "PREC":
			case "PREC_DYNAMIC":
			case "PREC_LEFT":
			case "PREC_RIGHT":
				//fd.printf("  ( ");
				manageRule(rule.type, rule.content, depth+1);
				//fd.printf(" ) ");
			break;

			case "REPEAT": {
				let needGroup = rule.content.hasOwnProperty('members');
				if(needGroup) fd.printf(" (");
				manageRule(rule.type, rule.content, 1, depth+1);
				if(needGroup) fd.printf(" )");
				fd.printf("*");
			}
			break;

			case "REPEAT1": {
				let needGroup = rule.content.hasOwnProperty('members');
				if(needGroup) fd.printf(" (");
				manageRule(rule.type, rule.content, depth+1);
				if(needGroup) fd.printf(" )");
				fd.printf("+");
			}
			break;

			case "SEQ": {
				let members = rule.members;
				//fd.printf("=== %d : %d ===", mcount, depth);
				for(var idx in members) {
					let child = members[idx];
					let isChoice = child.type == "CHOICE";
					let needGroup = isChoice;
					let isOptional = isRuleOptional(child);
					if(isOptional && !child.members[0].hasOwnProperty('members')) {
						needGroup = false;
					}
					if(needGroup) fd.printf(" (");
					manageRule(rule.type, child, depth+1);
					if(needGroup) fd.printf(" )");
					if(isOptional) fd.printf("?");
				}
			}
			break;

			case "STRING": {
				let value = rule.value;
				//print(rule.type, value);
				switch(value) {
					case "\0": fd.printf(" '\\0' "); break;
					case "\b": fd.printf(" '\\b' "); break;
					case "\f": fd.printf(" '\\f' "); break;
					case "\n": fd.printf(" '\\n' "); break;
					case "\r": fd.printf(" '\\r' "); break;
					case "\t": fd.printf(" '\\t' "); break;
					case "\v": fd.printf(" '\\v' "); break;
					case "\\": fd.printf(" '\\\\' "); break;
					case "'": fd.printf(" \"'\" "); break;
					case "\"": fd.printf(" '\"' "); break;
					default:
						//value = value.replaceAll(/\\/g, "\\\\");
						value = value.replaceAll(/\t/g, "\\t"); //order matter
						value = value.replaceAll(/\n/g, "\\n"); //order matter
						value = value.replaceAll(/\r/g, "\\r"); //order matter
						if(value.indexOf("'") >= 0) fd.printf(" \"%s\"", value);
						else fd.printf(" '%s'", value);
				}
			}
			break;

			case "SYMBOL":
				//print(rule.type, rule.name);
				fd.printf(" %s", rule.name);
			break;

			case "IMMEDIATE_TOKEN": {
				let needGroup = rule.content.hasOwnProperty('members');
				if(needGroup) fd.printf(" (");
				manageRule(rule.type, rule.content, depth+1);
				if(needGroup) fd.printf(" )");
			}
			break;

			case "TOKEN": {
				let needGroup = rule.content.hasOwnProperty('members');
				if(needGroup) fd.printf(" (");
				manageRule(rule.type, rule.content, depth+1);
				if(needGroup) fd.printf(" )");
			}
			break;

			//case "IMMEDIATE_TOKEN":

			default:
				throw("Unknown rule type: " + rule.type);
		}
	}

	let rules = json.rules;
	for(var idx in rules) {
		let rule = rules[idx];
		//print(rule);
		fd.printf("%s %s\n%s",  idx, rule_sep, INDENT);
		manageRule(idx, rule, 0);
		fd.printf("%s\n\n", rule_terminator);
	}
	fd.close();
}

for(let idx in fname_list)
{
	let fname = fname_list[idx];
	print(fname);
	parseJsonGrammar(fname, "::=", "|", "", true);
	//parseJsonGrammar(fname, ":\n\t", "\n\t|", "\n\t;\n", true);
	//parseJsonGrammar(fname, "<-", "/", false);
}
