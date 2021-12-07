#==[ References ]===============================================================

# The whole grammar is structured after [RM].
# Still, there are other useful references to keep in mind.
#
# [WS]: Xy-pic — Typesetting Graphs and Diagrams in TeX.
#       Kristoffer H. Rose.
#       https://tug.org/applications/Xy-pic/
#
# [UG]: XY-pic User's Guide.
#       Kristoffer H. Rose.
#       Version 3.8.9 2013/10/06.
#       https://ctan.mirror.garr.it/mirrors/ctan/macros/generic/diagrams/xypic/doc/xyguide.pdf
#
# [RM]: XY-pic Reference Manual.
#       Kristoffer H. Rose and Ross R. Moore.
#       Version 3.8.9 2013/10/06.
#       https://ctan.mirror.garr.it/mirrors/ctan/macros/generic/diagrams/xypic/doc/xyrefer.pdf

#==[ Extra JS and postprocessors ]=============================================

@preprocessor typescript

@{%
const stripSepAndFlatten = function<Item>(head : Item, tail : [any, Item][]) : Item[] {
    return [head, ...tail.map(([_, item]) => item)]
}

const deepJoin = function(data : any[] | string) : string {
  if (typeof data === "string") return data
  return data.map(deepJoin).join("")
}
%}

#==[ Basic TeX ]================================================================

letter -> [a-zA-Z]
nonletter -> [^a-zA-Z]
digit -> [0-9]
space -> " "

sign -> [+-]
integer -> sign:? digit:+
decimal -> sign:? ( digit:+ | digit:* "." digit:* )

# https://tex.stackexchange.com/a/41371
unit ->
      "pt"
    | "pc"
    | "in"
    | "bp"
    | "cm"
    | "mm"
    | "dd"
    | "cc"
    | "sp"
    | "ex"
    | "em"
    # | "mu" # only in math mode
    # | "px" # only in pdfTeX and LuaTeX

active_character -> [~]

control_sequence ->
      "\\" letter:+
    | "\\" nonletter
    | active_character

tex_code ->
  (
    [^{}\\]:+
  | "{" tex_code "}"
  | control_sequence
  ):* {% deepJoin %}

tex_code_nonempty ->
  (
    [^{}\\]:+
  | "{" tex_code "}"
  | control_sequence
  ):+ {% deepJoin %}

#==[ Completion ]===============================================================

# Some rules are mentioned and never explained in [RM]; we define them here.

name -> letter:+ # TODO: what are allowed chars for filenames?
cs -> control_sequence

#██[ I | The Kernel ]███████████████████████████████████████████████████████████

#--[ Footnote 2 ]---------------------------------------------------------------

empty -> null
id -> letter:+ # TODO: letter:+ is too restrictive, should this be just tex_code?
dimen -> decimal unit
factor -> decimal
number -> integer
text -> tex_code

#■■[ I.2 | Picture Basics ]■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

xy -> "\\xy" pos decor "\\endxy"

#■■[ I.3 | Positions ]■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

#--[ Fig. 1 | <pos>itions ]-----------------------------------------------------

pos ->
    # DIFF: unlike [RM], we avoid left recursion
    coord (
        "+" coord
      | "-" coord
      | "!" coord
      | "." coord
      | "," coord
      | ";" coord
      | ":" coord
      # FIXME: <::> is ambiguous because <coord> can be <empty>
      | "::" coord
      | "*" object
      | "**" object
      | "?" place
      | "@" stacking
      | "=" saving
    ):*

coord ->
      vector
    | empty
    | "c"
    | "p"
    | "x"
    | "y"
    | "s" digit
    | "s" "{" number "}"
    | "\"" id "\""
    | "{" pos decor "}"

vector ->
      "0"
    | "<" dimen "," dimen ">"
    | "<" dimen ">"
    | "(" factor "," factor ")"
    | "a" "(" number ")"
    | corner
    | corner "(" factor ")"
    | "/" direction dimen "/"

corner ->
      "L"
    | "R"
    | "D"
    | "U"
    | "CL"
    | "CR"
    | "CD"
    | "CU"
    | "C"
    | "LD"
    | "RD"
    | "LU"
    | "RU"
    | "E"
    | "P"
    | "A"

place ->
      "<" place
    | ">" place
    | "(" factor ")" place
    | slide
    # DIFF: we removed the trailing optional <slide>, it doesn't compile!
    | "!" "{" pos "}"

slide ->
    # DIFF: we remove <empty> due to change in <place>
    "/" dimen "/"

#--[ I.3.3o ]-------------------------------------------------------------------

stacking ->
      "+" coord
    | "-" coord
    | "=" coord
    | "@" coord
    | "i"
    | "("
    | ")"

#--[ I.3.3p ]-------------------------------------------------------------------

saving ->
      ":"   "\"" id "\""
    | coord "\"" id "\""
    | "@"   "\"" id "\""

#■■[ I.4 | Objects ]■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

#--[ Fig. 3 | <object>s ]-------------------------------------------------------

object ->
    # DIFF: unlike [RM], we avoid right recursion
    modifier:* objectbox

objectbox ->
      "{" text "}"
    | library_object
    | "@" dir
    | tex_box "{" text "}"
    | "\\object" object
    | "\\composite" "{" composite "}"
    | "\\xybox" "{" pos decor "}"

modifier ->
      "!" vector
    | "!" object
    | add_op size
    | "h"
    | "i"
    | "[" shape "]"
    | "[=" shape "]"
    | direction

add_op -> "+" | "-" | "=" | "+=" | "-="

size -> empty | vector

direction ->
      diag
    | "v" vector
    | "q{" pos decor "}"
    | direction ":" vector
    | direction "_"
    | direction "^"

