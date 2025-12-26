; Code blocks
(code_block (code) @function.inner) @function.outer
(raw_block (code) @function.inner) @function.outer

; Paragraphs
(paragraph) @block.outer

; Headings
(heading) @block.outer

; Lists and items
(list) @block.outer
(list_item) @block.inner

; Block quotes
(block_quote) @block.outer

; Divs
(div) @block.outer

; Tables
(pipe_table) @block.outer
(pipe_table_row) @block.inner

; Links and images
(link (link_text) @parameter.inner) @parameter.outer
(image (image_description) @parameter.inner) @parameter.outer

; Inline formatting
(emphasis) @parameter.inner
(strong_emphasis) @parameter.inner
(verbatim) @parameter.inner
(math) @parameter.inner
(span (span_text) @parameter.inner) @parameter.outer

; Footnotes
(footnote) @block.outer
