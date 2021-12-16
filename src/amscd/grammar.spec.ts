import { spawn } from "child_process";
import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import { format } from "util";

import * as nearley from "nearley";

import grammar from "./grammar";
import { EdgeKind } from "./schema";
import { any, Infer } from "superstruct";

//=[ Parsing ]==================================================================

const parse = function (chunk: string, start?: string) {
  const subGrammar = nearley.Grammar.fromCompiled(grammar);
  if (start) subGrammar.start = start;
  const parser = new nearley.Parser(subGrammar);
  parser.feed(chunk);
  return parser.results;
};

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
    ["@.", [EdgeKind.Empty]],
    ["@ .", [EdgeKind.Empty]],
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
    ["@=", [EdgeKind.HorizontalEquals]],
    ["@ =", [EdgeKind.HorizontalEquals]],
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
    ["@|", [EdgeKind.VerticalEquals]],
    ["@ |", [EdgeKind.VerticalEquals]],
    ["@\\vert", [EdgeKind.VerticalEquals]],
    ["@ \\vert", [EdgeKind.VerticalEquals]],
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
    ["@AAA", [EdgeKind.UpArrow, "", ""]],
    ["@ A f  o  o A\r\n\tA", [EdgeKind.UpArrow, "f o o", ""]],
    ["@AfAA", [EdgeKind.UpArrow, "f", ""]],
    ["@AAgA", [EdgeKind.UpArrow, "", "g"]],
    ["@AfAgA", [EdgeKind.UpArrow, "f", "g"]],
    ["@A{A}A{A}A", [EdgeKind.UpArrow, "{A}", "{A}"]],
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
    ["@VVV", [EdgeKind.DownArrow, "", ""]],
    ["@ V f  o  o V\r\n\tV", [EdgeKind.DownArrow, "f o o", ""]],
    ["@VfVV", [EdgeKind.DownArrow, "f", ""]],
    ["@VVgV", [EdgeKind.DownArrow, "", "g"]],
    ["@VfVgV", [EdgeKind.DownArrow, "f", "g"]],
    ["@V{V}V{V}V", [EdgeKind.DownArrow, "{V}", "{V}"]],
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
    ["@<<<", [EdgeKind.LeftArrow, "", ""]],
    ["@ < f  o  o <\r\n\t<", [EdgeKind.LeftArrow, "f o o", ""]],
    ["@<f<<", [EdgeKind.LeftArrow, "f", ""]],
    ["@<<g<", [EdgeKind.LeftArrow, "", "g"]],
    ["@<f<g<", [EdgeKind.LeftArrow, "f", "g"]],
    ["@<{<}<{<}<", [EdgeKind.LeftArrow, "{<}", "{<}"]],
    ["@(((", [EdgeKind.LeftArrow, "", ""]],
    ["@ ( f  o  o (\r\n\t(", [EdgeKind.LeftArrow, "f o o", ""]],
    ["@(f((", [EdgeKind.LeftArrow, "f", ""]],
    ["@((g(", [EdgeKind.LeftArrow, "", "g"]],
    ["@(f(g(", [EdgeKind.LeftArrow, "f", "g"]],
    ["@({(}({(}(", [EdgeKind.LeftArrow, "{(}", "{(}"]],
  ])(
    "%O",
    quickCheck("left_arrow", (example) => `$\\begin{CD}A${example}B\\end{CD}$`),
  );
});

