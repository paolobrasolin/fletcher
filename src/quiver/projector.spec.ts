import { create } from "superstruct";
import * as U from "../universal/schema";
import * as S from "./schema";

import examples from "./examples";
import { project } from "./projector";

import { projectEdgeStyle } from "./projector";

describe("projectEdgeStyle", () => {
  test.each([
    [{ body: U.Shafts.Solid }, { body: { name: S.Shafts.Cell } }],
    [{ body: U.Shafts.Dashed }, { body: { name: S.Shafts.Dashed } }],
    [{ body: U.Shafts.Dotted }, { body: { name: S.Shafts.Dotted } }],
    [{ body: U.Shafts.Empty }, { body: { name: S.Shafts.None } }],
    [{ body: U.Shafts.Squiggly }, { body: { name: S.Shafts.Squiggly } }],
    [{ head: U.Tips.Empty }, { head: { name: S.Tips.None } }],
    [{ head: U.Tips.Arrow }, { head: { name: S.Tips.Arrowhead } }],
    [{ head: U.Tips.ArrowDouble }, { head: { name: S.Tips.Epi } }],
    [
      { head: U.Tips.HarpoonLeft },
      { head: { name: S.Tips.Harpoon, side: S.Sides.Top } },
    ],
    [
      { head: U.Tips.HarpoonRight },
      { head: { name: S.Tips.Harpoon, side: S.Sides.Bottom } },
    ],
    [{ tail: U.Tips.Empty }, { tail: { name: S.Tips.None } }],
    [{ tail: U.Tips.Arrow }, { tail: { name: S.Tips.Arrowhead } }],
    [{ tail: U.Tips.ArrowReverse }, { tail: { name: S.Tips.Mono } }],
    [
      { tail: U.Tips.HookLeft },
      { tail: { name: S.Tips.Hook, side: S.Sides.Bottom } },
    ],
    [
      { tail: U.Tips.HookRight },
      { tail: { name: S.Tips.Hook, side: S.Sides.Top } },
    ],
    [{ tail: U.Tips.Bar }, { tail: { name: S.Tips.MapsTo } }],
  ])("%O", (input, output) => {
    expect(projectEdgeStyle(create(input, U.EdgeStyle))).toMatchObject(output);
  });
});

describe.each(examples)("$name", ({ rep, ast }) => {
  test("project", () =>
    expect(project(create(rep, U.Diagram))).toEqual(create(ast, S.Main)));
});
