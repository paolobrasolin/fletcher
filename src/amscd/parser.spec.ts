// import {} from "superstruct";
// import * as U from "../universal/schema";
import * as S from "./schema";

import examples from "./examples.spec";
import { parse } from "./parser";

import { spawn } from "child_process";
import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import { format } from "util";

//=[ Compilation ]==============================================================

const TMP_PATH = path.join(process.cwd(), ".tests");

// beforeAll(() => {
//   return fs.mkdirSync(TMP_PATH);
// });

// afterAll(() => {
//   return fs.rmSync(TMP_PATH, { recursive: true, force: true });
// });

const TEMPLATE = (body: string): string => `
\\documentclass{standalone}
\\usepackage{amscd}
\\begin{document}
${body}
\\end{document}
`;

const compile = (body: string, template = TEMPLATE) => {
  const data = template(body);

  const hash = crypto.createHash("md5").update(data).digest("hex");
  fs.writeFileSync(path.join(TMP_PATH, `${hash}.tex`), data);

  return new Promise((resolve, reject) => {
    // NOTE: latex would be faster but there are some problems with fonts
    spawn("pdflatex", ["-interaction=nonstopmode", "-halt-on-error", hash], {
      shell: true,
      cwd: TMP_PATH,
      stdio: "ignore",
    })
      .on("exit", (code) => resolve(code))
      .on("error", (err) => reject(err));
  });
};

//=[ Helpers ]==================================================================

const quickCheck =
  (start: string, context?: (example: string) => string) =>
  (input: string, output: unknown) => {
    const result = parse(input, start);
    test("it parses unabiguously", () => expect(result).toHaveLength(1));
    test(format("it parses to %O", output), () =>
      expect(result[0]).toEqual(output),
    );
    if (!context) return;
    (process.env.COMPILE ? test : test.skip)("compiles", async () => {
      await expect(compile(context(input))).resolves.toBe(0);
    });
  };

//=[ Basics ]===================================================================

describe("label", () => {
  describe.each([
    ["f", "f"],
    ["f g", "f g"],
    ["f g h", "f g h"],
    ["{}", "{}"],
    ["{{}{{}}{{{}}}}", "{{}{{}}{{{}}}}"],
    [" { f { g { h { i } j } k } l } ", " { f { g { h { i } j } k } l } "],
    ["\\mathcal{L}_\\Omega", "\\mathcal{L}_\\Omega"],
  ])(
    "%O",
    quickCheck("label", (example) => `$\\begin{CD}${example}\\end{CD}$`),
  );
});

//=[ Arrows ]===================================================================

describe("empty_arrow", () => {
  describe.each([
    ["@.", [S.EdgeKind.Empty]],
    ["@ .", [S.EdgeKind.Empty]],
  ])(
    "%O",
    quickCheck(
      "empty_arrow",
      (example) => `$\\begin{CD}A${example}B\\end{CD}$`,
    ),
  );
});

describe("horizontal_equals", () => {
  describe.each([
    ["@=", [S.EdgeKind.HorizontalEquals]],
    ["@ =", [S.EdgeKind.HorizontalEquals]],
  ])(
    "%O",
    quickCheck(
      "horizontal_equals",
      (example) => `$\\begin{CD}A${example}B\\end{CD}$`,
    ),
  );
});

describe("vertical_equals", () => {
  describe.each([
    ["@|", [S.EdgeKind.VerticalEquals]],
    ["@ |", [S.EdgeKind.VerticalEquals]],
    ["@\\vert", [S.EdgeKind.VerticalEquals]],
    ["@ \\vert", [S.EdgeKind.VerticalEquals]],
  ])(
    "%O",
    quickCheck(
      "vertical_equals",
      (example) => `$\\begin{CD}A\\\\${example}\\\\B\\end{CD}$`,
    ),
  );
});

