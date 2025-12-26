; Delimiters
(div_marker) @punctuation.delimiter
(code_block_marker) @punctuation.delimiter

; Headings
(heading_marker) @markup.heading.marker
(heading) @markup.heading

; Emphasis and strong
(emphasis "_" @punctuation.delimiter) @markup.italic
(strong_emphasis "*" @punctuation.delimiter) @markup.bold

; Inline formatting
(superscript) @markup.superscript
(subscript) @markup.subscript
(highlight) @markup.highlight
(insert) @markup.inserted
(delete) @markup.deleted

; Code and verbatim
(code_block) @markup.raw.block
(verbatim) @markup.raw.inline
(code) @markup.raw
(language) @attribute

; Math
(math) @markup.math

; Links and images
(link) @markup.link
(link_text) @markup.link.text
(link_destination) @markup.link.url
(link_label) @markup.link.label
(image) @markup.image
(image_description) @markup.image.alt
(image_source) @markup.image.url
(autolink) @markup.link.url

; References
(reference_definition) @markup.reference
(reference_label) @markup.reference.label
(reference_destination) @markup.link.url

; Footnotes
(footnote) @markup.footnote
(footnote_label) @markup.footnote.label
(footnote_reference) @markup.footnote.reference

; Attributes
(attributes) @attribute
(attribute_id) @attribute.id
(attribute_class) @attribute.class
(attribute_key) @attribute.key
(attribute_value_quoted) @string
(attribute_value_unquoted) @string
(comment) @comment

; Spans
(span) @markup.span
(span_text) @markup.span.text

; Raw blocks and inline
(raw_block) @markup.raw.block
(raw_format) @attribute
(raw_inline) @markup.raw.inline

; Lists
(list) @markup.list
(bullet_list_marker) @markup.list.marker
(ordered_list_marker) @markup.list.marker
(task_list_marker) @markup.list.marker

; Tables
(pipe_table) @markup.table
(pipe_table_row) @markup.table.row
(pipe_table_delimiter_row) @markup.table.delimiter
(table_caption) @markup.table.caption

; Symbols and punctuation
(symbol) @constant.symbol
(smart_ellipsis) @punctuation.special
(smart_em_dash) @punctuation.special
(smart_en_dash) @punctuation.special

; Escapes and special
(escape) @string.escape
(line_break) @constant.builtin

; Forced delimiters
(forced_emphasis_open) @punctuation.delimiter
(forced_emphasis_close) @punctuation.delimiter
(forced_strong_open) @punctuation.delimiter
(forced_strong_close) @punctuation.delimiter

; Thematic breaks
(thematic_break) @punctuation.special
