# Known Issues and Limitations

### 1. Smart Curly Quotes Not Implemented

**What works:**
- Ellipsis (`...` → …)
- Em-dash (`---` → —)
- En-dash (`--` → –)

**What doesn't:**
- Curly quote conversion (`"text"` → "text")
- Apostrophe/single quote distinction

**Why not:** Requires context-aware state tracking to distinguish opening vs closing quotes based on surrounding whitespace and word boundaries. This is fundamentally difficult in LR parsers and would require significant scanner complexity with limited benefit.

---

### 2. Multi-line List Items with Nested Blocks

**What works:**
- Simple single-line list items
- Basic continuation on next line

**What doesn't:**
- Complex nested blocks within list items
- Multiple paragraphs in a single list item
- Full indentation-based continuation tracking

**Why not:** Requires sophisticated indentation tracking and block nesting logic in the external scanner. The complexity-to-benefit ratio is high, and most use cases work with simple list items.

**Workaround:** Keep list content simple, or use nested lists for structure.

---

### 3. Footnote Block Content

**What works:**
- Inline content: `[^1]: Simple inline text with *emphasis*.`

**What doesn't:**
- Multiple block-level elements in footnotes
- Indented continuation paragraphs

**Why not:** Similar to multi-line list items, this requires complex indentation tracking for relatively rare use cases. The grammar prioritizes common patterns.

**Workaround:** Keep footnote content inline, or use regular paragraphs with reference-style organization.

---

## Design Decisions (Not Bugs)

### Escape Sequences Visible in AST

Escape sequences (`\*`, `\_`, etc.) appear as explicit `(escape)` nodes rather than being hidden.

**Why:** Tree-sitter produces concrete syntax trees where all significant tokens are represented. This is correct behavior for a syntax parser.

**For tool authors:** Handle `(escape)` nodes when rendering, typically displaying only the escaped character.

---

### Raw Inline as Single Token

Raw inline (`` `content`{=format} ``) is an atomic token without child nodes.

**Why:** Prevents parsing conflicts with regular verbatim/code spans. This design choice simplifies the grammar and improves reliability.

**For tool authors:** Treat `(raw_inline)` as atomic; parse format attribute separately if needed.
