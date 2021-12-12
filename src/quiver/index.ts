//=[ Encoding/decoding ]========================================================

// NOTE: btoa/atob are deprecated but quiver uses them so we need browser compliant shims

export function btoa(x: string) {
  return Buffer.from(x, "latin1").toString("base64");
}

export function atob(x: string) {
  return Buffer.from(x, "base64").toString("latin1");
}

export function encode(input: string): string {
  return btoa(unescape(encodeURIComponent(input)));
}

export function decode(input: string): string {
  return decodeURIComponent(escape(atob(input)));
}

//=[ Serialization/deserialization ]============================================

export function serialize(input: any): string {
  return JSON.stringify(input);
}

export function deserialize(input: string): any {
  return JSON.parse(input);
}

//=[ Validation ]===============================================================

import { Main } from "./schema";
import { validate as ssValidate, Infer } from "superstruct";

export function validate(input: any): Infer<typeof Main> | undefined {
  const [, coerced] = ssValidate(input, Main, { coerce: true });
  return coerced;
}

//==============================================================================

// TODO: error handling

export function read(input: string): any {
  const decoded = decode(input);
  const deserialized = deserialize(decoded);
  const validated = validate(deserialized);
  // const injected = inject(validated);
  // return injected;
  return validated;
}

// export function write(input: unknown): string {
//   const projected = project(input);
//   const linted = lint(projected);
//   const serialized = serialize(linted);
//   const encoded = encode(serialized);
//   return encoded;
// }
