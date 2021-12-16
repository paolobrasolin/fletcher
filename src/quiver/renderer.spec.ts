import { btoa, encode } from "./renderer";

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
  "4Zqg4Zqh4Zqi4Zqj4Zqk4Zql4Zqm4Zqn4Zqo4Zqp4Zqq4Zqr4Zqs4Zqt4Zqu4Zqv4Zqw4Zqx4Z" +
  "qy4Zqz4Zq04Zq14Zq24Zq34Zq44Zq54Zq64Zq74Zq84Zq94Zq+4Zq/4ZuA4ZuB4ZuC4ZuD4ZuE" +
  "4ZuF4ZuG4ZuH4ZuI4ZuJ4ZuK4ZuL4ZuM4ZuN4ZuO4ZuP4ZuQ4ZuR4ZuS4ZuT4ZuU4ZuV4ZuW4Z" +
  "uX4ZuY4ZuZ4Zua4Zub4Zuc4Zud4Zue4Zuf4Zug4Zuh4Zui4Zuj4Zuk4Zul4Zum4Zun4Zuo4Zup" +
  "4Zuq4Zur4Zus4Zut4Zuu4Zuv4Zuw4Zux4Zuy4Zuz4Zu04Zu14Zu24Zu34Zu44Zu54Zu64Zu74Z" +
  "u84Zu94Zu+4Zu/";

test("charList generates charaget ranges", () => {
  expect(charList(0x0041, 0x005a, 5)).toBe("AFKPUZ");
});

test("btoa is compliant on latin1 range", () => {
  expect(btoa(LATIN1_RANGE)).toEqual(LATIN1_RANGE_BTOAED_IN_BROWSER);
});

test("encode is compliant on unicode range", () => {
  expect(encode(RUNIC_RANGE)).toBe(RUNIC_RANGE_ENCODED_IN_BROWSER);
});
