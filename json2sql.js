import * as std from "std";
import * as os from "os";

//print(typeof process);
//if(typeof std == "undefined") {
//}

const grammar_rule_types = {
	'ALIAS': 1,
	'BLANK': 2,
	'CHOICE': 3,
	'FIELD': 4,
	'IMMEDIATE_TOKEN': 5,
	'PATTERN': 6,
	'PREC': 7,
	'PREC_DYNAMIC': 8,
	'PREC_LEFT': 9,
	'PREC_RIGHT': 10,
	'REPEAT': 11,
	'REPEAT1': 12,
	'SEQ': 13,
	'STRING': 14,
	'SYMBOL': 15,
	'TOKEN': 16
	};

print(`
begin;

create table grammar_rule_types(
	id integer primary key not null,
	name varchar not null unique
);
insert into grammar_rule_types(id, name) values`);

for(let key in grammar_rule_types) {
	let idx = grammar_rule_types[key];
	if(idx > 1) std.printf(",\n");
	std.printf("\t(%d, '%s')", idx, key);
}
std.printf(";\n");
print(`
create table grammars(
	id integer primary key not null,
	name varchar not null unique,
	word varchar
);

create table grammar_rules(
	id integer primary key not null,
	grammar_id integer not null references grammars(id),
	parent_id integer check(id <> parent_id) references grammar_rules(id),
	type_id integer not null references grammar_rule_types(id),
	value varchar,
	is_external boolean default 0
	--,unique(grammar_id, parent_id, type_id, value)
);
create unique index grammar_rule_name_idx on grammar_rules(grammar_id, value) where parent_id is null;

create table grammar_externals(
	id integer primary key not null,
	grammar_id integer not null references grammars(id),
	type_id integer not null references grammar_rule_types(id),
	value varchar not null,
	unique(grammar_id, value)
);

create table grammar_extras(
	id integer primary key not null,
	grammar_id integer not null references grammars(id),
	type_id integer not null references grammar_rule_types(id),
	rule_id integer references grammar_rules(id),
	value varchar,
	unique(grammar_id, rule_id),
	unique(grammar_id, value)
);

create table grammar_precedences(
	id integer primary key not null,
	grammar_id integer not null references grammars(id)
);

create table grammar_precedence_list(
	id integer primary key not null,
	precedence_id integer not null references grammar_precedences(id),
	rule_id integer references grammar_rules(id),
	value varchar,
	unique(precedence_id, rule_id),
	unique(precedence_id, value)
);

create table grammar_conflicts(
	id integer primary key not null,
	grammar_id integer not null references grammars(id)
);

create table grammar_conflict_list(
	id integer primary key not null,
	conflict_id integer not null references grammar_conflicts(id),
	rule_id integer not null references grammar_rules(id),
	unique(conflict_id, rule_id)
);

create table grammar_inline(
	id integer primary key not null,
	grammar_id integer not null references grammars(id),
	rule_id integer not null references grammar_rules(id),
	unique(grammar_id, rule_id)
);

create table grammar_supertypes(
	id integer primary key not null,
	grammar_id integer not null references grammars(id),
	rule_id integer not null references grammar_rules(id),
	unique(grammar_id, rule_id)
);

create view grammar_rules_no_parent_view as
select * from grammar_rules where parent_id is null order by id;

--DROP VIEW grammar_rules_list_view;
CREATE VIEW grammar_rules_list_view AS
SELECT
	a.id,
	d.name as grammar,
	b.name as rule_type,
	a.value,
	a.is_external,
	a.grammar_id, --d.id,
	a.parent_id, --c.id,
	a.type_id --b.id,
FROM grammar_rules AS a
LEFT JOIN grammar_rule_types AS b ON a.type_id = b.id
--LEFT JOIN grammar_rules AS c ON a.parent_id = c.id
LEFT JOIN grammars AS d ON a.grammar_id = d.id;

create view grammar_rules_tokens_view as
select count(*) cnt, * from grammar_rules_list_view
where rule_type = 'STRING'
group by value;

`);

let grammars_list = {};
let grammars_count = 0;

let grammar_rules_list = {};
let grammar_rule_count = 0;

let grammar_item_children_list = {};
let grammar_item_children_count = 0;

let grammars_conflicts_count = 0;
let grammars_conflict_list_count = 0;

