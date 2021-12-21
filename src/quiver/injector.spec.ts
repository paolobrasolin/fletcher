import { create } from "superstruct";
import * as U from "../universal/schema";
import * as S from "./schema";

import examples from "./examples";
import { injectColour, inject } from "./injector";

describe("injectColour", () => {
  test.each([
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 100, 50, 1],
      [1, 0, 0, 1],
    ],
    [
      [120, 100, 50, 1],
      [0, 1, 0, 1],
    ],
    [
      [240, 100, 50, 1],
      [0, 0, 1, 1],
    ],
  ])("%O", (input, output) => {
    expect(injectColour(create(input, S.Colour))).toEqual(
      create(output, U.Colour),
    );
  });
});

describe.each(examples)("$name", ({ ast, rep }) => {
  test("inject", () => expect(inject(create(ast, S.Main))).toMatchObject(rep));
});
