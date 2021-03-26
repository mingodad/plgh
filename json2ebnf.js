import * as std from "std";
import * as os from "os";

//print(typeof process);
//if(typeof std == "undefined") {
//}

const fname = "A_grammars/tree-sitter/" +
	//"tree-sitter-abnf/src/grammar.json"
	//"tree-sitter-agda/src/grammar.json"
	//"tree-sitter-bash/src/grammar.json"
	//"tree-sitter-beancount/src/grammar.json"
	//"tree-sitter-c/src/grammar.json"
	//"tree-sitter-c-sharp/src/grammar.json"
	//"tree-sitter-carp/src/grammar.json"
	//"tree-sitter-clojure/src/grammar.json"
	//"tree-sitter-cpp/src/grammar.json"
	//"tree-sitter-css/src/grammar.json"
	//"tree-sitter-dart/src/grammar.json"
	//"tree-sitter-elm/src/grammar.json"
	//"tree-sitter-embedded-template/src/grammar.json"
	//"tree-sitter-eno/src/grammar.json"
	//"tree-sitter-erlang/src/grammar.json"
	//"tree-sitter-fennel/src/grammar.json"
	//"tree-sitter-fortran/src/grammar.json"
	//"tree-sitter-go/src/grammar.json"
	//"tree-sitter-graphql/src/grammar.json"
	//"tree-sitter-haskell/src/grammar.json"
	//"tree-sitter-html/src/grammar.json"
	//"tree-sitter-janet/src/grammar.json"
	//"tree-sitter-javascript/src/grammar.json"
	//"tree-sitter-java/src/grammar.json"
	//"tree-sitter-jsdoc/src/grammar.json"
	//"tree-sitter-julia/src/grammar.json"
	//"tree-sitter-kotlin/src/grammar.json"
	//"tree-sitter-lbnf/src/grammar.json"
	//"tree-sitter-lean/src/grammar.json"
	//"tree-sitter-ledger/src/grammar.json"
	//"tree-sitter-lua/src/grammar.json"
	//"tree-sitter-markdown/src/grammar.json"
	//"tree-sitter-menhir/src/grammar.json"
	//"tree-sitter-minizinc/src/grammar.json"
	//"tree-sitter-nim/src/grammar.json"
	//"tree-sitter-nix/src/grammar.json"
	//"tree-sitter-ocaml/src/grammar.json"
	//"tree-sitter-perl/src/grammar.json"
	//"tree-sitter-php/src/grammar.json"
	//"tree-sitter-powershell/src/grammar.json"
	//"tree-sitter-prolog/src/grammar.json"
	//"tree-sitter-python/src/grammar.json"
	//"tree-sitter-ql/src/grammar.json"
	//"tree-sitter-r/src/grammar.json"
	//"tree-sitter-reason/src/grammar.json"
	//"tree-sitter-regex/src/grammar.json"
	//"tree-sitter-ruby/src/grammar.json"
	//"tree-sitter-rust/src/grammar.json"
	//"tree-sitter-scala/src/grammar.json"
	//"tree-sitter-sexp/src/grammar.json"
	//"tree-sitter-sml/src/grammar.json"
	//"tree-sitter-sourcepawn/src/grammar.json"
	//"tree-sitter-sparql/src/grammar.json"
	//"tree-sitter-stan/src/grammar.json"
	//"tree-sitter-svelte/src/grammar.json"
	//"tree-sitter-systemrdl/src/grammar.json"
	//"tree-sitter-swift/src/grammar.json"
	//"tree-sitter-teal/src/grammar.json"
	//"tree-sitter-toml/src/grammar.json"
	//"tree-sitter-turtle/src/grammar.json"
	"tree-sitter-typescript/typescript/src/grammar.json"
	//"tree-sitter-verilog/src/grammar.json"
	//"tree-sitter-vhdl/src/grammar.json"
	//"tree-sitter-vue/src/grammar.json"
	//"tree-sitter-wasm/wast/src/grammar.json"
	//"tree-sitter-yaml/src/grammar.json"
	//"tree-sitter-zig/src/grammar.json"
	;

let fd = std.open(fname, "r");
let json = fd.readAsString();
fd.close();

json = JSON.parse(json);
print(json);

function manageRule(name, rule) {
	//print(name, rule.type); //, typeof rule);
	switch(rule.type)
	{
		case "ALIAS":
			std.printf(" ( ");
			manageRule(rule.type, rule.content);
			std.printf(" ) ");
		break;
		case "BLANK":
			print(rule.type);
		break;
		case "CHOICE": {
			let members = rule.members;
			let isOptional = members.length == 2 && members[1].type == "BLANK";
			if(isOptional) {
				std.printf(" (");
				manageRule(rule.type, members[0]);
				std.printf(" )? ");
			}
			else
			{
				std.printf(" (");
				for(var idx in members) {
					if(idx > 0) std.printf(" | ");
					manageRule(rule.type, members[idx]);
				}
				std.printf(" ) ");
			}
		}
		break;
		case "FIELD":
			//print(rule.type, rule.name);
			std.printf(" ( ");
			manageRule(rule.type, rule.content);
			std.printf(" ) ");
		break;
		case "IMMEDIATE_TOKEN":
			std.printf(" ( ");
			manageRule(rule.type, rule.content);
			std.printf(" ) ");
		break;
		case "PATTERN": {
			let value = rule.value.replace("\\d", "[0-9]");
			std.printf(" %s", value);
		}
		break;
		case "PREC":
		case "PREC_DYNAMIC":
		case "PREC_LEFT":
		case "PREC_RIGHT":
			std.printf("  ( ");
			manageRule(rule.type, rule.content);
			std.printf(" ) ");
		break;
		case "REPEAT":
			std.printf(" ( ");
			manageRule(rule.type, rule.content);
			std.printf(" )* ");
		break;
		case "REPEAT1":
			std.printf(" (");
			manageRule(rule.type, rule.content);
			std.printf(" )+ ");
		break;
		case "SEQ": {
			let members = rule.members;
			std.printf(" (");
			for(var idx in members) {
				manageRule(rule.type, members[idx]);
			}
			std.printf(" ) ");
		}
		break;

		case "STRING": {
			let value = rule.value;
			//print(rule.type, value);
			value = value.replace("\\", "\\\\");
			if(value.indexOf("'") >= 0) std.printf(" \"%s\" ", value);
			else std.printf(" '%s' ", value);
		}
		break;

		case "SYMBOL":
			//print(rule.type, rule.name);
			std.printf(" %s", rule.name);
		break;

		case "TOKEN":
			std.printf(" ( ");
			manageRule(rule.type, rule.content);
			std.printf(" ) ");
		break;

		default:
			throw("Unknown rule type: " + rule.type);
	}
}

let rules = json.rules;
for(var idx in rules) {
	let rule = rules[idx];
	//print(rule);
	std.printf("%s ::= ", idx);
	manageRule(idx, rule);
	std.printf("\n\n");
}
