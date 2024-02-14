# plgh

## Programming Languages Grammar House (BNF like grammars)

**Individual grammars can have different license in the origin !**

**Notice: The online railroad generator has changed to IPV6 only and soemone else hosted it on an IPV4 address.**

The railroad generator project can be found here https://github.com/GuntherRademacher/rr .

Initially this project is using a Javascript (QuickJS) program that converts the  `tree-sitter` generated "src/grammar.json" to an
`EBNF` format that can be used on (IPV6) https://www.bottlecaps.de/rr/ui or (IPV4) https://rr.red-dove.com/ui (some grammars still require a bit of manual editing the generated `EBNF`, most of the ones here were manually edited just enough to alow then be viewed as `rail road diagram`).

To view the `rail road diagram` copy the `EBNF` file and paste on (IPV6) https://www.bottlecaps.de/rr/ui or (IPV4) https://rr.red-dove.com/ui in the `Edit Grammar` tab then switch to the `View Diagram` tab.

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


# Good Reads

From https://github.com/tajmone/lemon-grove/edit/master/README.md

Links to useful books, articles and tutorials on the topics of lexing and parsing.

## Compiler Design in C

Free PDF book + sources, 984 pp.

- https://holub.com/compiler/

Originally published in 1990 by [Prentice-Hall Inc.], _Compiler Design in C_, by [Allen Holub], is an excellent book on the topic. Written in plain language, this book takes the reader through a 984 pages long journey on how to build a compiler, step by step, introducing and explaining each compiler component in detail, and providing source code examples of each implementation step.

Since the book is now out of print, the author has generously made it available for free download on his website, in PDF format, including all the source code files and the release notes.

[Prentice-Hall Inc.]: http://www.prenticehall.com/