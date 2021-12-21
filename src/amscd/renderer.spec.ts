import { create } from "superstruct";
// import * as U from "../universal/schema";
import * as S from "./schema";

import examples from "./examples";
import { render } from "./renderer";

import { renderEdge, renderLabel, stripGroups, protectChar } from "./renderer";

describe("stripGroups", () => {
  test.each([
    ["", ""],
    ["f", "f"],
    ["a{X}z", "az"],
    ["a{X}b{X{Y}Z}z", "abz"],
    ["{az}", ""],
  ])("%O", (input, output) => {
    expect(stripGroups(input)).toEqual(output);
  });
});

describe("protectChar", () => {
  test.each([
    [["X", ""], ""],
    [["X", "f"], "f"],
    [["X", "a{X}z"], "a{X}z"],
    [["X", "aXz"], "{aXz}"],
  ])("%O", ([unsafeChar, input], output) => {
    expect(protectChar(unsafeChar, input)).toEqual(output);
  });
});

describe("renderLabel", () => {
  test.each([
    [S.EdgeKind.UpArrow, "", ""],
    [S.EdgeKind.UpArrow, "f", "f"],
    [S.EdgeKind.UpArrow, "a{A}z", "a{A}z"],
    [S.EdgeKind.UpArrow, "aAz", "{aAz}"],
    [S.EdgeKind.DownArrow, "", ""],
    [S.EdgeKind.DownArrow, "f", "f"],
    [S.EdgeKind.DownArrow, "a{V}z", "a{V}z"],
    [S.EdgeKind.DownArrow, "aVz", "{aVz}"],
    [S.EdgeKind.LeftArrow, "", ""],
    [S.EdgeKind.LeftArrow, "f", "f"],
    [S.EdgeKind.LeftArrow, "a{<}z", "a{<}z"],
    [S.EdgeKind.LeftArrow, "a<z", "{a<z}"],
    [S.EdgeKind.RightArrow, "", ""],
    [S.EdgeKind.RightArrow, "f", "f"],
    [S.EdgeKind.RightArrow, "a{>}z", "a{>}z"],
    [S.EdgeKind.RightArrow, "a>z", "{a>z}"],
  ])("%O", (kind, input, output) => {
    expect(renderLabel(kind, input)).toEqual(output);
  });
});

describe("renderEdge", () => {
  test.each([
    [[S.EdgeKind.Empty], "@."],
    [[S.EdgeKind.HorizontalEquals], "@="],
    [[S.EdgeKind.VerticalEquals], "@|"],
    [[S.EdgeKind.UpArrow, "", ""], "@AAA"],
    [[S.EdgeKind.UpArrow, "f", ""], "@AfAA"],
    [[S.EdgeKind.UpArrow, "", "g"], "@AAgA"],
    [[S.EdgeKind.UpArrow, "f", "g"], "@AfAgA"],
    [[S.EdgeKind.UpArrow, "A", "a{A}z"], "@A{A}Aa{A}zA"],
    [[S.EdgeKind.DownArrow, "", ""], "@VVV"],
    [[S.EdgeKind.DownArrow, "f", ""], "@VfVV"],
    [[S.EdgeKind.DownArrow, "", "g"], "@VVgV"],
    [[S.EdgeKind.DownArrow, "f", "g"], "@VfVgV"],
    [[S.EdgeKind.DownArrow, "V", "a{V}z"], "@V{V}Va{V}zV"],
    [[S.EdgeKind.LeftArrow, "", ""], "@<<<"],
    [[S.EdgeKind.LeftArrow, "f", ""], "@<f<<"],
    [[S.EdgeKind.LeftArrow, "", "g"], "@<<g<"],
    [[S.EdgeKind.LeftArrow, "f", "g"], "@<f<g<"],
    [[S.EdgeKind.LeftArrow, "<", "a{<}z"], "@<{<}<a{<}z<"],
    [[S.EdgeKind.RightArrow, "", ""], "@>>>"],
    [[S.EdgeKind.RightArrow, "f", ""], "@>f>>"],
    [[S.EdgeKind.RightArrow, "", "g"], "@>>g>"],
    [[S.EdgeKind.RightArrow, "f", "g"], "@>f>g>"],
    [[S.EdgeKind.RightArrow, ">", "a{>}z"], "@>{>}>a{>}z>"],
  ])("%O", (input, output) => {
    expect(renderEdge(create(input, S.Edge))).toEqual(output);
  });
});

//==============================================================================

describe.each(examples)("$name", ({ ast, dsl }) => {
  test("parse", () => expect(render(create(ast, S.Matrix))).toEqual(dsl));
});
