import { renderEdge, renderLabel, stripGroups, protectChar } from "./renderer";
import { EdgeKind, Edge } from "./schema";
import { create } from "superstruct";

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
    [EdgeKind.UpArrow, "", ""],
    [EdgeKind.UpArrow, "f", "f"],
    [EdgeKind.UpArrow, "a{A}z", "a{A}z"],
    [EdgeKind.UpArrow, "aAz", "{aAz}"],
    [EdgeKind.DownArrow, "", ""],
    [EdgeKind.DownArrow, "f", "f"],
    [EdgeKind.DownArrow, "a{V}z", "a{V}z"],
    [EdgeKind.DownArrow, "aVz", "{aVz}"],
    [EdgeKind.LeftArrow, "", ""],
    [EdgeKind.LeftArrow, "f", "f"],
    [EdgeKind.LeftArrow, "a{<}z", "a{<}z"],
    [EdgeKind.LeftArrow, "a<z", "{a<z}"],
    [EdgeKind.RightArrow, "", ""],
    [EdgeKind.RightArrow, "f", "f"],
    [EdgeKind.RightArrow, "a{>}z", "a{>}z"],
    [EdgeKind.RightArrow, "a>z", "{a>z}"],
  ])("%O", (kind, input, output) => {
    expect(renderLabel(kind, input)).toEqual(output);
  });
});

describe("renderEdge", () => {
  test.each([
    [[EdgeKind.Empty], "@."],
    [[EdgeKind.HorizontalEquals], "@="],
    [[EdgeKind.VerticalEquals], "@|"],
    [[EdgeKind.UpArrow, "", ""], "@AAA"],
    [[EdgeKind.UpArrow, "f", ""], "@AfAA"],
    [[EdgeKind.UpArrow, "", "g"], "@AAgA"],
    [[EdgeKind.UpArrow, "f", "g"], "@AfAgA"],
    [[EdgeKind.UpArrow, "A", "a{A}z"], "@A{A}Aa{A}zA"],
    [[EdgeKind.DownArrow, "", ""], "@VVV"],
    [[EdgeKind.DownArrow, "f", ""], "@VfVV"],
    [[EdgeKind.DownArrow, "", "g"], "@VVgV"],
    [[EdgeKind.DownArrow, "f", "g"], "@VfVgV"],
    [[EdgeKind.DownArrow, "V", "a{V}z"], "@V{V}Va{V}zV"],
    [[EdgeKind.LeftArrow, "", ""], "@<<<"],
    [[EdgeKind.LeftArrow, "f", ""], "@<f<<"],
    [[EdgeKind.LeftArrow, "", "g"], "@<<g<"],
    [[EdgeKind.LeftArrow, "f", "g"], "@<f<g<"],
    [[EdgeKind.LeftArrow, "<", "a{<}z"], "@<{<}<a{<}z<"],
    [[EdgeKind.RightArrow, "", ""], "@>>>"],
    [[EdgeKind.RightArrow, "f", ""], "@>f>>"],
    [[EdgeKind.RightArrow, "", "g"], "@>>g>"],
    [[EdgeKind.RightArrow, "f", "g"], "@>f>g>"],
    [[EdgeKind.RightArrow, ">", "a{>}z"], "@>{>}>a{>}z>"],
  ])("%O", (input, output) => {
    expect(renderEdge(create(input, Edge))).toEqual(output);
  });
});
