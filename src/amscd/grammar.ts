// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }


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
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[\s]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": () => null},
    {"name": "label$macrocall$2", "symbols": [/[^{}@]/]},
    {"name": "label$macrocall$3", "symbols": ["label"]},
    {"name": "label$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": ["label$macrocall$3"], "postprocess": id},
    {"name": "label$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "label$macrocall$1$ebnf$1$subexpression$1", "symbols": [{"literal":"{"}, "label$macrocall$1$ebnf$1$subexpression$1$ebnf$1", {"literal":"}"}]},
    {"name": "label$macrocall$1$ebnf$1$subexpression$1", "symbols": ["label$macrocall$2"]},
    {"name": "label$macrocall$1$ebnf$1", "symbols": ["label$macrocall$1$ebnf$1$subexpression$1"]},
    {"name": "label$macrocall$1$ebnf$1$subexpression$2$ebnf$1", "symbols": ["label$macrocall$3"], "postprocess": id},
    {"name": "label$macrocall$1$ebnf$1$subexpression$2$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "label$macrocall$1$ebnf$1$subexpression$2", "symbols": [{"literal":"{"}, "label$macrocall$1$ebnf$1$subexpression$2$ebnf$1", {"literal":"}"}]},
    {"name": "label$macrocall$1$ebnf$1$subexpression$2", "symbols": ["label$macrocall$2"]},
    {"name": "label$macrocall$1$ebnf$1", "symbols": ["label$macrocall$1$ebnf$1", "label$macrocall$1$ebnf$1$subexpression$2"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "label$macrocall$1", "symbols": ["label$macrocall$1$ebnf$1"]},
    {"name": "label", "symbols": ["label$macrocall$1"], "postprocess": (d) => deepJoin(d)},
    {"name": "empty_arrow$macrocall$2", "symbols": [{"literal":"."}]},
    {"name": "empty_arrow$macrocall$1", "symbols": [{"literal":"@"}, "_", "empty_arrow$macrocall$2"], "postprocess": (d) => [sepToEdgeKind(d[2][0])]},
    {"name": "empty_arrow", "symbols": ["empty_arrow$macrocall$1"], "postprocess": id},
    {"name": "horizontal_equals$macrocall$2", "symbols": [{"literal":"="}]},
    {"name": "horizontal_equals$macrocall$1", "symbols": [{"literal":"@"}, "_", "horizontal_equals$macrocall$2"], "postprocess": (d) => [sepToEdgeKind(d[2][0])]},
    {"name": "horizontal_equals", "symbols": ["horizontal_equals$macrocall$1"], "postprocess": id},
    {"name": "vertical_equals$macrocall$2", "symbols": [{"literal":"|"}]},
    {"name": "vertical_equals$macrocall$1", "symbols": [{"literal":"@"}, "_", "vertical_equals$macrocall$2"], "postprocess": (d) => [sepToEdgeKind(d[2][0])]},
    {"name": "vertical_equals", "symbols": ["vertical_equals$macrocall$1"], "postprocess": id},
    {"name": "vertical_equals$macrocall$4$string$1", "symbols": [{"literal":"\\"}, {"literal":"v"}, {"literal":"e"}, {"literal":"r"}, {"literal":"t"}], "postprocess": (d) => d.join('')},
    {"name": "vertical_equals$macrocall$4", "symbols": ["vertical_equals$macrocall$4$string$1"]},
    {"name": "vertical_equals$macrocall$3", "symbols": [{"literal":"@"}, "_", "vertical_equals$macrocall$4"], "postprocess": (d) => [sepToEdgeKind(d[2][0])]},
    {"name": "vertical_equals", "symbols": ["vertical_equals$macrocall$3"], "postprocess": id},
    {"name": "up_arrow$macrocall$2", "symbols": [{"literal":"A"}]},
    {"name": "up_arrow$macrocall$3$macrocall$2", "symbols": [/[^{}@A]/]},
    {"name": "up_arrow$macrocall$3$macrocall$3", "symbols": ["label"]},
    {"name": "up_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": ["up_arrow$macrocall$3$macrocall$3"], "postprocess": id},
    {"name": "up_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "up_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$1", "symbols": [{"literal":"{"}, "up_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$1$ebnf$1", {"literal":"}"}]},
    {"name": "up_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$1", "symbols": ["up_arrow$macrocall$3$macrocall$2"]},
    {"name": "up_arrow$macrocall$3$macrocall$1$ebnf$1", "symbols": ["up_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$1"]},
    {"name": "up_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$2$ebnf$1", "symbols": ["up_arrow$macrocall$3$macrocall$3"], "postprocess": id},
    {"name": "up_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$2$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "up_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$2", "symbols": [{"literal":"{"}, "up_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$2$ebnf$1", {"literal":"}"}]},
    {"name": "up_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$2", "symbols": ["up_arrow$macrocall$3$macrocall$2"]},
    {"name": "up_arrow$macrocall$3$macrocall$1$ebnf$1", "symbols": ["up_arrow$macrocall$3$macrocall$1$ebnf$1", "up_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$2"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "up_arrow$macrocall$3$macrocall$1", "symbols": ["up_arrow$macrocall$3$macrocall$1$ebnf$1"]},
    {"name": "up_arrow$macrocall$3", "symbols": ["up_arrow$macrocall$3$macrocall$1"]},
    {"name": "up_arrow$macrocall$1$ebnf$1", "symbols": ["up_arrow$macrocall$3"], "postprocess": id},
    {"name": "up_arrow$macrocall$1$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "up_arrow$macrocall$1$ebnf$2", "symbols": ["up_arrow$macrocall$3"], "postprocess": id},
    {"name": "up_arrow$macrocall$1$ebnf$2", "symbols": [], "postprocess": () => null},
    {"name": "up_arrow$macrocall$1", "symbols": [{"literal":"@"}, "_", "up_arrow$macrocall$2", "up_arrow$macrocall$1$ebnf$1", "up_arrow$macrocall$2", "up_arrow$macrocall$1$ebnf$2", "up_arrow$macrocall$2"], "postprocess": (d) => [sepToEdgeKind(d[2][0]), squish(deepJoin(d[3])), squish(deepJoin(d[5]))]},
    {"name": "up_arrow", "symbols": ["up_arrow$macrocall$1"], "postprocess": id},
    {"name": "down_arrow$macrocall$2", "symbols": [{"literal":"V"}]},
    {"name": "down_arrow$macrocall$3$macrocall$2", "symbols": [/[^{}@V]/]},
    {"name": "down_arrow$macrocall$3$macrocall$3", "symbols": ["label"]},
    {"name": "down_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": ["down_arrow$macrocall$3$macrocall$3"], "postprocess": id},
    {"name": "down_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "down_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$1", "symbols": [{"literal":"{"}, "down_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$1$ebnf$1", {"literal":"}"}]},
    {"name": "down_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$1", "symbols": ["down_arrow$macrocall$3$macrocall$2"]},
    {"name": "down_arrow$macrocall$3$macrocall$1$ebnf$1", "symbols": ["down_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$1"]},
    {"name": "down_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$2$ebnf$1", "symbols": ["down_arrow$macrocall$3$macrocall$3"], "postprocess": id},
    {"name": "down_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$2$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "down_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$2", "symbols": [{"literal":"{"}, "down_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$2$ebnf$1", {"literal":"}"}]},
    {"name": "down_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$2", "symbols": ["down_arrow$macrocall$3$macrocall$2"]},
    {"name": "down_arrow$macrocall$3$macrocall$1$ebnf$1", "symbols": ["down_arrow$macrocall$3$macrocall$1$ebnf$1", "down_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$2"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "down_arrow$macrocall$3$macrocall$1", "symbols": ["down_arrow$macrocall$3$macrocall$1$ebnf$1"]},
    {"name": "down_arrow$macrocall$3", "symbols": ["down_arrow$macrocall$3$macrocall$1"]},
    {"name": "down_arrow$macrocall$1$ebnf$1", "symbols": ["down_arrow$macrocall$3"], "postprocess": id},
    {"name": "down_arrow$macrocall$1$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "down_arrow$macrocall$1$ebnf$2", "symbols": ["down_arrow$macrocall$3"], "postprocess": id},
    {"name": "down_arrow$macrocall$1$ebnf$2", "symbols": [], "postprocess": () => null},
    {"name": "down_arrow$macrocall$1", "symbols": [{"literal":"@"}, "_", "down_arrow$macrocall$2", "down_arrow$macrocall$1$ebnf$1", "down_arrow$macrocall$2", "down_arrow$macrocall$1$ebnf$2", "down_arrow$macrocall$2"], "postprocess": (d) => [sepToEdgeKind(d[2][0]), squish(deepJoin(d[3])), squish(deepJoin(d[5]))]},
    {"name": "down_arrow", "symbols": ["down_arrow$macrocall$1"], "postprocess": id},
    {"name": "left_arrow$macrocall$2", "symbols": [{"literal":"<"}]},
    {"name": "left_arrow$macrocall$3$macrocall$2", "symbols": [/[^{}@<]/]},
    {"name": "left_arrow$macrocall$3$macrocall$3", "symbols": ["label"]},
    {"name": "left_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": ["left_arrow$macrocall$3$macrocall$3"], "postprocess": id},
    {"name": "left_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "left_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$1", "symbols": [{"literal":"{"}, "left_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$1$ebnf$1", {"literal":"}"}]},
    {"name": "left_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$1", "symbols": ["left_arrow$macrocall$3$macrocall$2"]},
    {"name": "left_arrow$macrocall$3$macrocall$1$ebnf$1", "symbols": ["left_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$1"]},
    {"name": "left_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$2$ebnf$1", "symbols": ["left_arrow$macrocall$3$macrocall$3"], "postprocess": id},
    {"name": "left_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$2$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "left_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$2", "symbols": [{"literal":"{"}, "left_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$2$ebnf$1", {"literal":"}"}]},
    {"name": "left_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$2", "symbols": ["left_arrow$macrocall$3$macrocall$2"]},
    {"name": "left_arrow$macrocall$3$macrocall$1$ebnf$1", "symbols": ["left_arrow$macrocall$3$macrocall$1$ebnf$1", "left_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$2"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "left_arrow$macrocall$3$macrocall$1", "symbols": ["left_arrow$macrocall$3$macrocall$1$ebnf$1"]},
    {"name": "left_arrow$macrocall$3", "symbols": ["left_arrow$macrocall$3$macrocall$1"]},
    {"name": "left_arrow$macrocall$1$ebnf$1", "symbols": ["left_arrow$macrocall$3"], "postprocess": id},
    {"name": "left_arrow$macrocall$1$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "left_arrow$macrocall$1$ebnf$2", "symbols": ["left_arrow$macrocall$3"], "postprocess": id},
    {"name": "left_arrow$macrocall$1$ebnf$2", "symbols": [], "postprocess": () => null},
    {"name": "left_arrow$macrocall$1", "symbols": [{"literal":"@"}, "_", "left_arrow$macrocall$2", "left_arrow$macrocall$1$ebnf$1", "left_arrow$macrocall$2", "left_arrow$macrocall$1$ebnf$2", "left_arrow$macrocall$2"], "postprocess": (d) => [sepToEdgeKind(d[2][0]), squish(deepJoin(d[3])), squish(deepJoin(d[5]))]},
    {"name": "left_arrow", "symbols": ["left_arrow$macrocall$1"], "postprocess": id},
    {"name": "left_arrow$macrocall$5", "symbols": [{"literal":"("}]},
    {"name": "left_arrow$macrocall$6$macrocall$2", "symbols": [/[^{}@(]/]},
    {"name": "left_arrow$macrocall$6$macrocall$3", "symbols": ["label"]},
    {"name": "left_arrow$macrocall$6$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": ["left_arrow$macrocall$6$macrocall$3"], "postprocess": id},
    {"name": "left_arrow$macrocall$6$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "left_arrow$macrocall$6$macrocall$1$ebnf$1$subexpression$1", "symbols": [{"literal":"{"}, "left_arrow$macrocall$6$macrocall$1$ebnf$1$subexpression$1$ebnf$1", {"literal":"}"}]},
    {"name": "left_arrow$macrocall$6$macrocall$1$ebnf$1$subexpression$1", "symbols": ["left_arrow$macrocall$6$macrocall$2"]},
    {"name": "left_arrow$macrocall$6$macrocall$1$ebnf$1", "symbols": ["left_arrow$macrocall$6$macrocall$1$ebnf$1$subexpression$1"]},
    {"name": "left_arrow$macrocall$6$macrocall$1$ebnf$1$subexpression$2$ebnf$1", "symbols": ["left_arrow$macrocall$6$macrocall$3"], "postprocess": id},
    {"name": "left_arrow$macrocall$6$macrocall$1$ebnf$1$subexpression$2$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "left_arrow$macrocall$6$macrocall$1$ebnf$1$subexpression$2", "symbols": [{"literal":"{"}, "left_arrow$macrocall$6$macrocall$1$ebnf$1$subexpression$2$ebnf$1", {"literal":"}"}]},
    {"name": "left_arrow$macrocall$6$macrocall$1$ebnf$1$subexpression$2", "symbols": ["left_arrow$macrocall$6$macrocall$2"]},
    {"name": "left_arrow$macrocall$6$macrocall$1$ebnf$1", "symbols": ["left_arrow$macrocall$6$macrocall$1$ebnf$1", "left_arrow$macrocall$6$macrocall$1$ebnf$1$subexpression$2"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "left_arrow$macrocall$6$macrocall$1", "symbols": ["left_arrow$macrocall$6$macrocall$1$ebnf$1"]},
    {"name": "left_arrow$macrocall$6", "symbols": ["left_arrow$macrocall$6$macrocall$1"]},
    {"name": "left_arrow$macrocall$4$ebnf$1", "symbols": ["left_arrow$macrocall$6"], "postprocess": id},
    {"name": "left_arrow$macrocall$4$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "left_arrow$macrocall$4$ebnf$2", "symbols": ["left_arrow$macrocall$6"], "postprocess": id},
    {"name": "left_arrow$macrocall$4$ebnf$2", "symbols": [], "postprocess": () => null},
    {"name": "left_arrow$macrocall$4", "symbols": [{"literal":"@"}, "_", "left_arrow$macrocall$5", "left_arrow$macrocall$4$ebnf$1", "left_arrow$macrocall$5", "left_arrow$macrocall$4$ebnf$2", "left_arrow$macrocall$5"], "postprocess": (d) => [sepToEdgeKind(d[2][0]), squish(deepJoin(d[3])), squish(deepJoin(d[5]))]},
    {"name": "left_arrow", "symbols": ["left_arrow$macrocall$4"], "postprocess": id},
    {"name": "right_arrow$macrocall$2", "symbols": [{"literal":">"}]},
    {"name": "right_arrow$macrocall$3$macrocall$2", "symbols": [/[^{}@>]/]},
    {"name": "right_arrow$macrocall$3$macrocall$3", "symbols": ["label"]},
    {"name": "right_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": ["right_arrow$macrocall$3$macrocall$3"], "postprocess": id},
    {"name": "right_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "right_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$1", "symbols": [{"literal":"{"}, "right_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$1$ebnf$1", {"literal":"}"}]},
    {"name": "right_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$1", "symbols": ["right_arrow$macrocall$3$macrocall$2"]},
    {"name": "right_arrow$macrocall$3$macrocall$1$ebnf$1", "symbols": ["right_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$1"]},
    {"name": "right_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$2$ebnf$1", "symbols": ["right_arrow$macrocall$3$macrocall$3"], "postprocess": id},
    {"name": "right_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$2$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "right_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$2", "symbols": [{"literal":"{"}, "right_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$2$ebnf$1", {"literal":"}"}]},
    {"name": "right_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$2", "symbols": ["right_arrow$macrocall$3$macrocall$2"]},
    {"name": "right_arrow$macrocall$3$macrocall$1$ebnf$1", "symbols": ["right_arrow$macrocall$3$macrocall$1$ebnf$1", "right_arrow$macrocall$3$macrocall$1$ebnf$1$subexpression$2"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "right_arrow$macrocall$3$macrocall$1", "symbols": ["right_arrow$macrocall$3$macrocall$1$ebnf$1"]},
    {"name": "right_arrow$macrocall$3", "symbols": ["right_arrow$macrocall$3$macrocall$1"]},
    {"name": "right_arrow$macrocall$1$ebnf$1", "symbols": ["right_arrow$macrocall$3"], "postprocess": id},
    {"name": "right_arrow$macrocall$1$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "right_arrow$macrocall$1$ebnf$2", "symbols": ["right_arrow$macrocall$3"], "postprocess": id},
    {"name": "right_arrow$macrocall$1$ebnf$2", "symbols": [], "postprocess": () => null},
    {"name": "right_arrow$macrocall$1", "symbols": [{"literal":"@"}, "_", "right_arrow$macrocall$2", "right_arrow$macrocall$1$ebnf$1", "right_arrow$macrocall$2", "right_arrow$macrocall$1$ebnf$2", "right_arrow$macrocall$2"], "postprocess": (d) => [sepToEdgeKind(d[2][0]), squish(deepJoin(d[3])), squish(deepJoin(d[5]))]},
    {"name": "right_arrow", "symbols": ["right_arrow$macrocall$1"], "postprocess": id},
    {"name": "right_arrow$macrocall$5", "symbols": [{"literal":")"}]},
    {"name": "right_arrow$macrocall$6$macrocall$2", "symbols": [/[^{}@)]/]},
    {"name": "right_arrow$macrocall$6$macrocall$3", "symbols": ["label"]},
    {"name": "right_arrow$macrocall$6$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": ["right_arrow$macrocall$6$macrocall$3"], "postprocess": id},
    {"name": "right_arrow$macrocall$6$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "right_arrow$macrocall$6$macrocall$1$ebnf$1$subexpression$1", "symbols": [{"literal":"{"}, "right_arrow$macrocall$6$macrocall$1$ebnf$1$subexpression$1$ebnf$1", {"literal":"}"}]},
    {"name": "right_arrow$macrocall$6$macrocall$1$ebnf$1$subexpression$1", "symbols": ["right_arrow$macrocall$6$macrocall$2"]},
    {"name": "right_arrow$macrocall$6$macrocall$1$ebnf$1", "symbols": ["right_arrow$macrocall$6$macrocall$1$ebnf$1$subexpression$1"]},
    {"name": "right_arrow$macrocall$6$macrocall$1$ebnf$1$subexpression$2$ebnf$1", "symbols": ["right_arrow$macrocall$6$macrocall$3"], "postprocess": id},
    {"name": "right_arrow$macrocall$6$macrocall$1$ebnf$1$subexpression$2$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "right_arrow$macrocall$6$macrocall$1$ebnf$1$subexpression$2", "symbols": [{"literal":"{"}, "right_arrow$macrocall$6$macrocall$1$ebnf$1$subexpression$2$ebnf$1", {"literal":"}"}]},
    {"name": "right_arrow$macrocall$6$macrocall$1$ebnf$1$subexpression$2", "symbols": ["right_arrow$macrocall$6$macrocall$2"]},
    {"name": "right_arrow$macrocall$6$macrocall$1$ebnf$1", "symbols": ["right_arrow$macrocall$6$macrocall$1$ebnf$1", "right_arrow$macrocall$6$macrocall$1$ebnf$1$subexpression$2"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "right_arrow$macrocall$6$macrocall$1", "symbols": ["right_arrow$macrocall$6$macrocall$1$ebnf$1"]},
    {"name": "right_arrow$macrocall$6", "symbols": ["right_arrow$macrocall$6$macrocall$1"]},
    {"name": "right_arrow$macrocall$4$ebnf$1", "symbols": ["right_arrow$macrocall$6"], "postprocess": id},
    {"name": "right_arrow$macrocall$4$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "right_arrow$macrocall$4$ebnf$2", "symbols": ["right_arrow$macrocall$6"], "postprocess": id},
    {"name": "right_arrow$macrocall$4$ebnf$2", "symbols": [], "postprocess": () => null},
    {"name": "right_arrow$macrocall$4", "symbols": [{"literal":"@"}, "_", "right_arrow$macrocall$5", "right_arrow$macrocall$4$ebnf$1", "right_arrow$macrocall$5", "right_arrow$macrocall$4$ebnf$2", "right_arrow$macrocall$5"], "postprocess": (d) => [sepToEdgeKind(d[2][0]), squish(deepJoin(d[3])), squish(deepJoin(d[5]))]},
    {"name": "right_arrow", "symbols": ["right_arrow$macrocall$4"], "postprocess": id},
    {"name": "node", "symbols": ["label"], "postprocess": (d) => squish(d[0])},
    {"name": "horizontal_edge", "symbols": ["empty_arrow"], "postprocess": id},
    {"name": "horizontal_edge", "symbols": ["horizontal_equals"], "postprocess": id},
    {"name": "horizontal_edge", "symbols": ["left_arrow"], "postprocess": id},
    {"name": "horizontal_edge", "symbols": ["right_arrow"], "postprocess": id},
    {"name": "vertical_edge", "symbols": ["empty_arrow"], "postprocess": id},
    {"name": "vertical_edge", "symbols": ["vertical_equals"], "postprocess": id},
    {"name": "vertical_edge", "symbols": ["up_arrow"], "postprocess": id},
    {"name": "vertical_edge", "symbols": ["down_arrow"], "postprocess": id},
    {"name": "odd_row$ebnf$1", "symbols": []},
    {"name": "odd_row$ebnf$1$subexpression$1", "symbols": ["horizontal_edge", "node"]},
    {"name": "odd_row$ebnf$1", "symbols": ["odd_row$ebnf$1", "odd_row$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "odd_row", "symbols": ["node", "odd_row$ebnf$1"], "postprocess": ([x, xs]) => [x, ...xs.flat(1)]},
    {"name": "even_row$ebnf$1$subexpression$1", "symbols": ["_", "vertical_edge"]},
    {"name": "even_row$ebnf$1", "symbols": ["even_row$ebnf$1$subexpression$1"]},
    {"name": "even_row$ebnf$1$subexpression$2", "symbols": ["_", "vertical_edge"]},
    {"name": "even_row$ebnf$1", "symbols": ["even_row$ebnf$1", "even_row$ebnf$1$subexpression$2"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "even_row", "symbols": ["even_row$ebnf$1", "_"], "postprocess": (d) => d.flat(2).slice(1,-1)},
    {"name": "row_sep$string$1", "symbols": [{"literal":"\\"}, {"literal":"\\"}], "postprocess": (d) => d.join('')},
    {"name": "row_sep", "symbols": ["row_sep$string$1"], "postprocess": () => null},
    {"name": "matrix$ebnf$1", "symbols": []},
    {"name": "matrix$ebnf$1$subexpression$1", "symbols": ["row_sep", "even_row", "row_sep", "odd_row"]},
    {"name": "matrix$ebnf$1", "symbols": ["matrix$ebnf$1", "matrix$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "matrix", "symbols": ["odd_row", "matrix$ebnf$1"], "postprocess": ([r, rs]) => [r, ...rs.flat(1).filter((x : any) => x)]},
    {"name": "main$string$1", "symbols": [{"literal":"\\"}, {"literal":"b"}, {"literal":"e"}, {"literal":"g"}, {"literal":"i"}, {"literal":"n"}, {"literal":"{"}, {"literal":"C"}, {"literal":"D"}, {"literal":"}"}], "postprocess": (d) => d.join('')},
    {"name": "main$string$2", "symbols": [{"literal":"\\"}, {"literal":"e"}, {"literal":"n"}, {"literal":"d"}, {"literal":"{"}, {"literal":"C"}, {"literal":"D"}, {"literal":"}"}], "postprocess": (d) => d.join('')},
    {"name": "main", "symbols": ["main$string$1", "matrix", "main$string$2"], "postprocess": (d) => d[1]}
  ],
  ParserStart: "_",
};

export default grammar;