describe("up_arrow", () => {
  describe.each([
    ["@AAA", [S.EdgeKind.UpArrow, "", ""]],
    ["@ A f  o  o A\r\n\tA", [S.EdgeKind.UpArrow, "f o o", ""]],
    ["@AfAA", [S.EdgeKind.UpArrow, "f", ""]],
    ["@AAgA", [S.EdgeKind.UpArrow, "", "g"]],
    ["@AfAgA", [S.EdgeKind.UpArrow, "f", "g"]],
    ["@A{A}A{A}A", [S.EdgeKind.UpArrow, "{A}", "{A}"]],
  ])(
    "%O",
    quickCheck(
      "up_arrow",
      (example) => `$\\begin{CD}A\\\\${example}\\\\B\\end{CD}$`,
    ),
  );
});

describe("down_arrow", () => {
  describe.each([
    ["@VVV", [S.EdgeKind.DownArrow, "", ""]],
    ["@ V f  o  o V\r\n\tV", [S.EdgeKind.DownArrow, "f o o", ""]],
    ["@VfVV", [S.EdgeKind.DownArrow, "f", ""]],
    ["@VVgV", [S.EdgeKind.DownArrow, "", "g"]],
    ["@VfVgV", [S.EdgeKind.DownArrow, "f", "g"]],
    ["@V{V}V{V}V", [S.EdgeKind.DownArrow, "{V}", "{V}"]],
  ])(
    "%O",
    quickCheck(
      "down_arrow",
      (example) => `$\\begin{CD}A\\\\${example}\\\\B\\end{CD}$`,
    ),
  );
});

describe("left_arrow", () => {
  describe.each([
    ["@<<<", [S.EdgeKind.LeftArrow, "", ""]],
    ["@ < f  o  o <\r\n\t<", [S.EdgeKind.LeftArrow, "f o o", ""]],
    ["@<f<<", [S.EdgeKind.LeftArrow, "f", ""]],
    ["@<<g<", [S.EdgeKind.LeftArrow, "", "g"]],
    ["@<f<g<", [S.EdgeKind.LeftArrow, "f", "g"]],
    ["@<{<}<{<}<", [S.EdgeKind.LeftArrow, "{<}", "{<}"]],
    ["@(((", [S.EdgeKind.LeftArrow, "", ""]],
    ["@ ( f  o  o (\r\n\t(", [S.EdgeKind.LeftArrow, "f o o", ""]],
    ["@(f((", [S.EdgeKind.LeftArrow, "f", ""]],
    ["@((g(", [S.EdgeKind.LeftArrow, "", "g"]],
    ["@(f(g(", [S.EdgeKind.LeftArrow, "f", "g"]],
    ["@({(}({(}(", [S.EdgeKind.LeftArrow, "{(}", "{(}"]],
  ])(
    "%O",
    quickCheck("left_arrow", (example) => `$\\begin{CD}A${example}B\\end{CD}$`),
  );
});

describe("right_arrow", () => {
  describe.each([
    ["@>>>", [S.EdgeKind.RightArrow, "", ""]],
    ["@ > f  o  o >\r\n\t>", [S.EdgeKind.RightArrow, "f o o", ""]],
    ["@>f>>", [S.EdgeKind.RightArrow, "f", ""]],
    ["@>>g>", [S.EdgeKind.RightArrow, "", "g"]],
    ["@>f>g>", [S.EdgeKind.RightArrow, "f", "g"]],
    ["@>{>}>{>}>", [S.EdgeKind.RightArrow, "{>}", "{>}"]],
    ["@)))", [S.EdgeKind.RightArrow, "", ""]],
    ["@ ) f  o  o )\r\n\t)", [S.EdgeKind.RightArrow, "f o o", ""]],
    ["@)f))", [S.EdgeKind.RightArrow, "f", ""]],
    ["@))g)", [S.EdgeKind.RightArrow, "", "g"]],
    ["@)f)g)", [S.EdgeKind.RightArrow, "f", "g"]],
    ["@){)}){)})", [S.EdgeKind.RightArrow, "{)}", "{)}"]],
  ])(
    "%O",
    quickCheck(
      "right_arrow",
      (example) => `$\\begin{CD}A${example}B\\end{CD}$`,
    ),
  );
});

