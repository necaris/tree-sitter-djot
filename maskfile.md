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

> Build the parser (compile C code)

```bash
make
```

## rebuild

> Regenerate parser and run tests

```bash
npx tree-sitter generate && npx tree-sitter test
```

## parse (file)

> Parse a file and display the syntax tree

**OPTIONS**
* file
  * flags: -f --file
  * type: string
  * desc: Path to file to parse

```bash
npx tree-sitter parse "$file"
```

## parse-debug (file)

> Parse a file with debug output

**OPTIONS**
* file
  * flags: -f --file
  * type: string
  * desc: Path to file to parse

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

## bd-ready

> Show ready work items in beads issue tracker

```bash
bd ready --json
```

## bd-list

> List all issues

```bash
bd list --json
```

## bd-status (issue_id)

> Show status of a specific issue

**OPTIONS**
* issue_id
  * flags: -i --issue-id
  * type: string
  * desc: Issue ID (e.g., tree-sitter-djot-564.1)

```bash
bd show "$issue_id" --json
```
