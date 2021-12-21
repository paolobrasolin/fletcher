import { create } from "superstruct";
// import * as U from "../universal/schema";
import * as S from "./schema";

import examples from "./examples";
import { inject } from "./injector";

describe.each(examples)("$name", ({ ast, rep }) => {
  test("inject", () =>
    expect(inject(create(ast, S.Matrix))).toMatchObject(rep));
});
