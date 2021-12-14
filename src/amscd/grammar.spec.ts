import { spawn } from "child_process";
import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import { format } from "util";

import * as nearley from "nearley";

import grammar from "./grammar";

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

beforeAll(() => {
  return fs.mkdirSync(TMP_PATH);
});

afterAll(() => {
  return fs.rmSync(TMP_PATH, { recursive: true, force: true });
});

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
  (input: string, output: any) => {
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
    ["@.", ["."]],
    ["@ .", ["."]],
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
    ["@=", ["="]],
    ["@ =", ["="]],
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
    ["@|", ["|"]],
    ["@ |", ["|"]],
    ["@\\vert", ["\\vert"]],
    ["@ \\vert", ["\\vert"]],
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
    ["@AAA", ["A", "", ""]],
    ["@ A f  o  o A\r\n\tA", ["A", "f o o", ""]],
    ["@AfAA", ["A", "f", ""]],
    ["@AAgA", ["A", "", "g"]],
    ["@AfAgA", ["A", "f", "g"]],
    ["@A{A}A{A}A", ["A", "{A}", "{A}"]],
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
    ["@VVV", ["V", "", ""]],
    ["@ V f  o  o V\r\n\tV", ["V", "f o o", ""]],
    ["@VfVV", ["V", "f", ""]],
    ["@VVgV", ["V", "", "g"]],
    ["@VfVgV", ["V", "f", "g"]],
    ["@V{V}V{V}V", ["V", "{V}", "{V}"]],
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
    ["@<<<", ["<", "", ""]],
    ["@ < f  o  o <\r\n\t<", ["<", "f o o", ""]],
    ["@<f<<", ["<", "f", ""]],
    ["@<<g<", ["<", "", "g"]],
    ["@<f<g<", ["<", "f", "g"]],
    ["@<{<}<{<}<", ["<", "{<}", "{<}"]],
    ["@(((", ["(", "", ""]],
    ["@ ( f  o  o (\r\n\t(", ["(", "f o o", ""]],
    ["@(f((", ["(", "f", ""]],
    ["@((g(", ["(", "", "g"]],
    ["@(f(g(", ["(", "f", "g"]],
    ["@({(}({(}(", ["(", "{(}", "{(}"]],
  ])(
    "%O",
    quickCheck("left_arrow", (example) => `$\\begin{CD}A${example}B\\end{CD}$`),
  );
});

describe("right_arrow", () => {
  describe.each([
    ["@>>>", [">", "", ""]],
    ["@ > f  o  o >\r\n\t>", [">", "f o o", ""]],
    ["@>f>>", [">", "f", ""]],
    ["@>>g>", [">", "", "g"]],
    ["@>f>g>", [">", "f", "g"]],
    ["@>{>}>{>}>", [">", "{>}", "{>}"]],
    ["@)))", [")", "", ""]],
    ["@ ) f  o  o )\r\n\t)", [")", "f o o", ""]],
    ["@)f))", [")", "f", ""]],
    ["@))g)", [")", "", "g"]],
    ["@)f)g)", [")", "f", "g"]],
    ["@){)}){)})", [")", "{)}", "{)}"]],
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
    ["@.", ["."]],
    ["@=", ["="]],
    ["@<<<", ["<", "", ""]],
    ["@>>>", [">", "", ""]],
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
    ["@.", ["."]],
    ["@|", ["|"]],
    ["@AAA", ["A", "", ""]],
    ["@VVV", ["V", "", ""]],
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
    ["F @>>> G", ["F", [">", "", ""], "G"]],
    ["F @>>> G @>>> H", ["F", [">", "", ""], "G", [">", "", ""], "H"]],
  ])(
    "%O",
    quickCheck("odd_row", (example) => `$\\begin{CD}${example}\\end{CD}$`),
  );
});

describe("even_row", () => {
  describe.each([
    ["@VVV", [["V", "", ""]]],
    ["@VVV @VVV", [["V", "", ""], null, ["V", "", ""]]],
    [
      "@VVV @VVV @VVV",
      [["V", "", ""], null, ["V", "", ""], null, ["V", "", ""]],
    ],
  ])(
    "%O",
    quickCheck("even_row", (example) => `$\\begin{CD}\\\\${example}\\end{CD}$`),
  );
});

describe("matrix", () => {
  describe.each([
    ["F", [["F"]]],
    ["F @>>> G", [["F", [">", "", ""], "G"]]],
    ["F @>>> G @>>> H", [["F", [">", "", ""], "G", [">", "", ""], "H"]]],
    [`F \\\\\n @VVV \\\\\n G`, [["F"], [["V", "", ""]], ["G"]]],
    [
      "F \\\\\n @VVV \\\\\n G \\\\\n @VVV \\\\\n H",
      [["F"], [["V", "", ""]], ["G"], [["V", "", ""]], ["H"]],
    ],
    [
      "F @>>> G \\\\\n @VVV @VVV \\\\\n H @>>> I",
      [
        ["F", [">", "", ""], "G"],
        [["V", "", ""], null, ["V", "", ""]],
        ["H", [">", "", ""], "I"],
      ],
    ],
    [
      "F @>>> G @>>> H \\\\\n @VVV @VVV @VVV \\\\\n I @>>> J @>>> K \\\\\n @VVV @VVV @VVV \\\\\n L @>>> M @>>> N",
      [
        ["F", [">", "", ""], "G", [">", "", ""], "H"],
        [["V", "", ""], null, ["V", "", ""], null, ["V", "", ""]],
        ["I", [">", "", ""], "J", [">", "", ""], "K"],
        [["V", "", ""], null, ["V", "", ""], null, ["V", "", ""]],
        ["L", [">", "", ""], "M", [">", "", ""], "N"],
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
        ["S^{{\\mathcal{W}}_\\Lambda}\\otimes T", [">", "j", ""], "T"],
        [["V", "", ""], null, ["V", "", "{\\End P}"]],
        ["(S\\otimes T)/I", ["="], "(Z\\otimes T)/J"],
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
          [">", "", ""],
          "\\non(\\mathcal{K})",
          [">", "", ""],
          "\\cf(\\mathcal{K})",
          [">", "", ""],
          "\\cf(\\mathcal{L})",
        ],
        [
          ["V", "", ""],
          null,
          ["A", "", ""],
          null,
          ["A", "", ""],
          null,
          ["V", "", ""],
        ],
        [
          "\\add(\\mathcal{L})",
          [">", "", ""],
          "\\add(\\mathcal{K})",
          [">", "", ""],
          "\\cov(\\mathcal{K})",
          [">", "", ""],
          "\\non(\\mathcal{L})",
        ],
      ],
    ],
  ])(
    "%O",
    quickCheck("main", (example) => `$\\begin{CD}${example}\\end{CD}$`),
  );
});
