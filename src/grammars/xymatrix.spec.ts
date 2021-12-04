import * as nearley from "nearley";
import xymatrixGrammar from "./xymatrix";

const grammar = nearley.Grammar.fromCompiled(xymatrixGrammar);

const parse = function (chunk: string) {
  const parser = new nearley.Parser(grammar);
  parser.feed(chunk);
  return parser.results;
};

describe("matrix layout", () => {
  test("empty", () => expect(parse(`\\xymatrix{}`)).toEqual([[[""]]]));
  test("single cell", () => expect(parse(`\\xymatrix{X}`)).toEqual([[["X"]]]));
  test("single row", () =>
    expect(parse(`\\xymatrix{A&B&C}`)).toEqual([[["A", "B", "C"]]]));
  test("single column", () =>
    expect(parse(`\\xymatrix{A\\\\B\\\\C}`)).toEqual([[["A"], ["B"], ["C"]]]));

  test("square matrix", () =>
    expect(parse(`\\xymatrix{A&B\\\\C&D}`)).toEqual([
      [
        ["A", "B"],
        ["C", "D"],
      ],
    ]));

  test("realistic whitespace", () =>
    expect(
      parse(`
\\xymatrix{
  a & b \\\\
  c & d }
`),
    ).toEqual([
      [
        ["a", "b"],
        ["c", "d"],
      ],
    ]));
});
