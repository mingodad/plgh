/*
This script to convert all tree-sitter grammars shown in https://mingodad.github.io/lua-wasm-playground/
*/

import * as std from "std";
import * as os from "os";

//print(typeof process);
//if(typeof std == "undefined") {
//}

const fname_list = [
	//"test/fixtures/test_grammars/lexical_conflicts_due_to_state_merging/grammar.json",
	//"test/fixtures/test_grammars/named_precedences/grammar.json",
	//"test/fixtures/test_grammars/named_rule_aliased_as_anonymous/grammar.json",
	//"test/fixtures/test_grammars/nested_inlined_rules/grammar.json",
	//"test/fixtures/test_grammars/partially_resolved_conflict/grammar.json",
	//"test/fixtures/test_grammars/precedence_on_single_child_missing/grammar.json",
	//"test/fixtures/test_grammars/precedence_on_single_child_negative/grammar.json",
	//"test/fixtures/test_grammars/precedence_on_single_child_positive/grammar.json",
	//"test/fixtures/test_grammars/precedence_on_subsequence/grammar.json",
	//"test/fixtures/test_grammars/precedence_on_token/grammar.json",
	//"test/fixtures/test_grammars/readme_grammar/grammar.json",
	//"test/fixtures/test_grammars/start_rule_is_blank/grammar.json",
	//"test/fixtures/test_grammars/start_rule_is_token/grammar.json",
	//"test/fixtures/test_grammars/unicode_classes/grammar.json",
	//"test/fixtures/test_grammars/unused_rules/grammar.json",
	//"test/fixtures/test_grammars/uses_current_column/grammar.json",
	//"tree-sitter-abnf/src/grammar.json",
	//"tree-sitter-ada/src/grammar.json",
	//"tree-sitter-agda/src/grammar.json",
	//"tree-sitter-angular/src/grammar.json",
	//"tree-sitter-awk/src/grammar.json",
	//"tree-sitter-bash/src/grammar.json",
	//"tree-sitter-beancount2/src/grammar.json",
	//"tree-sitter-beancount/src/grammar.json",
	//"tree-sitter-bison/src/grammar.json",
	//"tree-sitter-c3-2/src/grammar.json",
	//"tree-sitter-c3/src/grammar.json",
	//"tree-sitter-carp/src/grammar.json",
	//"tree-sitter-c-dad/src/grammar.json",
	//"tree-sitter-c/src/grammar.json",
	//"tree-sitter-clojure/src/grammar.json",
	//"tree-sitter-cmake/src/grammar.json",
	//"tree-sitter-commonlisp/src/grammar.json",
	//"tree-sitter-cpp-dad/src/grammar.json",
	//"tree-sitter-cpp/src/grammar.json",
	//"tree-sitter-c-sharp/src/grammar.json",
	//"tree-sitter-c/src/grammar.json",
	//"tree-sitter-css/src/grammar.json",
	//"tree-sitter-cuda/src/grammar.json",
	//"tree-sitter-dart/src/grammar.json",
	//"tree-sitter-dockerfile/src/grammar.json",
	//"tree-sitter-dot/src/grammar.json",
	//"tree-sitter-d/src/grammar.json",
	//"tree-sitter-ebnf-generator-dad/examples/handwritten-scala/src/grammar.json",
	//"tree-sitter-ebnf-generator-dad/examples/lua/src/grammar.json",
	//"tree-sitter-ebnf-generator-dad/examples/scala/src/grammar.json",
	//"tree-sitter-ebnf-generator-dad/examples/test/src/grammar.json",
	//"tree-sitter-ebnf-generator-dad/src/js/test/src/grammar.json",
	//"tree-sitter-ebnf-generator/examples/handwritten-scala/src/grammar.json",
	//"tree-sitter-ebnf-generator/examples/lua/src/grammar.json",
	//"tree-sitter-ebnf-generator/examples/scala/src/grammar.json",
	//"tree-sitter-ebnf-generator/examples/test/src/grammar.json",
	//"tree-sitter-ebnf-generator/src/js/test/src/grammar.json",
	//"tree-sitter-elisp/src/grammar.json",
	//"tree-sitter-elixir/src/grammar.json",
	//"tree-sitter-elm/src/grammar.json",
	//"tree-sitter-embedded-template/src/grammar.json",
	//"tree-sitter-eno/src/grammar.json",
	//"tree-sitter-erlang/src/grammar.json",
	//"tree-sitter-fennel/src/grammar.json",
	//"tree-sitter-fortran/src/grammar.json",
	//"tree-sitter-fsharp/fsharp/src/grammar.json",
	//"tree-sitter-gleam/src/grammar.json",
	//"tree-sitter-glsl/src/grammar.json",
	//"tree-sitter-go/src/grammar.json",
	//"tree-sitter-graphql/src/grammar.json",
	//"tree-sitter-hack/src/grammar.json",
	//"tree-sitter-hare/src/grammar.json",
	//"tree-sitter-haskell/src/grammar.json",
	//"tree-sitter-haxe/src/grammar.json",
	//"tree-sitter-hcl/dialects/terraform/src/grammar.json",
	//"tree-sitter-hcl/src/grammar.json",
	//"tree-sitter-html/src/grammar.json",
	//"tree-sitter-janet/src/grammar.json",
	//"tree-sitter-javascript/src/grammar.json",
	//"tree-sitter-java/src/grammar.json",
	//"tree-sitter-jsdoc/src/grammar.json",
	//"tree-sitter-json5/src/grammar.json",
	//"tree-sitter-julia/src/grammar.json",
	//"tree-sitter-kotlin/src/grammar.json",
	//"tree-sitter-lbnf/src/grammar.json",
	//"tree-sitter-latex/src/grammar.json",
	//"tree-sitter-ld/src/grammar.json",
	//"tree-sitter-lean/src/grammar.json",
	//"tree-sitter-ledger/src/grammar.json",
	//"tree-sitter-linkerscript/src/grammar.json",
	//"tree-sitter-lp/src/grammar.json",
	//"tree-sitter-lua/src/grammar.json",
	//"tree-sitter-make/src/grammar.json",
	//"tree-sitter-markdown/src/grammar.json",
	//"tree-sitter-menhir/src/grammar.json",
	//"tree-sitter-minizinc/src/grammar.json",
	//"tree-sitter-nim2/src/grammar.json",
	//"tree-sitter-nim/src/grammar.json",
	//"tree-sitter-nix/src/grammar.json",
	//"tree-sitter-objc/src/grammar.json",
	//"tree-sitter-ocaml/grammars/ocaml/src/grammar.json",
	//"tree-sitter-ocaml/ocaml/src/grammar.json",
	//"tree-sitter-perl/src/grammar.json",
	//"tree-sitter-php/php_only/src/grammar.json",
	//"tree-sitter-php/php/src/grammar.json",
	//"tree-sitter-postgresql/src/grammar.json",
	//"tree-sitter-powershell/src/grammar.json",
	//"tree-sitter-prolog/src/grammar.json",
	//"tree-sitter-python/src/grammar.json",
	//"tree-sitter-ql/src/grammar.json",
	//"tree-sitter-quakec/src/grammar.json",
	//"tree-sitter-reason/src/grammar.json",
	//"tree-sitter-regex/src/grammar.json",
	//"tree-sitter-r/src/grammar.json",
	//"tree-sitter-ruby/src/grammar.json",
	//"tree-sitter-rust/src/grammar.json",
	//"tree-sitter-scala/src/grammar.json",
	//"tree-sitter-scheme/src/grammar.json",
	//"tree-sitter-sexp/src/grammar.json",
	//"tree-sitter-sml/src/grammar.json",
	//"tree-sitter-souffle/src/grammar.json",
	//"tree-sitter-sourcepawn/src/grammar.json",
	//"tree-sitter-sparql/src/grammar.json",
	//"tree-sitter-sqlite-dad/src/grammar.json",
	//"tree-sitter-sqlite/src/grammar.json",
	//"tree-sitter-sql/src/grammar.json",
	//"tree-sitter-squirrel/src/grammar.json",
	//"tree-sitter-stan/src/grammar.json",
	//"tree-sitter-svelte/src/grammar.json",
	//"tree-sitter-swift/src/grammar.json",
	//"tree-sitter-systemrdl/src/grammar.json",
	//"tree-sitter-tablegen/src/grammar.json",
	//"tree-sitter-teal/src/grammar.json",
	//"tree-sitter-tlaplus/src/grammar.json",
	//"tree-sitter-toml/src/grammar.json",
	//"tree-sitter-turtle/src/grammar.json",
	//"tree-sitter-typescript/tsx/src/grammar.json",
	//"tree-sitter-typescript/typescript/src/grammar.json",
	//"tree-sitter-verilog/src/grammar.json",
	//"tree-sitter-vhdl/src/grammar.json",
	//"v-analyzer/tree_sitter_v/src/grammar.json",
	//"tree-sitter-v/src/grammar.json",
	//"tree-sitter-vim/src/grammar.json",
	//"tree-sitter-vimdoc/src/grammar.json",
	//"tree-sitter-vue/src/grammar.json",
	//"tree-sitter-wasm/wast/src/grammar.json",
	//"tree-sitter-wasm/wat/src/grammar.json",
	//"tree-sitter-wgsl/src/grammar.json",
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
	//let fd = std.open(fname_base + fname, "r");
	let fd = std.open(fname, "r");
	let json;
	try {
		json = fd.readAsString();
	}
	catch(e) {
		print(e);
		return;
	}
	fd.close();

	let out_fname = fname.replace(/\/.+/, ".ebnf");
	//print(out_fname); return;
	//fd = std.open(out_fname, "w");
	fd = std.out

	json = JSON.parse(json);
	//print(json);
	fd.printf("; From %s\n", fname);
	fd.printf("; EBNF to generate grammar.js at\n");
	fd.printf(";      https://mingodad.github.io/lua-wasm-playground/\n");
	fd.printf(";      based on https://github.com/eatkins/tree-sitter-ebnf-generator\n");
	fd.printf(";      see also https://mingodad.github.io/plgh/json2ebnf.html\n\n");

	let isRuleOptional = function(rule) {
		let isChoice = rule.type == "CHOICE";
		let isOptional = isChoice && rule.members.length == 2 && rule.members[1].type == "BLANK";
		return isOptional;
	};

	let escapeString = function(str) {
		let str2 = str.replaceAll("\\", "\\\\");
		str2 = str2.replaceAll("\t", "\\t");
		str2 = str2.replaceAll("\r", "\\r");
		str2 = str2.replaceAll("\n", "\\n");
		str2 = str2.replaceAll("\f", "\\f");
		return str2;
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
				if(rule.value == '"') fd.printf(" -> '%s'", rule.value);
				else {
					if(rule.named) fd.printf(" -> %s", rule.value)
					else {
						let evalue = rule.value.replace("\\", "\\\\");
						if(evalue == rule.value && evalue.indexOf('"') >= 0) {
							fd.printf(" -> '%s'", evalue);
						} else {
							fd.printf(" -> \"%s\"", evalue);
						}
					}
				}
			}
			break;

			case "BLANK":
				fd.printf(" /*empty*/");
			break;

			case "CHOICE": {
				let members = rule.members;
				let isOptional = isRuleOptional(rule);
				if(isOptional) {
					switch(members[0].type) {
						case "FIELD":
						case "ALIAS":
							fd.printf(" (");
							manageRule(rule.type, members[0], depth+1);
							fd.printf(" )");
						break;
						default:
							manageRule(rule.type, members[0], depth+1);
					}
				}
				else
				{
					//fd.printf("=== %d : %d : %d ===", mcount, depth, mcount > 1 && depth);
					for(var idx in members) {
						let child = members[idx];
						let isChildChoice = child.type == "CHOICE";
						let isOptional = isRuleOptional(child);
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
						if(isOptional) fd.printf("?");
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
				if(rule.content.type == "ALIAS" || rule.content.type == "FIELD") needGroup = true;
				if(needGroup) fd.printf(" (");
				manageRule(rule.type, rule.content, depth+1);
				if(needGroup) fd.printf(" )");
				if(isOptional) fd.printf("?");
				fd.printf(":%s", rule.name);
			}
			break;

			case "PATTERN": {
				let value =  rule.value.replaceAll("\t", "\\t")
								  .replaceAll("\r", "\\r")
								  .replaceAll("\n", "\\n")
								  .replaceAll("\f", "\\f");
				fd.printf(" /%s/", value);
				if(rule.flags) fd.printf("%s", rule.flags);
			}
			break;

			case "PREC": {
				fd.printf("  %s( ", rule.value);
				manageRule(rule.type, rule.content, depth+1);
				fd.printf(" ) ");
			}
			break;
			case "PREC_DYNAMIC": {
				fd.printf("  ~%s( ", rule.value);
				manageRule(rule.type, rule.content, depth+1);
				fd.printf(" ) ");
			}
			break;
			case "PREC_LEFT": {
				fd.printf("  <%s( ", rule.value);
				manageRule(rule.type, rule.content, depth+1);
				fd.printf(" ) ");
			}
			break;
			case "PREC_RIGHT": {
				fd.printf("  >%s( ", rule.value);
				manageRule(rule.type, rule.content, depth+1);
				fd.printf(" ) ");
			}
			break;

			case "REPEAT": {
				let needGroup = rule.content.hasOwnProperty('members');
				if(rule.content.type == "ALIAS" || rule.content.type == "FIELD") needGroup = true;
				if(needGroup) fd.printf(" (");
				manageRule(rule.type, rule.content, 1, depth+1);
				if(needGroup) fd.printf(" )");
				fd.printf("*");
			}
			break;

			case "REPEAT1": {
				let needGroup = rule.content.hasOwnProperty('members');
				if(rule.content.type == "ALIAS" || rule.content.type == "FIELD") needGroup = true;
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
					case "\0": fd.printf(" '\\0'"); break;
					case "\b": fd.printf(" '\\b'"); break;
					case "\f": fd.printf(" '\\f'"); break;
					case "\n": fd.printf(" '\\n'"); break;
					case "\r": fd.printf(" '\\r'"); break;
					case "\t": fd.printf(" '\\t'"); break;
					case "\v": fd.printf(" '\\v'"); break;
					case "\\": fd.printf(" '\\\\'"); break;
					case "'": fd.printf(" \"'\""); break;
					case "\"": fd.printf(" '\"'"); break;
					default:
						value = value.replaceAll(/\\/g, "\\\\");
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
				fd.printf(" !(");
				manageRule(rule.type, rule.content, depth+1);
				fd.printf(" )");
			}
			break;

			case "TOKEN": {
				let needGroup = rule.content.hasOwnProperty('members');
				fd.printf(" @(");
				manageRule(rule.type, rule.content, depth+1);
				fd.printf(" )");
			}
			break;

			//case "IMMEDIATE_TOKEN":

			default:
				throw("Unknown rule type: " + rule.type);
		}
	}

	if( json.externals && json.externals.length ) {
		fd.printf("\nexternals ::= {");
		for(var idx in json.externals) {
			let elm = json.externals[idx];
			switch(elm.type) {
				case "PATTERN":
					fd.printf("\n\t/%s/",  elm.value);
				break;
				case "STRING":
					fd.printf("\n\t'%s'",  escapeString(elm.value));
				break;
				case "SYMBOL":
					fd.printf("\n\t%s",  elm.name);
				break;
				default:
					fd.printf("\n\t??:%s",  elm.type);
			}
		}
		fd.printf("\n\t}\n");
	}

	if( json.extras && json.extras.length ) {
		fd.printf("\nextras ::= {");
		for(var idx in json.extras) {
			let elm =  json.extras[idx];
			switch(elm.type) {
				case "PATTERN":
					fd.printf("\n\t/%s/",  elm.value);
					if(elm.flags) fd.printf("%s", elm.flags);
				break;
				case "SYMBOL":
					fd.printf("\n\t%s",  elm.name);
				break;
				case "STRING":
					fd.printf("\n\t'%s'",  escapeString(elm.value));
				break;
				case "ALIAS":
					fd.printf("\n\t");
					manageRule(elm.type, elm, 0);
				break;
				default:
					fd.printf("\n\t??:%s",  elm.type);
			}
		}
		fd.printf("\n\t}\n");
	}

	if( json.precedences && json.precedences.length ) {
		fd.printf("\nprecedences ::= {");
		let high_prec = json.precedences.length;
		for(var idx in json.precedences) {
			let elm =  json.precedences[idx];
			fd.printf("\n\t;;%0.2d\n\t{", high_prec--);
			for(var idx2 in elm) {
				let elm2 = elm[idx2];
				switch(elm2.type) {
					case "STRING":
						fd.printf(" '%s'",  escapeString(elm2.value));
					break;
					case "SYMBOL":
						fd.printf(" %s",  elm2.name);
					break;
					default:
						fd.printf("\n\t??:%s",  elm2.type);
				}
			}
			fd.printf(" }");
		}
		fd.printf("\n\t}\n");
	}

	if( json.supertypes && json.supertypes.length ) {
		fd.printf("\nsupertypes ::= {");
		for(var idx in json.supertypes) {
			fd.printf("\n\t%s",   json.supertypes[idx]);
		}
		fd.printf("\n\t}\n");
	}

	if( json.inline && json.inline.length ) {
		fd.printf("\ninline ::= {");
		for(var idx in json.inline) {
			fd.printf("\n\t%s",   json.inline[idx]);
		}
		fd.printf("\n\t}\n");
	}

	if( json.conflicts && json.conflicts.length ) {
		fd.printf("\nconflicts ::= {");
		for(var idx in json.conflicts) {
			fd.printf("\n\t{");
			let conflict = json.conflicts[idx];
			for(var idx2 in conflict) {
				fd.printf(" %s",   conflict[idx2]);
			}
			fd.printf(" }");
		}
		fd.printf("\n\t}\n");
	}

	if( json.word ) {
		fd.printf("\nword ::= %s\n", json.word);
	}

	let rules = json.rules;
	fd.printf("\nrules:\n\n");
	for(var idx in rules) {
		let rule = rules[idx];
		//print(rule);
		fd.printf("  %s %s",  idx, rule_sep);
		manageRule(idx, rule, 0);
		fd.printf("%s\n\n", rule_terminator);
	}
	fd.close();
}

/*
for(let idx in fname_list)
{
	let fname = fname_list[idx];
	print(fname);
	parseJsonGrammar(fname, "::=", "|", "", true);
	//parseJsonGrammar(fname, ":\n\t", "\n\t|", "\n\t;\n", true);
	//parseJsonGrammar(fname, "<-", "/", false);
}
*/

if(scriptArgs.length > 1) {
	let fname = scriptArgs[1];
	//print(fname);
	parseJsonGrammar(fname, "::=", "|", "", true);
}
else {
	std.printf("usage: %s grammar_json_file_name\n", scriptArgs[0]);
}