import { Infer } from "superstruct";
import * as S from "./schema";

// NOTE: btoa/atob are deprecated but quiver uses them so we need browser compliant shims

export function btoa(x: string) {
  return Buffer.from(x, "latin1").toString("base64");
}

export function encode(input: string): string {
  return btoa(unescape(encodeURIComponent(input)));
}

export function serialize(input: unknown): string {
  return JSON.stringify(input);
}

export function lint(input: Infer<typeof S.Main>): Infer<typeof S.Main> {
  return input; // TODO: is this even necessary?
}

export function render(input: Infer<typeof S.Main>): string {
  const linted = lint(input);
  const serialized = serialize(linted);
  const encoded = encode(serialized);
  return encoded;
}
