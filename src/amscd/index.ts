import { Infer } from "superstruct";
import * as U from "../universal/schema";

import { parse } from "./parser";
import { inject } from "./injector";
import { project } from "./projector";
import { render } from "./renderer";

// TODO: errors/warnings handling
// TODO: validation/coercion where necessary?

export function read(input: string): Infer<typeof U.Diagram> {
  const parsed = parse(input);
  const injected = inject(parsed);
  return injected;
}

export function write(input: Infer<typeof U.Diagram>): string {
  const projected = project(input);
  const rendered = render(projected);
  return rendered;
}
