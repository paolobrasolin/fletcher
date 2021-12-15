#==[ References ]===============================================================

# [RM]: The amscd package.
#       Frank Mittelbach, Rainer Schöpf and Michael Downes.
#       Version v2.1 2017/04/14.
#       https://ctan.mirror.garr.it/mirrors/ctan/macros/latex/required/amsmath/amscd.pdf
#
# [JM]: Guide to Commutative Diagram Packages.
#       J.S. Milne.
#       https://www.jmilne.org/not/CDGuide.html

#==[ Extra JS and postprocessors ]=============================================

@preprocessor typescript

@{%

const deepJoin = function(data : any[] | string) : string {
  if (typeof data === "string") return data
  if (data === null) return ""
  return data.map(deepJoin).join("")
}

const squish = function(input : string) : string {
  return input.trim().replace(/\s+/g, ' ')
}

import { EdgeKind } from "./schema"

const sepToEdgeKind = function(input : string) : EdgeKind | undefined {
  return {
    ".": EdgeKind.Empty,
    "=": EdgeKind.HorizontalEquals,
    "|": EdgeKind.VerticalEquals,
    "\\vert": EdgeKind.VerticalEquals,
    "A": EdgeKind.UpArrow,
    "V": EdgeKind.DownArrow,
    "<": EdgeKind.LeftArrow,
    "(": EdgeKind.LeftArrow,
    ">": EdgeKind.RightArrow,
    ")": EdgeKind.RightArrow,
  }[input]
}

%}

#==[ Basics ]===================================================================

_ -> [\s]:* {% () => null %}
grp[SAFE, UNSAFE] -> ( "{" $UNSAFE:? "}" | $SAFE ):+

label -> grp[[^{}@], label] {% (d) => deepJoin(d) %}

#==[ Arrows ]===================================================================

unlabeled_arrow[SEP] -> "@" _ $SEP
  {% (d) => [sepToEdgeKind(d[2][0])] %}

empty_arrow       -> unlabeled_arrow["."]      {% id %}
horizontal_equals -> unlabeled_arrow["="]      {% id %}
vertical_equals   -> unlabeled_arrow["|"]      {% id %}
                   | unlabeled_arrow["\\vert"] {% id %}

labeled_arrow[SEP, LAB] -> "@" _ $SEP $LAB:? $SEP $LAB:? $SEP
  {% (d) => [sepToEdgeKind(d[2][0]), squish(deepJoin(d[3])), squish(deepJoin(d[5]))] %}

up_arrow    -> labeled_arrow["A", grp[[^{}@A], label]] {% id %}
down_arrow  -> labeled_arrow["V", grp[[^{}@V], label]] {% id %}
left_arrow  -> labeled_arrow["<", grp[[^{}@<], label]] {% id %}
             | labeled_arrow["(", grp[[^{}@(], label]] {% id %}
right_arrow -> labeled_arrow[">", grp[[^{}@>], label]] {% id %}
             | labeled_arrow[")", grp[[^{}@)], label]] {% id %}

#==[ Layout ]===================================================================

node -> label {% (d) => squish(d[0]) %}

horizontal_edge -> empty_arrow        {% id %}
                 | horizontal_equals  {% id %}
                 | left_arrow         {% id %}
                 | right_arrow        {% id %}

vertical_edge   -> empty_arrow        {% id %}
                 | vertical_equals    {% id %}
                 | up_arrow           {% id %}
                 | down_arrow         {% id %}

odd_row -> node ( horizontal_edge node ):*
  {% ([x, xs]) => [x, ...xs.flat(1)] %}

even_row -> ( _ vertical_edge ):+ _
  {% (d) => d.flat(2).slice(1,-1) %}

row_sep -> "\\\\" {% () => null %}

matrix -> odd_row ( row_sep even_row row_sep odd_row ):*
  {% ([r, rs]) => [r, ...rs.flat(1).filter((x : any) => x)] %}

#==[ Main ]=====================================================================

main -> "\\begin{CD}" matrix "\\end{CD}"
  {% (d) => d[1] %}
