# plgh
Programming Languages Grammar House (BNF like grammars)

Initially this project is using a Javascript (QuickJS) program that converts the  `tree-sitter` generated "src/grammar.json" to an
`EBNF` format that can be used on https://www.bottlecaps.de/rr/ui (some grammars still require a bit of manual editing the generated `EBNF`, most of the ones here were manually edited just enough to alow then be viewd as `rail road diagram`).

To view the `rail road diagram` copy the `EBNF` file and paste on https://www.bottlecaps.de/rr/ui in the `Edit Grammar` tab then switch to the `View Diagram` tab.
