module.exports = grammar({
  name: "sdjot",

  // Skip carriage returns.
  // We could skip spaces here as well, but the actual markup language
  // has significant spaces in some places, so let's remove them here too.
  extras: (_) => ["\r"],

  conflicts: ($) => [
    [$.emphasis, $._fallback],
    [$.strong_emphasis, $._fallback_star]
  ],

  rules: {
    document: ($) => repeat($._block),

    // All blocks should end with a newline, but we can also parse multiple newlines.
    _block: ($) => choice($.heading, $.block_quote, $.div, $.code_block, $.paragraph, "\n"),

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

    // Code blocks may have a language specifier.
    code_block: ($) =>
      seq(
        $.code_block_marker,
        optional($.language),
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
    _inline: ($) => repeat1(choice($.verbatim, $.strong_emphasis, $.emphasis, $._text, $._fallback, $._fallback_star)),
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
    // prec.dynamic() is used during conflict resolution to choose which
    // branch to choose if multiple succeed.
    _fallback: (_) => prec.dynamic(-100, "_"),
    _fallback_star: (_) => prec.dynamic(-100, "*"),
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
