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

#==[ Basics ]===================================================================

_ -> [\s]:* {% (d) => null %}
grp[SAFE, UNSAFE] -> ( "{" $UNSAFE:? "}" | $SAFE ):+

label -> grp[[^{}@], label]

#==[ Arrows ]===================================================================

empty_arrow -> "@."

horizontal_equals -> "@="
vertical_equals -> "@|" | "@\\vert"

labeled_arrow[SEP, LAB] -> "@" _ $SEP $LAB:? $SEP $LAB:? $SEP

up_arrow ->    labeled_arrow["A", grp[[^{}@A], label]]
down_arrow ->  labeled_arrow["V", grp[[^{}@V], label]]
left_arrow ->  labeled_arrow["<", grp[[^{}@<], label]]
             | labeled_arrow["(", grp[[^{}@(], label]]
right_arrow -> labeled_arrow[">", grp[[^{}@>], label]]
             | labeled_arrow[")", grp[[^{}@)], label]]

#==[ Layout ]===================================================================

node -> label
horizontal_edge -> empty_arrow | horizontal_equals | left_arrow | right_arrow
vertical_edge -> empty_arrow | vertical_equals | up_arrow | down_arrow

odd_row -> node ( horizontal_edge node ):*
even_row -> _ vertical_edge ( _ vertical_edge ):* _
matrix -> odd_row ( "\\\\" even_row "\\\\" odd_row ):*

#==[ Main ]=====================================================================

main -> "\\begin{CD}" matrix "\\end{CD}"
