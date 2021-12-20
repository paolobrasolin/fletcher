import { Infer } from "superstruct";
import * as S from "./schema";

import { Grammar, Parser } from "nearley";
import grammar from "./grammar";

export function parse(chunk: string, start?: string): Infer<typeof S.Matrix>[] {
  const subGrammar = Grammar.fromCompiled(grammar);
  if (start) subGrammar.start = start;
  const parser = new Parser(subGrammar);
  parser.feed(chunk);
  return parser.results;
}
