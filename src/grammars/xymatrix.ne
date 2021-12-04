@preprocessor typescript

@{%
const stripSepAndFlatten = function<Item>(head : Item, tail : [any, Item][]) : Item[] {
    return [head, ...tail.map(([_, item]) => item)]
}
%}

main -> _ "\\xymatrix" _ "{" entries "}" _  {% (d) => d[4] %}

entries -> row ("\\\\" row):*               {% ([d, ds]) => stripSepAndFlatten(d, ds) %}

row -> cell ("&" cell):*                    {% ([d, ds]) => stripSepAndFlatten(d, ds) %}

cell -> [^&\\]:*                            {% (d) : string => d[0].join("").trim() %}

_ -> [\s]:*                                 {% (d) => null %}
