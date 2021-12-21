import { create } from "superstruct";
import * as U from "../universal/schema";
import * as S from "./schema";

import examples from "./examples";
import { project } from "./projector";

describe.each(examples)("$name", ({ rep, ast }) => {
  test("inject", () =>
    expect(project(create(rep, U.Diagram))).toEqual(create(ast, S.Matrix)));
});
