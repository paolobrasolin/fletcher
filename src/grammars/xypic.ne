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

main -> _ "\\xymatrix" _ "{" entries "}" _  {% (d) => d[4] %}

entries -> row ("\\\\" row):*               {% ([d, ds]) => stripSepAndFlatten(d, ds) %}

row -> cell ("&" cell):*                    {% ([d, ds]) => stripSepAndFlatten(d, ds) %}

cell -> [^&\\]:*                            {% (d) : string => d[0].join("").trim() %}

_ -> [\s]:*                                 {% (d) => null %}

#==[ Common ]===================================================================

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

#==============================================================================

# [RM, footnote 2]
empty -> null
id -> letter:+ # TODO: letter:+ is too restrictive, should this be just tex_code?
dimen -> decimal unit
factor -> decimal
number -> integer
text -> tex_code

cs -> control_sequence
# stuff -> TODO
# name -> TODO

# shape -> TODO # [RM, 4j]

# library_object -> TODO # [RM, §6]
# tex_box -> TODO # [RM, 4b]



#==[ Picture Basics [RM, §2] ]==================================================

xy -> "\\xy" pos decor "\\endxy"

#==[ <pos>itions ]==============================================================

#--[ [RM], Fig. 1 ]-------------------------------------------------------------

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

#--[ Cetera ]-------------------------------------------------------------------

# [RM, 3o]
stacking ->
      "+" coord
    | "-" coord
    | "=" coord
    | "@" coord
    | "i"
    | "("
    | ")"

# [RM, 3p]
saving ->
      ":"   "\"" id "\""
    | coord "\"" id "\""
    | "@"   "\"" id "\""

#==[ <object>s ]================================================================

#--[ [RM], Fig. 3 ]-------------------------------------------------------------

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
      object
    | composite "*" object

#==[ <decor>ations ]============================================================

#--[ [RM, Fig. 4] ]-------------------------------------------------------------

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
    | tex_commands
    | "\\xyverbose"
    | "\\xytracing"
    | "\\xyquiet"
    | "\\xyignore" "{" pos decor "}"
    | "\\xycompile" "{" pos decor "}"
    | "\\xycompileto" "{" name "}" "{" pos decor "}"

#--[ Cetera ]-------------------------------------------------------------------

# [RM, Fig. 4]
# tex_commands -> TODO

#==[ <dir>ectionals ]===========================================================

# NOTE: there's some more complexity to this, see [RM, Fig 5].

# [RM, §6.1]
dir -> variant "{" ( tipchar:* | connchar:* ) "}"
variant -> empty | [^_0123]

#==[ <cir>cles ]================================================================

#--[ [RM], Fig. 6 ]-------------------------------------------------------------

radius ->
      empty
    | vector

cir ->
      empty
    | diag orient diag

orient ->
      "^"
    | "_"

#==[ Arrow and Path feature, [RM, §24] ]========================================

#--[ <path>s, [RM, Fig. 14] ]---------------------------------------------------

PATH -> "\\PATH" path
afterPATH -> "\\afterPATH" "{" decor "}" path

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

#--[ Cetera ]-------------------------------------------------------------------

# [RM, 24a]
action -> "=" | "/"

# [RM, 24b]
which -> "<" | ">" | "="

# NOTE: this is not universal
# [RM, 24e]
path_pos -> pos

# NOTE: this is not universal
# [RM, 24a]
stuff -> pos decor

#==[ <arrow>s ]=================================================================

#--[ [RM], Fig. 15 ]------------------------------------------------------------

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

#--[ Cetera ]-------------------------------------------------------------------

# [RM, 24o]
dist -> dimen

# [RM, 24b]
which -> "<" | ">" | "="

# [RM, 24q]
# control_point_list -> TODO

#==[ <twocell>s ]===============================================================

#--[ [RM], Fig. 17 ]------------------------------------------------------------

# TODO

#==[ Bibliography ]=============================================================

# [WS]: Xy-pic — Typesetting Graphs and Diagrams in TeX.
#       Kristoffer H. Rose.
#       https://tug.org/applications/Xy-pic/

# [UG]: XY-pic User's Guide.
#       Kristoffer H. Rose.
#       Version 3.8.9 2013/10/06.
#       https://ctan.mirror.garr.it/mirrors/ctan/macros/generic/diagrams/xypic/doc/xyguide.pdf

# [RM]: XY-pic Reference Manual.
#       Kristoffer H. Rose and Ross R. Moore.
#       Version 3.8.9 2013/10/06.
#       https://ctan.mirror.garr.it/mirrors/ctan/macros/generic/diagrams/xypic/doc/xyrefer.pdf
