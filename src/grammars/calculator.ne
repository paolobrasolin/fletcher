@preprocessor typescript

@{%
export const enum Op {
    Sum = "+",
    Sub = "-",
    Mul = "*",
    Div = "/",
    Exp = "^",
};
export type BinOp = [Op, number, number];
%}

main -> _ AS _      {% (d) => d[1] %}

AS -> AS _ "+" _ MD {% (d): BinOp => [Op.Sum, d[0], d[4]] %}
    | AS _ "-" _ MD {% (d): BinOp => [Op.Sub, d[0], d[4]] %}
    | MD            {% id %}

MD -> MD _ "*" _ E  {% (d): BinOp => [Op.Mul, d[0], d[4]] %}
    | MD _ "/" _ E  {% (d): BinOp => [Op.Div, d[0], d[4]] %}
    | E             {% id %}

E -> P _ "^" _ E    {% (d): BinOp => [Op.Exp, d[0], d[4]] %}
    | P             {% id %}

P -> "(" _ AS _ ")" {% (d) => d[2] %}
    | N             {% id %}

N -> "-" float      {% (d) => -d[1] %}
    | "+":? float   {% (d) => +d[1] %}

float ->
      int "." int   {% (d) => parseFloat(d[0] + d[1] + d[2]) %}
    | int           {% (d) => parseInt(d[0]) %}

int -> [0-9]:+      {% (d) => d[0].join("") %}

_ -> [\s]:*         {% (d) => null %}
