import { Matrix } from "./schema";
import * as U from "../universal/schema";
import { inject } from "./interpreter";
import { Infer } from "superstruct";

import * as nearley from "nearley";
import grammar from "./grammar";

//=[ Parsing ]==================================================================

const parse = function (chunk: string): Infer<typeof Matrix> {
  const subGrammar = nearley.Grammar.fromCompiled(grammar);
  subGrammar.start = "main";
  const parser = new nearley.Parser(subGrammar);
  parser.feed(chunk);
  return parser.results[0];
};

//==============================================================================

// TODO: error handling

export function read(input: string): Infer<typeof U.Diagram> {
  const parsed = parse(input);
  // TODO: validation?
  const injected = inject(parsed);
  return injected;
}

// export function write(input: Infer<typeof U.Diagram>): string {
//   const projected = project(input);
//   const rendered = render(projected);
//   return rendered;
// }
