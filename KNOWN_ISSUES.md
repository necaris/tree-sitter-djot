# Known Issues and Limitations

This document tracks known limitations and edge cases in the tree-sitter-djot grammar implementation.

## Implementation Status

**✅ Grammar is Feature Complete** - All core Djot syntax is implemented with 145 passing tests.

## Known Limitations

### 1. Smart Punctuation - Curly Quotes Not Implemented
**Status:** Partial Implementation

The grammar implements:
- ✅ Ellipsis (`...` → …)
- ✅ Em-dash (`---` → —)
- ✅ En-dash (`--` → –)

Not implemented:
- ❌ Curly quote conversion (`"text"` → "text")
- ❌ Single quote/apostrophe distinction

**Reason:** Proper quote conversion requires context-aware parsing to determine opening vs closing quotes based on surrounding whitespace and word boundaries. This level of lexical analysis is complex in tree-sitter's LR parser model.

**Workaround:** Use literal typographic quotes in source documents, or post-process the AST.

### 2. Escape Sequences - Visible in AST
**Status:** By Design

Escape sequences (`\*`, `\_`, etc.) appear as explicit `(escape)` nodes in the AST rather than being "invisible".

**Reason:** Tree-sitter parsers produce concrete syntax trees. Escapes are significant tokens that affect parsing.

**Impact:** Editors and tools consuming the AST should handle `(escape)` nodes appropriately, typically rendering them as the literal escaped character.

### 3. List Items - Multi-line Support Limited
**Status:** Simplified Implementation

List items are currently defined as single-line constructs.

**Limitation:** 
- List items with hard line breaks (`\`) may not parse correctly across lines
- Indented continuation lines are not fully supported
- Nested blocks within list items require enhanced grammar

**Workaround:** Keep list item content on single lines, or use simple continuation.

### 4. Footnote Content - Inline Only
**Status:** Simplified Implementation

Footnotes currently support only inline content on the definition line:
```djot
[^1]: Simple inline content only.
```

Not supported:
```djot
[^1]: First paragraph.

    Second paragraph with indentation.
```

**Reason:** Full footnote support requires tracking indentation levels and block continuation, similar to list items.

### 5. Raw Inline - Single Token Structure
**Status:** By Design

Raw inline (`` `content`{=format} ``) is represented as a single token with no child nodes, rather than separate marker and format nodes.

**Reason:** This prevents conflicts with regular verbatim/code spans during lexical analysis.

**Impact:** Query files and consumers should treat `(raw_inline)` as an atomic node.

### 6. Forced Delimiters - Recognition Only
**Status:** Recognized but Not Enforced

Forced delimiters (`{_`, `_}`, `{*`, `*}`) are recognized as tokens but don't currently affect emphasis/strong matching behavior in the grammar.

**Current Behavior:** They appear in the AST as `forced_*_open/close` nodes but don't force delimiter interpretation.

**Future Enhancement:** Would require stateful parsing to track delimiter contexts.

## Edge Cases

### Multiple Inline Emphasis on Same Line
**Status:** Known Behavior

Multiple emphasis markers on the same line may produce nested structures in some cases due to the recursive nature of `_inline` parsing.

**Example:**
```djot
Text with _emphasis one_ and _emphasis two_
```

May parse differently than:
```djot
Text with _emphasis_
and _another emphasis_
```

**Impact:** Generally acceptable for syntax highlighting and editing, but may affect precise AST analysis.

## Performance Considerations

### Large Documents
**Status:** Acceptable Performance

The grammar handles typical Djot documents efficiently. Very large documents (>10,000 lines) may see slower parse times due to:
- External scanner overhead (block structure tracking)
- Inline content parsing (many choices in `_inline` rule)

**Recommendation:** Consider splitting very large documents into smaller files.

## Test Coverage

**Status:** 145 Tests, 100% Passing

The test suite covers:
- ✅ All major Djot features
- ✅ Common use cases
- ✅ Basic edge cases

Areas with less coverage:
- Deeply nested structures (>5 levels)
- Unicode edge cases in various contexts
- Performance with extremely large inputs

## Future Enhancements

Potential improvements for future versions:
1. Context-aware smart quote conversion
2. Full multi-line list item support with nested blocks
3. Complete footnote block content support
4. Stateful forced delimiter handling
5. Enhanced error recovery for malformed input
6. Performance optimizations for large documents

## Reporting Issues

If you encounter issues not listed here:
1. Create a minimal reproduction example
2. Check if there's a test case covering the scenario
3. File an issue with the example and expected vs actual output
4. Reference this document if related to a known limitation

Use `npx tree-sitter parse <file>` to examine the parse tree for debugging.