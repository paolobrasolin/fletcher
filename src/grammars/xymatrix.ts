// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }

const stripSepAndFlatten = function<Item>(head : Item, tail : [any, Item][]) : Item[] {
    return [head, ...tail.map(([_, item]) => item)]
}

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
    {"name": "main$string$1", "symbols": [{"literal":"\\"}, {"literal":"x"}, {"literal":"y"}, {"literal":"m"}, {"literal":"a"}, {"literal":"t"}, {"literal":"r"}, {"literal":"i"}, {"literal":"x"}], "postprocess": (d) => d.join('')},
    {"name": "main", "symbols": ["_", "main$string$1", "_", {"literal":"{"}, "entries", {"literal":"}"}, "_"], "postprocess": (d) => d[4]},
    {"name": "entries$ebnf$1", "symbols": []},
    {"name": "entries$ebnf$1$subexpression$1$string$1", "symbols": [{"literal":"\\"}, {"literal":"\\"}], "postprocess": (d) => d.join('')},
    {"name": "entries$ebnf$1$subexpression$1", "symbols": ["entries$ebnf$1$subexpression$1$string$1", "row"]},
    {"name": "entries$ebnf$1", "symbols": ["entries$ebnf$1", "entries$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "entries", "symbols": ["row", "entries$ebnf$1"], "postprocess": ([d, ds]) => stripSepAndFlatten(d, ds)},
    {"name": "row$ebnf$1", "symbols": []},
    {"name": "row$ebnf$1$subexpression$1", "symbols": [{"literal":"&"}, "cell"]},
    {"name": "row$ebnf$1", "symbols": ["row$ebnf$1", "row$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "row", "symbols": ["cell", "row$ebnf$1"], "postprocess": ([d, ds]) => stripSepAndFlatten(d, ds)},
    {"name": "cell$ebnf$1", "symbols": []},
    {"name": "cell$ebnf$1", "symbols": ["cell$ebnf$1", /[^&\\]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "cell", "symbols": ["cell$ebnf$1"], "postprocess": (d) : string => d[0].join("").trim()},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[\s]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": (d) => null}
  ],
  ParserStart: "main",
};

export default grammar;
