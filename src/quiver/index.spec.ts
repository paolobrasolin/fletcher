import { btoa, atob, encode, decode } from ".";

function charList(head: number, last: number, step = 1) {
  const codePoints = Array.from(
    { length: Math.ceil((last - head + 1) / step) },
    (_, i) => head + i * step,
  );
  return String.fromCodePoint(...codePoints);
}

const LATIN1_RANGE = charList(0x00, 0xff, 1);

const LATIN1_RANGE_BTOAED_IN_BROWSER =
  "AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Nj" +
  "c4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1u" +
  "b3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpa" +
  "anqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd" +
  "3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/w==";

const RUNIC_RANGE = charList(0x16a0, 0x16ff, 1);

const RUNIC_RANGE_ENCODED_IN_BROWSER =
  "IuGaoOGaoeGaouGao+GapOGapeGapuGap+GaqOGaqeGaquGaq+GarOGareGaruGar+GasOGase" +
  "GasuGas+GatOGateGatuGat+GauOGaueGauuGau+GavOGaveGavuGav+GbgOGbgeGbguGbg+Gb" +
  "hOGbheGbhuGbh+GbiOGbieGbiuGbi+GbjOGbjeGbjuGbj+GbkOGbkeGbkuGbk+GblOGbleGblu" +
  "Gbl+GbmOGbmeGbmuGbm+GbnOGbneGbnuGbn+GboOGboeGbouGbo+GbpOGbpeGbpuGbp+GbqOGb" +
  "qeGbquGbq+GbrOGbreGbruGbr+GbsOGbseGbsuGbs+GbtOGbteGbtuGbt+GbuOGbueGbuuGbu+" +
  "GbvOGbveGbvuGbvyI=";

test("charList generates charaget ranges", () => {
  expect(charList(0x0041, 0x005a, 5)).toBe("AFKPUZ");
});

test("btoa is compliant on latin1 range", () => {
  expect(btoa(LATIN1_RANGE)).toEqual(LATIN1_RANGE_BTOAED_IN_BROWSER);
});
test("atob is compliant on latin1 range", () => {
  expect(atob(LATIN1_RANGE_BTOAED_IN_BROWSER)).toEqual(LATIN1_RANGE);
});

test("encode is compliant on unicode range", () => {
  expect(encode(RUNIC_RANGE)).toBe(RUNIC_RANGE_ENCODED_IN_BROWSER);
});
test("decode is compliant on unicode range", () => {
  expect(decode(RUNIC_RANGE_ENCODED_IN_BROWSER)).toBe(RUNIC_RANGE);
});