let grammar_precedences_count = 0;
let grammars_precedence_list_count = 0;

let grammars_inline_count = 0;
let grammars_supertypes_count = 0;
let grammar_externals_count = 0;
let grammar_extras_count = 0;


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

	json = JSON.parse(json);
	//print(json);

	let getEscapedString = function(value) {
		switch(value) {
			case "\0": return("'\\0'");
			case "\b": return("'\\b'");
			case "\f": return("'\\f'");
			case "\n": return("'\\n'");
			case "\r": return("'\\r'");
			case "\t": return("'\\t'");
			case "\v": return("'\\v'");
			case "\\": return("'\\\\'");
			case "'": return("''''");
			case "\"": return("'\\'");
			default:
				//value = value.replace(/\\/g, "\\\\");
				value = value.replace(/\t/g, "\\t"); //order matter
				value = value.replace(/'/g, "''");
				return "'" + value + "'";
		}
	};
	let getRuleId = function(grammar_id, rule_key) {
		let rule_sql_key = grammar_id + "_" + rule_key;
		return grammar_rules_list[rule_sql_key];
	};

	let last_rule_id;
	let reset_last_rule_id = function() {last_rule_id = grammar_rule_count + 1;};
	reset_last_rule_id();

	let insertGrammarRule = function (grammar_id, parent_id, type_id, rule_key, is_external) {
		let rule_sql_key = grammar_id + "_" + rule_key;
		let rule_id = grammar_rules_list[rule_sql_key];
		if(typeof rule_id != "number") {
			rule_id = ++grammar_rule_count;
			grammar_rules_list[rule_sql_key] = rule_id;
			if(grammar_rule_count > last_rule_id) std.printf(",\n");
			std.printf("\t(%d, %d, %s, %d, %s, %d)", rule_id, grammar_id, (parent_id ? (parent_id +"") : 'NULL'), type_id, "'" + rule_key + "'", is_external);
		}
		else throw("Grammar rule '" + rule_key + "' already exists.");
		return rule_id;
	};

	let insertRuleChild = function(grammar_id, parent_id, type_id, child_key) {
		let child_id = ++grammar_rule_count;
		//print("insert into grammar_item_children(parent_id, child_id) values(", parent_id, ", ", child_id, ");");
		if(grammar_rule_count > last_rule_id) std.printf(",\n");
		std.printf("\t(%d, %d, %d, %d, %s, 0)", child_id, grammar_id, parent_id, type_id, (child_key ? ("'" + child_key + "'") : 'NULL'));
		return child_id;
	};

	let manageRule = function (grammar_id, parent_id, name, rule) {
		//print(name, rule.type); //, typeof rule);
		let new_parent_id, type_id = grammar_rule_types[rule.type];
		switch(rule.type)
		{
			case "ALIAS":
				new_parent_id = insertRuleChild(grammar_id, parent_id, type_id, rule.type);
				manageRule(grammar_id, new_parent_id, rule.type, rule.content);
			break;
			case "BLANK":
				print(rule.type);
			break;
			case "CHOICE": {
				let members = rule.members;
				let isOptional = members.length == 2 && members[1].type == "BLANK";
				if(isOptional) {
					new_parent_id = insertRuleChild(grammar_id, parent_id, grammar_rule_types.REPEAT, '?');
					manageRule(grammar_id, new_parent_id, rule.type, members[0]);
				}
				else
				{
					new_parent_id = insertRuleChild(grammar_id, parent_id, type_id, rule.type);
					for(var idx in members) {
						manageRule(grammar_id, new_parent_id, rule.type, members[idx]);
					}
				}
			}
			break;
			case "FIELD":
				//print(rule.type, rule.name);
				new_parent_id = insertRuleChild(grammar_id, parent_id, type_id, rule.type);
				manageRule(grammar_id, new_parent_id, rule.type, rule.content);
			break;
			case "IMMEDIATE_TOKEN":
				new_parent_id = insertRuleChild(grammar_id, parent_id, type_id, rule.type);
				manageRule(grammar_id, new_parent_id, rule.type, rule.content);
			break;
			case "PATTERN": {
				let value = rule.value.replace(/'/g, "''");
				insertRuleChild(grammar_id, parent_id, type_id, value);
			}
			break;
			case "PREC":
			case "PREC_DYNAMIC":
			case "PREC_LEFT":
			case "PREC_RIGHT":
				new_parent_id = insertRuleChild(grammar_id, parent_id, type_id, rule.value);
				manageRule(grammar_id, new_parent_id, rule.type, rule.content);
			break;
			case "REPEAT":
				new_parent_id = insertRuleChild(grammar_id, parent_id, type_id, '*');
				manageRule(grammar_id, new_parent_id, rule.type, rule.content);
			break;
			case "REPEAT1":
				new_parent_id = insertRuleChild(grammar_id, parent_id, grammar_rule_types.REPEAT, '+');
				manageRule(grammar_id, new_parent_id, rule.type, rule.content);
			break;
			case "SEQ": {
				let members = rule.members;
				new_parent_id = insertRuleChild(grammar_id, parent_id, type_id, rule.type);
				for(var idx in members) {
					manageRule(grammar_id, new_parent_id, rule.type, members[idx]);
				}
			}
			break;

			case "STRING": {
				let value = rule.value;
				//print(rule.type, value);
				switch(value) {
					case "\0": value = "\\0"; break;
					case "\b": value = "\\b"; break;
					case "\f": value = "\\f"; break;
					case "\n": value = "\\n"; break;
					case "\r": value = "\\r"; break;
					case "\t": value = "\\t"; break;
					case "\v": value = "\\v"; break;
					case "\\": value = "\\\\"; break;
					case "'": value = "''"; break;
					case "\"": value = "\""; break;
					default:
						//value = value.replace(/\\/g, "\\\\");
						value = value.replace(/\t/g, "\\t"); //order matter
						value = value.replace(/'/g, "''");
				}
				insertRuleChild(grammar_id, parent_id, type_id, value);
			}
			break;

			case "SYMBOL":
				//print(rule.type, rule.name);
				insertRuleChild(grammar_id, parent_id, type_id, rule.name);
			break;

			case "TOKEN":
				new_parent_id = insertRuleChild(grammar_id, parent_id, type_id, rule.type);
				manageRule(grammar_id, new_parent_id, rule.type, rule.content);
			break;

			default:
				throw("Unknown rule type: " + rule.type);
		}
	}

	let grammar_name = json.name;
	let grammar_word = json.word;
	//if(typeof json.word == "string") grammar_word = json.word;
	let grammar_id = grammars_list[grammar_name];
	if(typeof grammar_id != "number") {
		grammar_id = ++grammars_count;
		grammars_list[grammar_name] = grammar_id;
		print(
			"insert into grammars(id, name, word) values("
			//"grammar("
			, grammar_id, ", '" + grammar_name + "', ", (grammar_word ? "'" + grammar_word + "'" : 'NULL') , ");");
	}
	else throw("Grammar '" + grammar_name + "' already exists.");

	if(json.externals) {
		let externals_list = json.externals;
		for(let idx in externals_list) {
			let item = externals_list[idx];
			let external_id = 0;
			let type_id = grammar_rule_types[item.type];
			switch(item.type) {
				case "SYMBOL":
					reset_last_rule_id();
					print("insert into grammar_rules(id, grammar_id, parent_id, type_id, value, is_external) values");
					let rule_id = insertGrammarRule(grammar_id, null, type_id, item.name, 1);
					print(";");
				break;
				case "STRING":
					external_id = ++grammar_externals_count;
					print("insert into grammar_externals(id, grammar_id, type_id, value) values(", external_id, ", ", grammar_id, ", ", type_id, ", ", getEscapedString(item.value), ");");
				break;

				case "PATTERN":
					external_id = ++grammar_externals_count;
					print("insert into grammar_externals(id, grammar_id, type_id, value) values(", external_id, ", ", grammar_id, ", ", type_id, ", ", getEscapedString(item.value), ");");
				break;

				default:
					throw("Unknown external type: " + item.type);
			}
		}
	}

	let rules = json.rules;
	reset_last_rule_id();
	print("insert into grammar_rules(id, grammar_id, parent_id, type_id, value, is_external) values");
	for(var rule_key in rules) {
		let rule = rules[rule_key];
		//print(rule_key);
		let rule_id = insertGrammarRule(grammar_id, null, grammar_rule_types[rule.type], rule_key, 0);
		manageRule(grammar_id, rule_id, rule_key, rule);
		//manageRule(idx, rule);
	}
	print(";");

	if(json.conflicts && grammar_name != "verilog") {
		for(let idx in json.conflicts) {
			let conflict_id = ++grammars_conflicts_count;
			print("insert into grammar_conflicts(id, grammar_id) values(", conflict_id, ", ", grammar_id, ");");
			let conflict_list = json.conflicts[idx];
			print("insert into grammar_conflict_list(id, conflict_id, rule_id) values");
			for(let item in conflict_list) {
				if(item > 0) std.printf(",\n");
				std.printf("\t(%d, %d, %d)", ++grammars_conflict_list_count, conflict_id, getRuleId(grammar_id, conflict_list[item]));
			}
			print(";");
		}
	}

	if(json.inline && json.inline.length > 0) {
		let inline_list = json.inline;
		print("insert into grammar_inline(id, grammar_id, rule_id) values");
		for(let idx in inline_list) {
			let inline_id = ++grammars_inline_count;
			if(idx > 0) std.printf(",\n");
			std.printf("\t(%d, %d, %d)", inline_id, grammar_id, getRuleId(grammar_id, inline_list[idx]));
		}
		print(";");
	}

	if(json.extras && json.extras.length > 0) {
		let extra_list = json.extras;
		print("insert into grammar_extras(id, grammar_id, type_id, rule_id, value) values");
		for(let idx in extra_list) {
			let item = extra_list[idx];
			let extra_id = ++grammar_extras_count;
			if(idx > 0) std.printf(",\n");
			let type_id = grammar_rule_types[item.type];
			switch(item.type) {
				case "SYMBOL":
					let rule_id = getRuleId(grammar_id, item.name);
					std.printf("\t(%d, %d, %d, %d, NULL)", extra_id, grammar_id, type_id, rule_id);
				break;
				case "STRING":
					std.printf("\t(%d, %d, %d, NULL, %s)", extra_id, grammar_id, type_id, getEscapedString(item.value));
				break;
				case "TOKEN":
					std.printf("\t(%d, %d, %d, NULL, 'TOKEN ?????')", extra_id, grammar_id, type_id); //TODO manage properly
				break;
				case "PATTERN":
					std.printf("\t(%d, %d, %d, NULL, %s)", extra_id, grammar_id, type_id, getEscapedString(item.value));
				break;

				default:
					print("==== Unknown extras type: " + item.type);
			}
		}
		print(";");
	}

	if(json.supertypes && json.supertypes.length > 0) {
		let supertypes_list = json.supertypes;
		print("insert into grammar_supertypes(id, grammar_id, rule_id) values");
		for(let idx in supertypes_list) {
			let supertype_id = ++grammars_supertypes_count;
			if(idx > 0) std.printf(",\n");
			std.printf("\t(%d, %d, %d)", supertype_id, grammar_id, getRuleId(grammar_id, supertypes_list[idx]));
		}
		print(";");
	}

	if(json.precedences) {
		for(let idx in json.precedences) {
			let precedence_id = ++grammar_precedences_count;
			print("insert into grammar_precedences(id, grammar_id) values(", precedence_id, ", ", grammar_id, ");");
			print("insert into grammar_precedence_list(id, precedence_id, rule_id, value) values");
			let precedence_list = json.precedences[idx];
			for(let elm in precedence_list) {
				let item = precedence_list[elm];
				let precedence_list_id = ++grammars_precedence_list_count;
				if(elm > 0) std.printf(",\n");
				switch(item.type) {
					case "SYMBOL":
						let rule_id = getRuleId(grammar_id, item.name);
						std.printf("\t(%d, %d, %d, NULL)", precedence_list_id, precedence_id, rule_id);
					break;
					case "STRING":
						std.printf("\t(%d, %d, NULL, %s)", precedence_list_id, precedence_id, getEscapedString(item.value));
					break;
					case "PATTERN":
						std.printf("\t(%d, %d, NULL, %s)", precedence_list_id, precedence_id, getEscapedString(item.value));
					break;

					default:
						throw("Unknown precendes type: " + item.type);
				}
			}
			print(";");
		}
	}


}

for(let idx in fname_list)
{
	let fname = fname_list[idx];
	print("\n--\n--", fname, "\n--\n");
	parseJsonGrammar(fname);
}

print("\ncommit;\n");