diag ->
    # DIFF: empty would make modifiers:* non terminating for <object>
      # empty
      "l" | "r" | "d" | "u"
    | "ld" | "rd" | "lu" | "ru"

composite ->
    # DIFF: unlike [RM], we avoid left recursion
    object ("*" object):*

#--[ I.4.4b ]-------------------------------------------------------------------

# NOTE: any macro expanding to a <box> is allowed (but ofc we can't expand)
tex_box -> box
box -> "\\hbox" # TODO: what else is allowed?

#--[ I.4.4j ]-------------------------------------------------------------------

# TODO: this admits extensions, how will we handle it?
shape -> empty | "." | "x" | "r" | "l" | "u" | "d"

#■■[ I.5 | Decorations ]■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

#--[ Fig. 4 | <decor>ations ]---------------------------------------------------

# DIFF: unlike [RM], we avoid left recursion
decor ->
    command:*

command ->
      "\\save" pos
    | "\\restore"
    | "\\POS" pos
    | "\\afterPOS" "{" decor "}" pos
    | "\\drop" object
    | "\\connect" object
    | "\\relax"
    | tex_commands # TODO
    | "\\xyverbose"
    | "\\xytracing"
    | "\\xyquiet"
    | "\\xyignore" "{" pos decor "}"
    | "\\xycompile" "{" pos decor "}"
    | "\\xycompileto" "{" name "}" "{" pos decor "}"

#■■[ I.6 | Kernel object library ]■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

library_object -> dir_obj | cir_obj | txt_obj

#==[ I.6.1 | <dir>ectionals ]===================================================

dir_obj -> "\\dir" dir

#--[ Fig. 5 | Kernel library <dir>ectionals ]-----------------------------------

# TODO: there's some more complexity to this.
# TODO: what's the best way to handle extensions?
dir -> variant "{" ( tipchar:* | connchar:* ) "}"
variant -> empty | [^_0123]

#==[ I.6.2 | Circle segments ]==================================================

cir_obj -> "\\cir" radius "{" cir "}"

#--[ Fig. 6 | <cir>cles ]-------------------------------------------------------

radius ->
      empty
    | vector

cir ->
      empty
    | diag orient diag

orient ->
      "^"
    | "_"

#==[ I.6.3 | Text ]=============================================================

# TODO: this definitely needs some more thought.

txt_obj -> "\\txt" width style "{" text "}"
width -> empty | "<" dimen ">"
style -> empty # TODO

#██[ II | Extensions ]██████████████████████████████████████████████████████████

# TODO

#██[ III | Features ]███████████████████████████████████████████████████████████

#■■[ III.24 | Arrow and Path feature ]■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

#==[ III.24.1 | Paths ]=========================================================

PATH -> "\\PATH" path
afterPATH -> "\\afterPATH" "{" decor "}" path

#--[ Fig. 14 | <path>s ]--------------------------------------------------------

path ->
      "~" action "{" stuff "}" path
    | "~" which "{" labels "}" path
    | "~" "{" stuff "}" path
    | "’" segment path
    | "‘" turn segment path
    | segment

turn ->
      diag turnradius
    | cir turnradius

turnradius ->
      empty
    | "/" dimen

segment -> path_pos slide labels

slide -> empty | "<" dimen ">"

labels ->
      "^" anchor it alias labels
    | "_" anchor it alias labels
    | "|" anchor it alias labels
    | empty

anchor -> "-" anchor | place

it ->
      digit | letter | "{" text "}" | cs
    | "*" object
    | "@" dir
    | "[" shape "]" it

alias -> empty | "=\"" id "\""

#--[ III.24.1.24a ]-------------------------------------------------------------

action -> "=" | "/"

# NOTE: this is not universal
stuff -> pos decor

#--[ III.24.1.24b ]-------------------------------------------------------------

which -> "<" | ">" | "="

#--[ III.24.1.24e ]-------------------------------------------------------------

# NOTE: this is not universal
path_pos -> pos

#==[ III.24.2 | Arrows ]========================================================

#--[ Fig. 15 | <arrow>s ]-------------------------------------------------------

ar -> "\\ar" arrow path

arrow -> form:*

form -> # TODO: this is kinda broken
      "@" variant
    | "@" variant "{" tip "}"
    | "@" variant "{" tip conn tip "}"
    | "@" connchar
    | "@!"
    | "@/" direction dist "/"
    | "@(" direction "," direction ")"
    | "@‘" "{" control_point_list "}"
    | "@[" shape "]"
    | "@*" "{" modifier:* "}"
    | "@<" dimen ">"
    | "|" anchor it
    | "^" anchor it
    | "_" anchor it
    | "@?"

tip -> tipchar:* | dir
tipchar -> [<>()|’‘+/] | letter | digit | space

conn -> connchar:* | dir
connchar -> [-.~=:]

#--[ III.24.2.24o ]-------------------------------------------------------------

dist -> dimen

#--[ III.24.2.241 ]-------------------------------------------------------------

# control_point_list -> TODO

#■■[ III.25 | Two-cell feature ]■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

# TODO

#--[ Fig. 17 | <twocell>s ]-----------------------------------------------------

# TODO

#■■[ III.26 | Matrix feature ]■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

# TODO: this is just an experiment; we need the real thing.

main -> _ "\\xymatrix" _ "{" entries "}" _  {% (d) => d[4] %}
entries -> row ("\\\\" row):*               {% ([d, ds]) => stripSepAndFlatten(d, ds) %}
row -> cell ("&" cell):*                    {% ([d, ds]) => stripSepAndFlatten(d, ds) %}
cell -> [^&\\]:*                            {% (d) : string => d[0].join("").trim() %}
_ -> [\s]:*                                 {% (d) => null %}
