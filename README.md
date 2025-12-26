# tree-sitter-djot

A comprehensive [Tree-sitter](https://tree-sitter.github.io/) grammar for [Djot](https://djot.net/), a lightweight markup language.

This grammar was initially created following the blog post: <https://www.jonashietala.se/blog/2024/03/19/lets_create_a_tree-sitter_grammar/>

## Features

This grammar implements the complete Djot specification with **145 passing tests** covering:

### Block-level Elements
- ✅ **Headings** - 1-6 levels with `#` markers
- ✅ **Paragraphs** - with inline content
- ✅ **Block quotes** - `>` markers with lazy continuation
- ✅ **Lists** - bullet, ordered, and task lists
- ✅ **Code blocks** - fenced with ` ``` ` and language tags
- ✅ **Raw blocks** - ` ```=format ` for raw HTML/LaTeX passthrough
- ✅ **Divs** - `:::` containers with attributes
- ✅ **Pipe tables** - with alignment and captions
- ✅ **Thematic breaks** - `***` or `---`
- ✅ **Footnotes** - `[^label]: content` definitions
- ✅ **Reference definitions** - `[label]: url`

### Inline Elements
- ✅ **Emphasis** - `_text_`
- ✅ **Strong emphasis** - `*text*`
- ✅ **Verbatim/code** - `` `code` `` with 1-4 backticks
- ✅ **Math** - `$`inline`` and `$$`display`` math
- ✅ **Links** - `[text](url)` and `[text][ref]`
- ✅ **Images** - `![alt](url)` and `![alt][ref]`
- ✅ **Autolinks** - `<url>` and `<email>`
- ✅ **Spans** - `[text]{attributes}` for generic containers
- ✅ **Superscript** - `^text^`
- ✅ **Subscript** - `~text~`
- ✅ **Highlight** - `{=text=}`
- ✅ **Insert** - `{+text+}`
- ✅ **Delete** - `{-text-}`
- ✅ **Footnote references** - `[^ref]`
- ✅ **Symbols** - `:emoji:` style
- ✅ **Raw inline** - `` `content`{=format} ``

### Advanced Features
- ✅ **Attributes** - `{#id .class key=value}` on blocks and inline elements
- ✅ **Comments** - `% comment %` within attributes
- ✅ **Line breaks** - `\` before newline
- ✅ **Backslash escapes** - `\*` for literal characters
- ✅ **Smart punctuation** - `...`, `---`, `--` for ellipsis, em-dash, en-dash
- ✅ **Forced delimiters** - `{_` `_}` `{*` `*}` for explicit emphasis/strong

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (for tree-sitter CLI)
- C compiler (gcc, clang, or MSVC)

### Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/tree-sitter-djot.git
cd tree-sitter-djot

# Install dependencies
npm install

# Generate the parser
npx tree-sitter generate

# Run tests
npx tree-sitter test
```

## Usage

### Command Line
```bash
# Parse a Djot file
npx tree-sitter parse example.dj

# Test the grammar
npx tree-sitter test
```

### Editor Integration

This grammar includes comprehensive query files for syntax highlighting:
- `queries/highlights.scm` - Syntax highlighting rules
- `queries/injections.scm` - Code block language injection
- `queries/textobjects.scm` - Navigation and text objects

#### Neovim
Add to your Tree-sitter configuration:
```lua
require('nvim-treesitter.configs').setup {
  ensure_installed = { "djot" },
  highlight = { enable = true },
}
```

#### Helix
Add to your `languages.toml`:
```toml
[[language]]
name = "djot"
scope = "source.djot"
file-types = ["dj", "djot"]
roots = []
grammar = "djot"
```

## Testing

The grammar includes 145 test cases covering all features:
```bash
npx tree-sitter test
```

All tests pass with 100% success rate.

## Development

See the [Tree-sitter documentation](https://tree-sitter.github.io/tree-sitter/creating-parsers) for general information on creating parsers.

### Project Structure
```
tree-sitter-djot/
├── grammar.js          # Grammar definition
├── src/
│   ├── parser.c        # Generated parser
│   └── scanner.c       # External scanner for block structure
├── queries/            # Editor integration queries
├── test/corpus/        # Test cases
└── bindings/          # Language bindings (C, Go, Node, Python, Rust, Swift)
```

## Known Issues

See [KNOWN_ISSUES.md](KNOWN_ISSUES.md) for current limitations and edge cases.

## Contributing

Contributions are welcome! Please:
1. Add tests for new features in `test/corpus/syntax.txt`
2. Run `npx tree-sitter test` to verify
3. Update query files if adding new node types
4. Update this README

## License

MIT

## Resources

- [Djot Specification](https://htmlpreview.github.io/?https://github.com/jgm/djot/blob/master/doc/syntax.html)
- [Tree-sitter Documentation](https://tree-sitter.github.io/tree-sitter/)
- [Original Blog Post](https://www.jonashietala.se/blog/2024/03/19/lets_create_a_tree-sitter_grammar/)