//=[ Layout ]===================================================================

describe("horizontal_edge", () => {
  describe.each([
    ["@.", [S.EdgeKind.Empty]],
    ["@=", [S.EdgeKind.HorizontalEquals]],
    ["@<<<", [S.EdgeKind.LeftArrow, "", ""]],
    ["@>>>", [S.EdgeKind.RightArrow, "", ""]],
  ])(
    "%O",
    quickCheck(
      "horizontal_edge",
      (example) => `$\\begin{CD}A${example}B\\end{CD}$`,
    ),
  );
});

describe("vertical_edge", () => {
  describe.each([
    ["@.", [S.EdgeKind.Empty]],
    ["@|", [S.EdgeKind.VerticalEquals]],
    ["@AAA", [S.EdgeKind.UpArrow, "", ""]],
    ["@VVV", [S.EdgeKind.DownArrow, "", ""]],
  ])(
    "%O",
    quickCheck(
      "vertical_edge",
      (example) => `$\\begin{CD}A\\\\${example}\\\\B\\end{CD}$`,
    ),
  );
});

describe("odd_row", () => {
  describe.each([
    ["F", ["F"]],
    ["F @>>> G", ["F", [S.EdgeKind.RightArrow, "", ""], "G"]],
    [
      "F @>>> G @>>> H",
      [
        "F",
        [S.EdgeKind.RightArrow, "", ""],
        "G",
        [S.EdgeKind.RightArrow, "", ""],
        "H",
      ],
    ],
  ])(
    "%O",
    quickCheck("odd_row", (example) => `$\\begin{CD}${example}\\end{CD}$`),
  );
});

describe("even_row", () => {
  describe.each([
    ["@VVV", [[S.EdgeKind.DownArrow, "", ""]]],
    [
      "@VVV @VVV",
      [[S.EdgeKind.DownArrow, "", ""], null, [S.EdgeKind.DownArrow, "", ""]],
    ],
    [
      "@VVV @VVV @VVV",
      [
        [S.EdgeKind.DownArrow, "", ""],
        null,
        [S.EdgeKind.DownArrow, "", ""],
        null,
        [S.EdgeKind.DownArrow, "", ""],
      ],
    ],
  ])(
    "%O",
    quickCheck("even_row", (example) => `$\\begin{CD}\\\\${example}\\end{CD}$`),
  );
});

describe("matrix", () => {
  describe.each([
    ["F", [["F"]]],
    ["F @>>> G", [["F", [S.EdgeKind.RightArrow, "", ""], "G"]]],
    [
      "F @>>> G @>>> H",
      [
        [
          "F",
          [S.EdgeKind.RightArrow, "", ""],
          "G",
          [S.EdgeKind.RightArrow, "", ""],
          "H",
        ],
      ],
    ],
    [
      `F \\\\\n @VVV \\\\\n G`,
      [["F"], [[S.EdgeKind.DownArrow, "", ""]], ["G"]],
    ],
    [
      "F \\\\\n @VVV \\\\\n G \\\\\n @VVV \\\\\n H",
      [
        ["F"],
        [[S.EdgeKind.DownArrow, "", ""]],
        ["G"],
        [[S.EdgeKind.DownArrow, "", ""]],
        ["H"],
      ],
    ],
    [
      "F @>>> G \\\\\n @VVV @VVV \\\\\n H @>>> I",
      [
        ["F", [S.EdgeKind.RightArrow, "", ""], "G"],
        [[S.EdgeKind.DownArrow, "", ""], null, [S.EdgeKind.DownArrow, "", ""]],
        ["H", [S.EdgeKind.RightArrow, "", ""], "I"],
      ],
    ],
    [
      "F @>>> G @>>> H \\\\\n @VVV @VVV @VVV \\\\\n I @>>> J @>>> K \\\\\n @VVV @VVV @VVV \\\\\n L @>>> M @>>> N",
      [
        [
          "F",
          [S.EdgeKind.RightArrow, "", ""],
          "G",
          [S.EdgeKind.RightArrow, "", ""],
          "H",
        ],
        [
          [S.EdgeKind.DownArrow, "", ""],
          null,
          [S.EdgeKind.DownArrow, "", ""],
          null,
          [S.EdgeKind.DownArrow, "", ""],
        ],
        [
          "I",
          [S.EdgeKind.RightArrow, "", ""],
          "J",
          [S.EdgeKind.RightArrow, "", ""],
          "K",
        ],
        [
          [S.EdgeKind.DownArrow, "", ""],
          null,
          [S.EdgeKind.DownArrow, "", ""],
          null,
          [S.EdgeKind.DownArrow, "", ""],
        ],
        [
          "L",
          [S.EdgeKind.RightArrow, "", ""],
          "M",
          [S.EdgeKind.RightArrow, "", ""],
          "N",
        ],
      ],
    ],
  ])(
    "%O",
    quickCheck("matrix", (example) => `$\\begin{CD}${example}\\end{CD}$`),
  );
});

