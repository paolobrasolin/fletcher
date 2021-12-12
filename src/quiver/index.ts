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

//==============================================================================

export function parse(input: string): string {
  return decode(input);
  // input = JSON.parse(decoded);

  // try {
  //   // We use this `decodeURIComponent`-`escape` trick to encode non-ASCII characters.
  //   const decoded = decodeURIComponent(escape(atob(string)));
  //   if (decoded === "") {
  //     return quiver;
  //   }
  // } catch (_) {
  //   throw new Error("invalid base64 or JSON");
  // }

  // console.log(x);
  // return "mah";
}
