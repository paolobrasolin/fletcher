import { Infer } from "superstruct";
import { Matrix } from "./schema";

import { Grammar, Parser } from "nearley";
import grammar from "./grammar";

export function parse(chunk: string): Infer<typeof Matrix> {
  const subGrammar = Grammar.fromCompiled(grammar);
  subGrammar.start = "main";
  const parser = new Parser(subGrammar);
  parser.feed(chunk);
  return parser.results[0];
}
