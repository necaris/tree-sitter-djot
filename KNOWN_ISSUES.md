# Known Issues and Limitations

## Current Parser Limitations

### Multiple Inline Emphasis on Same Line

**Issue:** Multiple emphasis markers on the same line are parsed as nested rather than siblings.

**Example:**
```djot
Text with _emphasis one_ and _emphasis two_
```

**Current behavior:** Parses as:
```
paragraph
  emphasis
    emphasis
```

**Expected behavior:** Should parse as:
```
paragraph
  emphasis
  emphasis
```

**Cause:** The current inline parsing strategy uses a greedy recursive approach where `_inline` continues to consume content after the first emphasis opener, which includes subsequent emphasis markers. This causes them to be nested instead of being siblings.

**Impact:** 
- Syntax trees don't accurately represent the structure for lines with multiple emphasis
- Affects queries and highlighting for such cases
- Tests 17 and 30 document this behavior

**Resolution:** 
- Requires more sophisticated inline parsing with proper delimiter tracking
- Will be addressed when implementing full inline syntax (strong emphasis, links, etc.)
- This is acceptable for the current simplified grammar focused on block-level parsing

## Missing Features

The following Djot features are not yet implemented (see bd issues for tracking):

### Block-level Syntax
- Headings (# levels 1-6)
- Block quotes (>)
- Lists (bullet, ordered, definition, task)
- Thematic breaks (---)
- Pipe tables
- Raw blocks
- Reference definitions
- Footnotes

### Inline Syntax
- Strong emphasis (*text*)
- Links (inline and reference)
- Images
- Autolinks
- Verbatim/code spans (`code`)
- Highlighted text (==highlight==)
- Superscript/subscript (^super^ ~sub~)
- Insert/delete (+insert+ -delete-)
- Smart punctuation
- Math ($inline$ and $$display$$)
- Footnote references
- Line breaks
- Comments (% comment)
- Symbols
- Raw inline
- Spans

### Core Features
- Curly-brace openers/closers ({_ _})
- Backslash escapes (\*)

## Reporting Issues

To report issues or track progress:
1. Check `bd list --json` for existing issue tracking
2. Use `bd create` to add new issues
3. See `.beads/issues.jsonl` for the issue database
