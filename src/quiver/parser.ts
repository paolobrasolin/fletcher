import { Infer } from "superstruct";
import * as S from "./schema";

// NOTE: btoa/atob are deprecated but quiver uses them so we need browser compliant shims

export function atob(x: string) {
  return Buffer.from(x, "base64").toString("latin1");
}

export function decode(input: string): string {
  return decodeURIComponent(escape(atob(input)));
}

export function deserialize(input: string) {
  return JSON.parse(input);
}

export function parse(input: string): Infer<typeof S.Main> {
  const decoded = decode(input);
  const deserialized = deserialize(decoded);
  return deserialized;
}
