import * as S from "./schema";
import { is, validate, Struct } from "superstruct";
import { format } from "util";

//=[ Helpers ]==================================================================

// TODO: better signature
const quickCheck =
  (structure: Struct<any, any>) => (input: any, output: any) => {
    const valid = is(input, structure);
    const [_, coerced] = validate(input, structure, { coerce: true });
    if (output !== undefined)
      test("is valid", () => expect(valid).toEqual(true));
    if (output === undefined)
      test("is invalid", () => expect(valid).toEqual(false));
    test(format("coerces to %O", output), () =>
      expect(coerced).toEqual(output),
    );
  };

//=[ Basic ]====================================================================

describe("Alignment", () => {
  describe.each([
    [-1, undefined],
    [0.5, undefined],
    [4, undefined],
    [0, 0],
    [1, 1],
    [2, 2],
    [3, 3],
  ])("%O", quickCheck(S.Alignment));
});

describe("Angle", () => {
  describe.each([
    [-1, undefined],
    [0.5, undefined],
    [361, undefined],
    [0, 0],
    [42, 42],
    [120, 120],
  ])("%O", quickCheck(S.Angle));
});

describe("Factor", () => {
  describe.each([
    [-1, undefined],
    [1.1, undefined],
    [0, 0],
    [0.5, 0.5],
    [1, 1],
  ])("%O", quickCheck(S.Factor));
});

describe("Level", () => {
  describe.each([
    [0, undefined],
    [0.5, undefined],
    [4, undefined],
    [1, 1],
    [2, 2],
    [3, 3],
  ])("%O", quickCheck(S.Level));
});

describe("Natural", () => {
  describe.each([
    [-1, undefined],
    [0.5, undefined],
    [0, 0],
    [1, 1],
    [42, 42],
  ])("%O", quickCheck(S.Natural));
});

describe("Percent", () => {
  describe.each([
    [-1, undefined],
    [0.5, undefined],
    [101, undefined],
    [0, 0],
    [42, 42],
    [100, 100],
  ])("%O", quickCheck(S.Percent));
});

describe("Version", () => {
  describe.each([
    [-1, undefined],
    [1, undefined],
    [0, 0],
  ])("%O", quickCheck(S.Version));
});

//=[ Composite ]================================================================

describe("Colour", () => {
  describe.each([
    [[], undefined],
    [
      [0, 0, 0],
      [0, 0, 0, 1],
    ],
    [
      [360, 100, 100, 1.0],
      [360, 100, 100, 1.0],
    ],
  ])("%O", quickCheck(S.Colour));
});

describe("Shorten", () => {
  describe.each([
    [{}, { source: 0, target: 0 }],
    [{ source: 42 }, { source: 42, target: 0 }],
    [{ target: 42 }, { source: 0, target: 42 }],
    [
      { source: 40, target: 20 },
      { source: 40, target: 20 },
    ],
    [{ source: 51, target: 51 }, undefined],
  ])("%O", quickCheck(S.Shorten));
});

//=[ Edge ]=====================================================================

describe("EdgeStyleBody", () => {
  describe.each([
    [{}, { name: "cell" }],
    [{ name: "cell" }, { name: "cell" }],
    [{ name: "squiggly" }, { name: "squiggly" }],
    [{ name: "barred" }, { name: "barred" }],
    [{ name: "dashed" }, { name: "dashed" }],
    [{ name: "dotted" }, { name: "dotted" }],
    [{ name: "none" }, { name: "none" }],
    [{ level: 1 }, { level: 1, name: "cell" }],
  ])("%O", quickCheck(S.EdgeStyleBody));
});

describe("EdgeStyleHead", () => {
  describe.each([
    [{}, { name: "arrowhead" }],
    [{ name: "arrowhead" }, { name: "arrowhead" }],
    [{ name: "none" }, { name: "none" }],
    [{ name: "epi" }, { name: "epi" }],
    [{ name: "harpoon" }, { name: "harpoon" }],
    [
      { name: "harpoon", side: "top" },
      { name: "harpoon", side: "top" },
    ],
    [
      { name: "harpoon", side: "bottom" },
      { name: "harpoon", side: "bottom" },
    ],
  ])("%O", quickCheck(S.EdgeStyleHead));
});

describe("EdgeStyleTail", () => {
  describe.each([
    [{}, { name: "none" }],
    [{ name: "none" }, { name: "none" }],
    [{ name: "maps to" }, { name: "maps to" }],
    [{ name: "mono" }, { name: "mono" }],
    [{ name: "hook" }, { name: "hook" }],
    [
      { name: "hook", side: "top" },
      { name: "hook", side: "top" },
    ],
    [
      { name: "hook", side: "bottom" },
      { name: "hook", side: "bottom" },
    ],
  ])("%O", quickCheck(S.EdgeStyleTail));
});

describe("EdgeStyle", () => {
  const defaults = {
    body: { name: "cell" },
    name: "arrow",
    head: { name: "arrowhead" },
    tail: { name: "none" },
  };
  describe.each([
    [{}, { ...defaults }],
    [{ name: "arrow" }, { ...defaults, name: "arrow" }],
    [{ name: "adjunction" }, { ...defaults, name: "adjunction" }],
    [{ name: "corner" }, { ...defaults, name: "corner" }],
    [{ name: "corner-inverse" }, { ...defaults, name: "corner-inverse" }],
  ])("%O", quickCheck(S.EdgeStyle));
});

