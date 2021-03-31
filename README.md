# plgh

## Programming Languages Grammar House (BNF like grammars)

**Individual grammars can have different license in the origin !**

Initially this project is using a Javascript (QuickJS) program that converts the  `tree-sitter` generated "src/grammar.json" to an
`EBNF` format that can be used on https://www.bottlecaps.de/rr/ui (some grammars still require a bit of manual editing the generated `EBNF`, most of the ones here were manually edited just enough to alow then be viewed as `rail road diagram`).

To view the `rail road diagram` copy the `EBNF` file and paste on https://www.bottlecaps.de/rr/ui in the `Edit Grammar` tab then switch to the `View Diagram` tab.

Short guide of the equivalences between **tree-sitter Javascript** notation and **EBNF from rail road diagram** (notice that **rr** does some optmizations and simplifications that help tidy the grammar):

```
seq(a,b,c) <=> a b c
repeat(a) <=> a*
repeat1(a) <=> a+
choice(a,b,c) <=> a | b | c
optional(a) <=> a?
commaSep(a) <=> a (',' a)*
```

There is a script (QuickJS) to convert "src/grammar.json" to **SQL** json2sql.js that was used to generated and manually fixed a SQL file with all "src/grammar.json" for the grammars on this repository.