//=[ Main ]=====================================================================

describe("main", () => {
  describe.each([
    [
      `\\begin{CD}
S^{{\\mathcal{W}}_\\Lambda}\\otimes T @>j>> T\\\\
@VVV @VV{\\End P}V\\\\
(S\\otimes T)/I @= (Z\\otimes T)/J
\\end{CD}`,
      [
        [
          "S^{{\\mathcal{W}}_\\Lambda}\\otimes T",
          [S.EdgeKind.RightArrow, "j", ""],
          "T",
        ],
        [
          [S.EdgeKind.DownArrow, "", ""],
          null,
          [S.EdgeKind.DownArrow, "", "{\\End P}"],
        ],
        ["(S\\otimes T)/I", [S.EdgeKind.HorizontalEquals], "(Z\\otimes T)/J"],
      ],
    ],
    [
      `\\begin{CD}
\\cov(\\mathcal{L}) @>>> \\non(\\mathcal{K}) @>>> \\cf(\\mathcal{K}) @>>>
\\cf(\\mathcal{L})\\\\
@VVV @AAA @AAA @VVV\\\\
\\add(\\mathcal{L}) @>>> \\add(\\mathcal{K}) @>>> \\cov(\\mathcal{K}) @>>>
\\non(\\mathcal{L})
\\end{CD}`,
      [
        [
          "\\cov(\\mathcal{L})",
          [S.EdgeKind.RightArrow, "", ""],
          "\\non(\\mathcal{K})",
          [S.EdgeKind.RightArrow, "", ""],
          "\\cf(\\mathcal{K})",
          [S.EdgeKind.RightArrow, "", ""],
          "\\cf(\\mathcal{L})",
        ],
        [
          [S.EdgeKind.DownArrow, "", ""],
          null,
          [S.EdgeKind.UpArrow, "", ""],
          null,
          [S.EdgeKind.UpArrow, "", ""],
          null,
          [S.EdgeKind.DownArrow, "", ""],
        ],
        [
          "\\add(\\mathcal{L})",
          [S.EdgeKind.RightArrow, "", ""],
          "\\add(\\mathcal{K})",
          [S.EdgeKind.RightArrow, "", ""],
          "\\cov(\\mathcal{K})",
          [S.EdgeKind.RightArrow, "", ""],
          "\\non(\\mathcal{L})",
        ],
      ],
    ],
  ])(
    "%O",
    quickCheck("main", (example) => `$\\begin{CD}${example}\\end{CD}$`),
  );
});

//==============================================================================

describe.each(examples)("$name", ({ dsl, ast }) => {
  test("parse", () => expect(parse(dsl, "main")[0]).toEqual(ast));
});
