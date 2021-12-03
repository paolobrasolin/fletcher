// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }

export const enum Op {
    Sum = "+",
    Sub = "-",
    Mul = "*",
    Div = "/",
    Exp = "^",
};
export type BinOp = [Op, number, number];

interface NearleyToken {
  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: undefined,
  ParserRules: [
    {"name": "main", "symbols": ["_", "AS", "_"], "postprocess": (d) => d[1]},
    {"name": "AS", "symbols": ["AS", "_", {"literal":"+"}, "_", "MD"], "postprocess": (d): BinOp => [Op.Sum, d[0], d[4]]},
    {"name": "AS", "symbols": ["AS", "_", {"literal":"-"}, "_", "MD"], "postprocess": (d): BinOp => [Op.Sub, d[0], d[4]]},
    {"name": "AS", "symbols": ["MD"], "postprocess": id},
    {"name": "MD", "symbols": ["MD", "_", {"literal":"*"}, "_", "E"], "postprocess": (d): BinOp => [Op.Mul, d[0], d[4]]},
    {"name": "MD", "symbols": ["MD", "_", {"literal":"/"}, "_", "E"], "postprocess": (d): BinOp => [Op.Div, d[0], d[4]]},
    {"name": "MD", "symbols": ["E"], "postprocess": id},
    {"name": "E", "symbols": ["P", "_", {"literal":"^"}, "_", "E"], "postprocess": (d): BinOp => [Op.Exp, d[0], d[4]]},
    {"name": "E", "symbols": ["P"], "postprocess": id},
    {"name": "P", "symbols": [{"literal":"("}, "_", "AS", "_", {"literal":")"}], "postprocess": (d) => d[2]},
    {"name": "P", "symbols": ["N"], "postprocess": id},
    {"name": "N", "symbols": [{"literal":"-"}, "float"], "postprocess": (d) => -d[1]},
    {"name": "N$ebnf$1", "symbols": [{"literal":"+"}], "postprocess": id},
    {"name": "N$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "N", "symbols": ["N$ebnf$1", "float"], "postprocess": (d) => +d[1]},
    {"name": "float", "symbols": ["int", {"literal":"."}, "int"], "postprocess": (d) => parseFloat(d[0] + d[1] + d[2])},
    {"name": "float", "symbols": ["int"], "postprocess": (d) => parseInt(d[0])},
    {"name": "int$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "int$ebnf$1", "symbols": ["int$ebnf$1", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "int", "symbols": ["int$ebnf$1"], "postprocess": (d) => d[0].join("")},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[\s]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": (d) => null}
  ],
  ParserStart: "main",
};

export default grammar;
