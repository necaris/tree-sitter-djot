# Development Commands

Common commands for developing the tree-sitter-djot grammar.

## generate

> Regenerate the parser from grammar.js

```bash
npx tree-sitter generate
```

## test

> Run the test suite

```bash
npx tree-sitter test
```

## build

> Build the parser (compile C code) using `make`

```bash
make
```

## rebuild

> Regenerate parser and run tests

```bash
$MASK generate && $MASK test
```

## parse (file)

> Parse a file and display the syntax tree

**OPTIONS**

- file
  - flags: -f --file
  - type: string
  - desc: Path to file to parse

<!-- end list -->

```bash
npx tree-sitter parse "$file"
```

## parse-debug (file)

> Parse a file with debug output

**OPTIONS**

- file
  - flags: -f --file
  - type: string
  - desc: Path to file to parse

<!-- end list -->

```bash
npx tree-sitter parse "$file" --debug
```

## format-check

> Check if grammar.js is formatted correctly

```bash
npm run check-formatted
```

## install-deps

> Install npm dependencies

```bash
npm install
```

## clean

> Clean build artifacts

```bash
rm -rf build node_modules
```

## playground

> Start the tree-sitter playground

```bash
npx tree-sitter build-wasm && npx tree-sitter playground
```
