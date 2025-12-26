module.exports = grammar({
  name: "sdjot",

  // Skip carriage returns.
  // We could skip spaces here as well, but the actual markup language
  // has significant spaces in some places, so let's remove them here too.
  extras: (_) => ["\r"],

  conflicts: ($) => [[$.emphasis, $._fallback]],

  rules: {
    document: ($) => repeat($._block),

    // All blocks should end with a newline, but we can also parse multiple newlines.
    _block: ($) => choice($.div, $.code_block, $.paragraph, "\n"),

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
    _inline: ($) => repeat1(choice($.emphasis, $._text, $._fallback)),
    emphasis: ($) => prec.left(seq("_", $._inline, "_", optional($.attributes))),
    // prec.dynamic() is used during conflict resolution to choose which
    // branch to choose if multiple succeed.
    _fallback: (_) => prec.dynamic(-100, "_"),
    _text: (_) => /[^\n]/,
  },

  externals: ($) => [
    $._close_paragraph,
    $._block_close,
    $._div_marker_begin,
    $._div_marker_end,

    // This is used in the scanner internally,
    // but shouldn't be used by the grammar.
    $._ignored,
  ],
});
