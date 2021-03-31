import * as std from "std";
import * as os from "os";

//print(typeof process);
//if(typeof std == "undefined") {
//}

const fname_list = [
	"tree-sitter-abnf/src/grammar.json",
	"tree-sitter-agda/src/grammar.json",
	"tree-sitter-bash/src/grammar.json",
	"tree-sitter-beancount/src/grammar.json",
	"tree-sitter-c/src/grammar.json",
	"tree-sitter-c-sharp/src/grammar.json",
	"tree-sitter-carp/src/grammar.json",
	"tree-sitter-clojure/src/grammar.json",
	"tree-sitter-cpp/src/grammar.json",
	"tree-sitter-css/src/grammar.json",
	"tree-sitter-dart/src/grammar.json",
	"tree-sitter-elm/src/grammar.json",
	"tree-sitter-embedded-template/src/grammar.json",
	"tree-sitter-eno/src/grammar.json",
	"tree-sitter-erlang/src/grammar.json",
	"tree-sitter-fennel/src/grammar.json",
	"tree-sitter-fortran/src/grammar.json",
	"tree-sitter-go/src/grammar.json",
	"tree-sitter-graphql/src/grammar.json",
	"tree-sitter-haskell/src/grammar.json",
	"tree-sitter-html/src/grammar.json",
	"tree-sitter-janet/src/grammar.json",
	"tree-sitter-javascript/src/grammar.json",
	"tree-sitter-java/src/grammar.json",
	"tree-sitter-jsdoc/src/grammar.json",
	"tree-sitter-julia/src/grammar.json",
	"tree-sitter-kotlin/src/grammar.json",
	"tree-sitter-lbnf/src/grammar.json",
	"tree-sitter-lean/src/grammar.json",
	"tree-sitter-ledger/src/grammar.json",
	"tree-sitter-lp/src/grammar.json",
	"tree-sitter-lua/src/grammar.json",
	"tree-sitter-markdown/src/grammar.json",
	"tree-sitter-menhir/src/grammar.json",
	"tree-sitter-minizinc/src/grammar.json",
	"tree-sitter-nim/src/grammar.json",
	"tree-sitter-nix/src/grammar.json",
	"tree-sitter-ocaml/ocaml/src/grammar.json",
	"tree-sitter-perl/src/grammar.json",
	"tree-sitter-php/src/grammar.json",
	"tree-sitter-powershell/src/grammar.json",
	"tree-sitter-prolog/src/grammar.json",
	"tree-sitter-python/src/grammar.json",
	"tree-sitter-ql/src/grammar.json",
	"tree-sitter-r/src/grammar.json",
	"tree-sitter-reason/src/grammar.json",
	"tree-sitter-regex/src/grammar.json",
	"tree-sitter-ruby/src/grammar.json",
	"tree-sitter-rust/src/grammar.json",
	"tree-sitter-scala/src/grammar.json",
	"tree-sitter-sexp/src/grammar.json",
	"tree-sitter-sml/src/grammar.json",
	"tree-sitter-sourcepawn/src/grammar.json",
	"tree-sitter-sparql/src/grammar.json",
	"tree-sitter-stan/src/grammar.json",
	"tree-sitter-svelte/src/grammar.json",
	"tree-sitter-systemrdl/src/grammar.json",
	"tree-sitter-swift/src/grammar.json",
	"tree-sitter-teal/src/grammar.json",
	"tree-sitter-toml/src/grammar.json",
	"tree-sitter-turtle/src/grammar.json",
	"tree-sitter-typescript/typescript/src/grammar.json",
	"tree-sitter-verilog/src/grammar.json",
	"tree-sitter-vhdl/src/grammar.json",
	"tree-sitter-vue/src/grammar.json",
	//"tree-sitter-wasm/wast/src/grammar.json",
	"tree-sitter-yaml/src/grammar.json",
	"tree-sitter-zig/src/grammar.json",
];

const fname_base = "A_grammars/tree-sitter/";

function parseJsonGrammar(fname)
{
	let fd = std.open(fname_base + fname, "r");
	let json = fd.readAsString();
	fd.close();

	let out_fname = fname.replace(/\/.+/, ".ebnf0");
	//print(out_fname); return;
	fd = std.open(out_fname, "w");

	json = JSON.parse(json);
	print(json);

	let manageRule = function (name, rule) {
		//print(name, rule.type); //, typeof rule);
		switch(rule.type)
		{
			case "ALIAS":
				fd.printf(" ( ");
				manageRule(rule.type, rule.content);
				fd.printf(" ) ");
			break;
			case "BLANK":
				print(rule.type);
			break;
			case "CHOICE": {
				let members = rule.members;
				let isOptional = members.length == 2 && members[1].type == "BLANK";
				if(isOptional) {
					fd.printf(" (");
					manageRule(rule.type, members[0]);
					fd.printf(" )? ");
				}
				else
				{
					fd.printf(" (");
					for(var idx in members) {
						if(idx > 0) fd.printf(" | ");
						manageRule(rule.type, members[idx]);
					}
					fd.printf(" ) ");
				}
			}
			break;
			case "FIELD":
				//print(rule.type, rule.name);
				fd.printf(" ( ");
				manageRule(rule.type, rule.content);
				fd.printf(" ) ");
			break;
			case "IMMEDIATE_TOKEN":
				fd.printf(" ( ");
				manageRule(rule.type, rule.content);
				fd.printf(" ) ");
			break;
			case "PATTERN": {
				let value = rule.value.replace(/\\d/g, "[0-9]");
				value = value.replace(/\[\[0\-9\]/g, "[0-9");
				value = value.replace(/([^\\])\\]/g, "$1#x5D");
				fd.printf(" %s", value);
			}
			break;
			case "PREC":
			case "PREC_DYNAMIC":
			case "PREC_LEFT":
			case "PREC_RIGHT":
				fd.printf("  ( ");
				manageRule(rule.type, rule.content);
				fd.printf(" ) ");
			break;
			case "REPEAT":
				fd.printf(" ( ");
				manageRule(rule.type, rule.content);
				fd.printf(" )* ");
			break;
			case "REPEAT1":
				fd.printf(" (");
				manageRule(rule.type, rule.content);
				fd.printf(" )+ ");
			break;
			case "SEQ": {
				let members = rule.members;
				fd.printf(" (");
				for(var idx in members) {
					manageRule(rule.type, members[idx]);
				}
				fd.printf(" ) ");
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
						//value = value.replace(/\\/g, "\\\\");
						value = value.replace(/\t/g, "\\t"); //order matter
						if(value.indexOf("'") >= 0) fd.printf(" \"%s\" ", value);
						else fd.printf(" '%s' ", value);
				}
			}
			break;

			case "SYMBOL":
				//print(rule.type, rule.name);
				fd.printf(" %s", rule.name);
			break;

			case "TOKEN":
				fd.printf(" ( ");
				manageRule(rule.type, rule.content);
				fd.printf(" ) ");
			break;

			default:
				throw("Unknown rule type: " + rule.type);
		}
	}

	let rules = json.rules;
	for(var idx in rules) {
		let rule = rules[idx];
		//print(rule);
		fd.printf("%s ::= ", idx);
		manageRule(idx, rule);
		fd.printf("\n\n");
	}
	fd.close();
}

for(let idx in fname_list)
{
	let fname = fname_list[idx];
	print(fname);
	parseJsonGrammar(fname);
}