describe("EdgeOptions", () => {
  const defaults = {
    colour: [0, 0, 0, 1],
    curve: 0,
    label_position: 50,
    length: undefined,
    level: 1,
    offset: 0,
    shorten: { source: 0, target: 0 },
    style: {
      body: {
        level: undefined,
        name: "cell",
      },
      head: {
        name: "arrowhead",
        side: undefined,
      },
      name: "arrow",
      tail: {
        name: "none",
        side: undefined,
      },
    },
  };
  describe.each([[{}, { ...defaults }]])("%O", quickCheck(S.EdgeOptions));
});

const EDGE_DEFAULTS = [
  "",
  0,
  {
    colour: [0, 0, 0, 1],
    curve: 0,
    label_position: 50,
    length: undefined,
    level: 1,
    offset: 0,
    shorten: { source: 0, target: 0 },
    style: {
      body: { level: undefined, name: "cell" },
      head: { name: "arrowhead", side: undefined },
      name: "arrow",
      tail: { name: "none", side: undefined },
    },
  },
  [0, 0, 0, 1],
];

describe("Edge", () => {
  describe.each([
    [[], undefined],
    [[0], undefined],
    [
      [0, 1],
      [0, 1, ...EDGE_DEFAULTS],
    ],
    [[2, 2], undefined],
    [
      [0, 1, ""],
      [0, 1, ...EDGE_DEFAULTS],
    ],
    // nothing before the 4th item can be omitted
    [
      [0, 1, "", 0],
      [0, 1, ...EDGE_DEFAULTS],
    ],
    [[0, 1, 0], undefined],
    // nothing before the 5th item can be omitted
    [
      [0, 1, "", 0, {}],
      [0, 1, ...EDGE_DEFAULTS],
    ],
    [[0, 1, "", {}], undefined],
    [[0, 1, 0, {}], undefined],
    [[0, 1, {}], undefined],
    // nothing before the 6th item can be omitted
    [
      [0, 1, "", 0, {}, [0, 0, 0]],
      [0, 1, ...EDGE_DEFAULTS],
    ],
    [[0, 1, "", 0, [0, 0, 0]], undefined],
    [[0, 1, "", {}, [0, 0, 0]], undefined],
    [[0, 1, 0, {}, [0, 0, 0]], undefined],
    [[0, 1, {}, [0, 0, 0]], undefined],
    [[0, 1, 0, [0, 0, 0]], undefined],
    [[0, 1, "", [0, 0, 0]], undefined],
    [[0, 1, [0, 0, 0]], undefined],
  ])("%O", quickCheck(S.Edge));
});

describe("edge(6, 8)", () => {
  describe.each([
    // no loops
    [[0, 0], undefined],
    // no self as source/target
    [[0, 6], undefined],
    [[6, 0], undefined],
    // no out of bounds source/target
    [[0, 9], undefined],
    [[9, 0], undefined],
  ])("%O", quickCheck(S.edge(6, 8)));
});

//=[ Vertex ]===================================================================

const VERTEX_DEFAULTS = ["", [0, 0, 0, 1]];

describe("Vertex", () => {
  describe.each([
    [[], undefined],
    [[0], undefined],
    [
      [0, 1],
      [0, 1, ...VERTEX_DEFAULTS],
    ],
    [
      [0, 1, ""],
      [0, 1, ...VERTEX_DEFAULTS],
    ],
    // nothing before the 4th item can be omitted
    [
      [0, 1, "", [0, 0, 0]],
      [0, 1, ...VERTEX_DEFAULTS],
    ],
    [[0, 1, [0, 0, 0]], undefined],
  ])("%O", quickCheck(S.Vertex));
});

//=[ Main ]=====================================================================

describe("Main", () => {
  describe.each([
    // empty quiver is not representable
    [[0, 0], undefined],
    // vertices count can't exceed array length
    [[0, 2, [0, 0]], undefined],
    // no parameters can be omitted
    [[[]], undefined],
    [[0, []], undefined],
    // no loops
    [[0, 0, [0, 0], [1, 0], [0, 0]], undefined],
    // no self as source/target
    [[0, 0, [0, 0], [1, 0], [2, 0]], undefined],
    [[0, 0, [0, 0], [1, 0], [0, 2]], undefined],
    // no out of bounds source/target
    [[0, 0, [0, 0], [1, 0], [3, 0]], undefined],
    [[0, 0, [0, 0], [1, 0], [0, 3]], undefined],
    // ·→·
    [
      [0, 2, [0, 0], [1, 0], [0, 1]],
      [
        0,
        2,
        [0, 0, ...VERTEX_DEFAULTS],
        [1, 0, ...VERTEX_DEFAULTS],
        [0, 1, ...EDGE_DEFAULTS],
      ],
    ],
    // ·→·
    // ↑ ↑
    // ·→·
    [
      [0, 4, [0, 0], [1, 0], [0, 1], [1, 1], [0, 1], [1, 3], [0, 2], [2, 3]],
      [
        0,
        4,
        [0, 0, ...VERTEX_DEFAULTS],
        [1, 0, ...VERTEX_DEFAULTS],
        [0, 1, ...VERTEX_DEFAULTS],
        [1, 1, ...VERTEX_DEFAULTS],
        [0, 1, ...EDGE_DEFAULTS],
        [1, 3, ...EDGE_DEFAULTS],
        [0, 2, ...EDGE_DEFAULTS],
        [2, 3, ...EDGE_DEFAULTS],
      ],
    ],
  ])("%O", quickCheck(S.Main));
});
