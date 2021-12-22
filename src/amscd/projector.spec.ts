import { create } from "superstruct";
import * as U from "../universal/schema";
import * as S from "./schema";

import examples from "./examples.spec";
import { project } from "./projector";

describe.each(examples)("$name", ({ rep, ast }) => {
  test("project", () =>
    expect(project(create(rep, U.Diagram))).toEqual(create(ast, S.Matrix)));
});
