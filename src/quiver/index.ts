import { Infer, create } from "superstruct";
import * as S from "./schema";
import * as U from "../universal/schema";

import { parse } from "./parser";
import { inject } from "./injector";
import { project } from "./projector";
import { render } from "./renderer";

// TODO: errors/warnings handling
// TODO: validation/coercion where necessary?

export function read(input: string): Infer<typeof U.Diagram> {
  const parsed = parse(input);
  const coerced = create(parsed, S.Main);
  const injected = inject(coerced);
  return injected;
}

export function write(input: Infer<typeof U.Diagram>): string {
  const coerced = create(input, U.Diagram);
  const projected = project(coerced);
  const rendered = render(projected);
  return rendered;
}