describe("right_arrow", () => {
  describe.each([
    ["@>>>", [EdgeKind.RightArrow, "", ""]],
    ["@ > f  o  o >\r\n\t>", [EdgeKind.RightArrow, "f o o", ""]],
    ["@>f>>", [EdgeKind.RightArrow, "f", ""]],
    ["@>>g>", [EdgeKind.RightArrow, "", "g"]],
    ["@>f>g>", [EdgeKind.RightArrow, "f", "g"]],
    ["@>{>}>{>}>", [EdgeKind.RightArrow, "{>}", "{>}"]],
    ["@)))", [EdgeKind.RightArrow, "", ""]],
    ["@ ) f  o  o )\r\n\t)", [EdgeKind.RightArrow, "f o o", ""]],
    ["@)f))", [EdgeKind.RightArrow, "f", ""]],
    ["@))g)", [EdgeKind.RightArrow, "", "g"]],
    ["@)f)g)", [EdgeKind.RightArrow, "f", "g"]],
    ["@){)}){)})", [EdgeKind.RightArrow, "{)}", "{)}"]],
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
    ["@.", [EdgeKind.Empty]],
    ["@=", [EdgeKind.HorizontalEquals]],
    ["@<<<", [EdgeKind.LeftArrow, "", ""]],
    ["@>>>", [EdgeKind.RightArrow, "", ""]],
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
    ["@.", [EdgeKind.Empty]],
    ["@|", [EdgeKind.VerticalEquals]],
    ["@AAA", [EdgeKind.UpArrow, "", ""]],
    ["@VVV", [EdgeKind.DownArrow, "", ""]],
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
    ["F @>>> G", ["F", [EdgeKind.RightArrow, "", ""], "G"]],
    [
      "F @>>> G @>>> H",
      [
        "F",
        [EdgeKind.RightArrow, "", ""],
        "G",
        [EdgeKind.RightArrow, "", ""],
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
    ["@VVV", [[EdgeKind.DownArrow, "", ""]]],
    [
      "@VVV @VVV",
      [[EdgeKind.DownArrow, "", ""], null, [EdgeKind.DownArrow, "", ""]],
    ],
    [
      "@VVV @VVV @VVV",
      [
        [EdgeKind.DownArrow, "", ""],
        null,
        [EdgeKind.DownArrow, "", ""],
        null,
        [EdgeKind.DownArrow, "", ""],
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
    ["F @>>> G", [["F", [EdgeKind.RightArrow, "", ""], "G"]]],
    [
      "F @>>> G @>>> H",
      [
        [
          "F",
          [EdgeKind.RightArrow, "", ""],
          "G",
          [EdgeKind.RightArrow, "", ""],
          "H",
        ],
      ],
    ],
    [`F \\\\\n @VVV \\\\\n G`, [["F"], [[EdgeKind.DownArrow, "", ""]], ["G"]]],
    [
      "F \\\\\n @VVV \\\\\n G \\\\\n @VVV \\\\\n H",
      [
        ["F"],
        [[EdgeKind.DownArrow, "", ""]],
        ["G"],
        [[EdgeKind.DownArrow, "", ""]],
        ["H"],
      ],
    ],
    [
      "F @>>> G \\\\\n @VVV @VVV \\\\\n H @>>> I",
      [
        ["F", [EdgeKind.RightArrow, "", ""], "G"],
        [[EdgeKind.DownArrow, "", ""], null, [EdgeKind.DownArrow, "", ""]],
        ["H", [EdgeKind.RightArrow, "", ""], "I"],
      ],
    ],
    [
      "F @>>> G @>>> H \\\\\n @VVV @VVV @VVV \\\\\n I @>>> J @>>> K \\\\\n @VVV @VVV @VVV \\\\\n L @>>> M @>>> N",
      [
        [
          "F",
          [EdgeKind.RightArrow, "", ""],
          "G",
          [EdgeKind.RightArrow, "", ""],
          "H",
        ],
        [
          [EdgeKind.DownArrow, "", ""],
          null,
          [EdgeKind.DownArrow, "", ""],
          null,
          [EdgeKind.DownArrow, "", ""],
        ],
        [
          "I",
          [EdgeKind.RightArrow, "", ""],
          "J",
          [EdgeKind.RightArrow, "", ""],
          "K",
        ],
        [
          [EdgeKind.DownArrow, "", ""],
          null,
          [EdgeKind.DownArrow, "", ""],
          null,
          [EdgeKind.DownArrow, "", ""],
        ],
        [
          "L",
          [EdgeKind.RightArrow, "", ""],
          "M",
          [EdgeKind.RightArrow, "", ""],
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
          [EdgeKind.RightArrow, "j", ""],
          "T",
        ],
        [
          [EdgeKind.DownArrow, "", ""],
          null,
          [EdgeKind.DownArrow, "", "{\\End P}"],
        ],
        ["(S\\otimes T)/I", [EdgeKind.HorizontalEquals], "(Z\\otimes T)/J"],
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
          [EdgeKind.RightArrow, "", ""],
          "\\non(\\mathcal{K})",
          [EdgeKind.RightArrow, "", ""],
          "\\cf(\\mathcal{K})",
          [EdgeKind.RightArrow, "", ""],
          "\\cf(\\mathcal{L})",
        ],
        [
          [EdgeKind.DownArrow, "", ""],
          null,
          [EdgeKind.UpArrow, "", ""],
          null,
          [EdgeKind.UpArrow, "", ""],
          null,
          [EdgeKind.DownArrow, "", ""],
        ],
        [
          "\\add(\\mathcal{L})",
          [EdgeKind.RightArrow, "", ""],
          "\\add(\\mathcal{K})",
          [EdgeKind.RightArrow, "", ""],
          "\\cov(\\mathcal{K})",
          [EdgeKind.RightArrow, "", ""],
          "\\non(\\mathcal{L})",
        ],
      ],
    ],
  ])(
    "%O",
    quickCheck("main", (example) => `$\\begin{CD}${example}\\end{CD}$`),
  );
});
