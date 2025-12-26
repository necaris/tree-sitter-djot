# Djot Examples

This directory contains example Djot documents demonstrating various features of the markup language and how they're parsed by the tree-sitter grammar.

## Files

- **`basic.dj`** ✅ - Basic syntax elements (headings, paragraphs, emphasis, lists)
- **`code-blocks.dj`** ✅ - Code blocks, raw blocks, and verbatim spans
- **`full-document.dj`** ✅ - Complete document showcasing most features
- **`links-images.dj`** ⚠️ - Links and images (contains some edge cases)
- **`advanced.dj`** ⚠️ - Advanced features (contains some edge cases)

**Note:** Files marked with ⚠️ contain some syntax edge cases that may not parse perfectly with the current grammar. The ✅ files parse cleanly and are recommended as starting points.

## Usage

Parse any example with tree-sitter:

```bash
npx tree-sitter parse examples/basic.dj
```

Or test specific features:

```bash
# View the syntax tree
npx tree-sitter parse examples/advanced.dj

# Use with --quiet for errors only
npx tree-sitter parse examples/full-document.dj --quiet
```

## Learning Djot

For full Djot specification, see:
- [Djot Syntax Reference](https://htmlpreview.github.io/?https://github.com/jgm/djot/blob/master/doc/syntax.html)
- [Djot Homepage](https://djot.net/)

## Contributing Examples

To add new examples:
1. Create a `.dj` file in this directory
2. Ensure it parses correctly with `npx tree-sitter parse`
3. Add a description to this README
4. Submit a pull request
