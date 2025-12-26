; Code block language injection
(code_block
  (language) @injection.language
  (code) @injection.content)

; Inline math (LaTeX)
(math) @injection.content
  (#set! injection.language "latex")

; Comments
(comment) @injection.content
  (#set! injection.language "comment")
