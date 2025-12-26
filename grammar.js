module.exports = grammar({
  name: "sdjot",

  // Skip carriage returns.
  // We could skip spaces here as well, but the actual markup language
  // has significant spaces in some places, so let's remove them here too.
  extras: (_) => ["\r"],

  conflicts: ($) => [
    [$.emphasis, $._fallback],
    [$.strong_emphasis, $._fallback_star],
    [$.superscript, $._fallback_caret],
    [$.subscript, $._fallback_tilde],
    [$.image, $._fallback_exclamation]
  ],

  rules: {
    document: ($) => repeat($._block),

    // All blocks should end with a newline, but we can also parse multiple newlines.
    // raw_block before code_block to try matching =format first
    _block: ($) => choice($.heading, $.block_quote, $.thematic_break, $.reference_definition, $.pipe_table, $.list, $.div, $.code_block, $.raw_block, $.paragraph, "\n"),

    // AIDEV-NOTE: Attributes system {#id .class key=value}
    // Can be applied to both block and inline elements
    attributes: ($) =>
      seq(
        "{",
        optional(/\s+/),
        repeat(
          seq(
            choice(
              $.attribute_id,
              $.attribute_class,
              $.attribute_key_value
            ),
            optional(/\s+/)
          )
        ),
        "}"
      ),

    attribute_id: (_) => seq("#", /[^\s}]+/),
    attribute_class: (_) => seq(".", /[^\s}]+/),
    attribute_key_value: ($) =>
      seq(
        $.attribute_key,
        "=",
        choice(
          $.attribute_value_quoted,
          $.attribute_value_unquoted
        )
      ),
    attribute_key: (_) => /[a-zA-Z_:][a-zA-Z0-9_:.-]*/,
    attribute_value_quoted: (_) => token(choice(
      seq('"', /[^"]*/, '"'),
      seq("'", /[^']*/, "'")
    )),
    attribute_value_unquoted: (_) => token(/[^\s}'"]+/),

    // AIDEV-NOTE: Headings use # markers (1-6) followed by inline content
    // Can span multiple lines, optionally prefixed with matching # markers
    heading: ($) =>
      seq(
        $.heading_marker,
        repeat1(seq($._inline, "\n")),
        choice("\n", $._close_paragraph)
      ),
    heading_marker: (_) => token(seq(
      repeat1("#"),
      /[ \t]+/
    )),

    // AIDEV-NOTE: Thematic breaks are 3+ * or - characters with optional spaces/tabs
    // Can be indented, no other content allowed on the line
    thematic_break: (_) => token(prec(2, seq(
      optional(/[ \t]*/),
      choice(
        // Allow any combination of * and spaces/tabs, but must have at least 3 stars
        /\*[ \t]*\*[ \t]*\*[ \t*]*/,
        // Same for dashes
        /-[ \t]*-[ \t]*-[ \t-]*/
      ),
      "\n"
    ))),

    // AIDEV-NOTE: Reference definitions: [label]: url
    // URL can span multiple lines, attributes transfer to links using this reference
    reference_definition: ($) => prec(1, seq(
      optional(seq($.attributes, "\n")),
      "[",
      $.reference_label,
      "]:",
      optional(/[ \t]+/),
      optional(alias(/[^\n]+/, $.reference_destination)),
      "\n"
    )),
    
    reference_label: (_) => /[^\]\n]+/,

    // AIDEV-NOTE: Lists support bullet (-, +, *), ordered (1., a., i.), definition (:), and task lists
    // For simplicity, starting with basic bullet and ordered lists with single-line items
    list: ($) => prec.left(seq(
      repeat1($.list_item),
      "\n"
    )),
    
    list_item: ($) => prec.left(seq(
      choice(
        $.bullet_list_marker,
        $.ordered_list_marker,
        $.task_list_marker
      ),
      $._inline,
      "\n"
    )),
    
    bullet_list_marker: (_) => token(seq(
      choice("-", "+", "*"),
      /[ \t]+/
    )),
    
    ordered_list_marker: (_) => token(seq(
      /[0-9]+/,
      choice(".", ")"),
      /[ \t]+/
    )),
    
    task_list_marker: (_) => token(seq(
      "-",
      /[ \t]+/,
      "[",
      choice(" ", "X", "x"),
      "]",
      /[ \t]+/
    )),

    // AIDEV-NOTE: Pipe tables use | to separate cells
    // Separator lines determine headers and alignment with ---
    pipe_table: ($) => prec(1, seq(
      repeat1(choice(
        $.pipe_table_row,
        $.pipe_table_delimiter_row
      )),
      optional(seq(optional("\n"), $.table_caption)),
      "\n"
    )),
    
    pipe_table_row: ($) => token(seq(
      "|",
      repeat1(seq(
        /[^\|\n]*/,
        "|"
      )),
      "\n"
    )),
    
    pipe_table_delimiter_row: (_) => token(prec(2, seq(
      "|",
      repeat1(seq(
        optional(/[ \t]*/),
        optional(":"),
        repeat1("-"),
        optional(":"),
        optional(/[ \t]*/),
        "|"
      )),
      "\n"
    ))),
    
    table_caption: (_) => token(seq(
      "^",
      /[ \t]+/,
      /[^\n]+/,
      "\n"
    )),

    // AIDEV-NOTE: Block quotes use > markers with optional space
    // Supports nested blocks and lazy continuation (omitting > on continuation lines)
    block_quote: ($) =>
      prec.left(
        seq(
          $._block_quote_begin,
          repeat($._block),
          $._block_close
        )
      ),

    // A div contains other blocks.
    div: ($) =>
      prec.left(
        seq(
          // A rule starting with "_" will be hidden in the output,
          // and we can use "alias" to rename rules.
          alias($._div_marker_begin, $.div_marker),
          optional($.attributes),
          "\n",
          repeat($._block),
          $._block_close,
          optional(alias($._div_marker_end, $.div_marker))
        )
      ),

    // AIDEV-NOTE: Raw blocks use ``` =format syntax (space before =) for raw content passthrough
    // Code blocks may have a language specifier
    // Both share the same structure but differ in format/language marker
    raw_block: ($) =>
      seq(
        $.code_block_marker,
        $.raw_format,
        optional(/[ \t]+/),
        optional($.attributes),
        "\n",
        optional($.code),
        $.code_block_marker
      ),
    raw_format: (_) => token(seq(/[ \t]+/, "=", /[^\s{]+/)),

    code_block: ($) =>
      seq(
        $.code_block_marker,
        optional(seq($.language, optional(/[ \t]+/))),
        optional($.attributes),
        "\n",
        optional($.code),
        $.code_block_marker
      ),
    code_block_marker: (_) => "```",
    code: (_) => repeat1(seq(/[^\n]*/, "\n")),
    language: (_) => /[^\s{]+/,

    // A paragraph contains inline content and is terminated by a blankline
    // (two newlines in a row) or by a div marker.
    paragraph: ($) =>
      seq(repeat1(seq($._inline, "\n")), choice("\n", $._close_paragraph)),

    // The markup parser could separate block and inline parsing into separate steps,
    // but we'll do everything in one parser.
    _inline: ($) => repeat1(choice($.line_break, $.insert, $.delete, $.subscript, $.superscript, $.highlight, $.autolink, $.symbol, $.image, $.footnote_reference, $.link, $.span, $.math, $.verbatim, $.strong_emphasis, $.emphasis, $._text, $._fallback, $._fallback_star, $._fallback_caret, $._fallback_tilde, $._fallback_exclamation)),
    
    // AIDEV-NOTE: Hard line breaks use backslash before newline
    // The backslash is the line break marker, newline is consumed by paragraph structure
    // Note: This will match ANY backslash with high precedence. Proper implementation
    // should distinguish between line breaks (\<newline>) and escapes (\<char>)
    // For now, accepting simplified behavior - escapes will be handled in task tree-sitter-djot-564.27
    line_break: (_) => prec(1, "\\"),
    // AIDEV-NOTE: Insert and delete use {+text+} and {-text-} syntax
    // Curly braces are mandatory
    insert: ($) => seq(
      "{+",
      $._inline,
      "+}",
      optional($.attributes)
    ),
    
    delete: ($) => seq(
      "{-",
      $._inline,
      "-}",
      optional($.attributes)
    ),

    // AIDEV-NOTE: Highlighted text uses {=text=} syntax
    // Curly braces are mandatory
    highlight: ($) => seq(
      "{=",
      $._inline,
      "=}",
      optional($.attributes)
    ),

    // AIDEV-NOTE: Autolinks use <url> or <email> syntax
    // Content is literal (no escapes), no newlines allowed
    autolink: (_) => token(seq(
      "<",
      /[^<>\n]+/,
      ">"
    )),

    // AIDEV-NOTE: Symbols use :name: syntax (like emoji shortcodes)
    // Names can contain letters, numbers, underscores, hyphens, and plus signs
    symbol: (_) => token(seq(
      ":",
      /[a-zA-Z0-9_+-]+/,
      ":"
    )),

    // AIDEV-NOTE: Footnote references use [^label] syntax
    // Must come before images/links to match the [^ pattern
    footnote_reference: (_) => token(seq(
      "[^",
      /[^\]\n]+/,
      "]"
    )),

    // AIDEV-NOTE: Images use ! prefix before link syntax: ![alt](url) or ![alt][ref]
    image: ($) => seq(
      "!",
      "[",
      alias(repeat1(/[^\]\n]/), $.image_description),
      "]",
      choice(
        // Inline image: (url)
        seq(
          token.immediate("("),
          alias(/[^\n)]+/, $.image_source),
          ")"
        ),
        // Reference image: [ref] or [] (empty uses alt as ref)
        seq(
          token.immediate("["),
          optional(alias(/[^\n\]]+/, $.image_reference)),
          "]"
        )
      ),
      optional($.attributes)
    ),

    // AIDEV-NOTE: Links support both inline [text](url) and reference [text][ref] syntax
    // Link text can contain inline formatting
    link: ($) => seq(
      "[",
      alias(repeat1($._link_text_content), $.link_text),
      "]",
      choice(
        // Inline link: (url)
        seq(
          token.immediate("("),
          alias(/[^\n)]+/, $.link_destination),
          ")"
        ),
        // Reference link: [ref] or [] (empty uses text as ref)
        seq(
          token.immediate("["),
          optional(alias(/[^\n\]]+/, $.link_label)),
          "]"
        )
      ),
      optional($.attributes)
    ),
    
    _link_text_content: ($) => choice(
      $.verbatim,
      $.strong_emphasis,
      $.emphasis,
      /[^\]\n]/
    ),

    // AIDEV-NOTE: Spans use [text]{attributes} for generic inline containers
    // Similar to links but with required attributes instead of destination
    // Use token.immediate to ensure { follows ] without space
    span: ($) => seq(
      "[",
      alias(repeat1($._link_text_content), $.span_text),
      "]",
      token.immediate("{"),
      optional(/\s+/),
      repeat(
        seq(
          choice(
            $.attribute_id,
            $.attribute_class,
            $.attribute_key_value
          ),
          optional(/\s+/)
        )
      ),
      "}"
    ),

    // AIDEV-NOTE: Math uses $ or $$ prefix with backticks for inline/display math
    // $`x = 1` for inline, $$`x = 1` for display
    // Content is literal (no escapes), supports variable backtick lengths
    math: (_) => token(choice(
      // Display math ($$)
      seq("$$`", /[^`\n]+/, "`"),
      seq("$$``", /[^`\n]([^`\n]|`[^`])*/, "``"),
      seq("$$```", /[^`\n]([^`\n]|`[^`]|``[^`])*/, "```"),
      // Inline math ($)
      seq("$`", /[^`\n]+/, "`"),
      seq("$``", /[^`\n]([^`\n]|`[^`])*/, "``"),
      seq("$```", /[^`\n]([^`\n]|`[^`]|``[^`])*/, "```")
    )),

    // AIDEV-NOTE: Verbatim/code spans use backticks with variable lengths
    // Content is literal (no escapes), single space stripped if content starts/ends with backtick
    // For simplicity, we support 1-4 backtick delimiters explicitly
    verbatim: (_) => token(choice(
      // Single backtick
      seq("`", /[^`\n]+/, "`"),
      // Double backtick
      seq("``", /[^`\n]([^`\n]|`[^`])*/, "``"),
      // Triple backtick
      seq("```", /[^`\n]([^`\n]|`[^`]|``[^`])*/, "```"),
      // Quad backtick
      seq("````", /[^`\n]([^`\n]|`[^`]|``[^`]|```[^`])*/, "````")
    )),
    
    emphasis: ($) => prec.left(seq("_", $._inline, "_", optional($.attributes))),
    strong_emphasis: ($) => prec.left(seq("*", $._inline, "*", optional($.attributes))),
    
    // AIDEV-NOTE: Superscript and subscript use ^ and ~ delimiters
    superscript: ($) => prec.left(seq("^", $._inline, "^", optional($.attributes))),
    subscript: ($) => prec.left(seq("~", $._inline, "~", optional($.attributes))),
    
    // prec.dynamic() is used during conflict resolution to choose which
    // branch to choose if multiple succeed.
    _fallback: (_) => prec.dynamic(-100, "_"),
    _fallback_star: (_) => prec.dynamic(-100, "*"),
    _fallback_caret: (_) => prec.dynamic(-100, "^"),
    _fallback_tilde: (_) => prec.dynamic(-100, "~"),
    _fallback_exclamation: (_) => prec.dynamic(-100, "!"),
    _text: (_) => /[^\n]/,
  },

  externals: ($) => [
    $._close_paragraph,
    $._block_close,
    $._div_marker_begin,
    $._div_marker_end,
    $._block_quote_begin,

    // This is used in the scanner internally,
    // but shouldn't be used by the grammar.
    $._ignored,
  ],
});
