import { spawn } from "child_process";
import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";

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

const testExamples = function (
  start: string,
  examples: string[],
  context?: (example: string) => string,
) {
  describe(start, () => {
    describe.each(examples)("%s", (example) => {
      // NOTE: this checks that 1) it parses and 2) has no ambiguity
      test("parses", () => expect(parse(example, start)).toHaveLength(1));
      if (!context) return;
      (process.env.COMPILE ? test : test.skip)("compiles", async () => {
        await expect(compile(context(example))).resolves.toBe(0);
      });
    });
  });
};

//=[ Basics ]===================================================================

testExamples("label", [
  "f",
  "f g",
  "f g h",
  "{}",
  "{{}{{}}{{{}}}}",
  " { f { g { h { i } j } k } l } ",
  "\\mathcal{L}_\\Omega",
]);

//=[ Arrows ]===================================================================

testExamples("empty_arrow", ["@."]);
testExamples("horizontal_equals", ["@="]);
testExamples("vertical_equals", ["@|", "@\\vert"]);
testExamples("up_arrow", ["@AAA", "@AfAA", "@AAgA", "@AfAgA"]);
testExamples("down_arrow", ["@VVV", "@VfVV", "@VVgV", "@VfVgV"]);
testExamples("left_arrow", [
  "@<<<",
  "@<f<<",
  "@<<g<",
  "@<f<g<",
  "@(((",
  "@(f((",
  "@((g(",
  "@(f(g(",
]);
testExamples("right_arrow", [
  "@>>>",
  "@>f>>",
  "@>>g>",
  "@>f>g>",
  "@)))",
  "@)f))",
  "@))g)",
  "@)f)g)",
]);

//=[ Layout ]===================================================================

testExamples("horizontal_edge", ["@.", "@=", "@<<<", "@>>>"]);
testExamples("vertical_edge", ["@.", "@|", "@AAA", "@VVV"]);

testExamples("odd_row", ["F", "F @>>> G", "F @>>> G @>>> H"]);
testExamples("even_row", ["@VVV", "@VVV @VVV", "@VVV @VVV @VVV"]);

testExamples("matrix", [
  "F",
  "F @>>> G",
  "F @>>> G @>>> H",
  `F \\\\\n @VVV \\\\\n G`,
  "F \\\\\n @VVV \\\\\n G \\\\\n @VVV \\\\\n H",
  "F @>>> G \\\\\n @VVV @VVV \\\\\n H @>>> I",
  "F @>>> G @>>> H \\\\\n @VVV @VVV @VVV \\\\\n I @>>> J @>>> K \\\\\n @VVV @VVV @VVV \\\\\n L @>>> M @>>> N",
]);

//=[ Main ]=====================================================================

testExamples("main", [
  `\\begin{CD}
S^{{\\mathcal{W}}_\\Lambda}\\otimes T @>j>> T\\\\
@VVV @VV{\\End P}V\\\\
(S\\otimes T)/I @= (Z\\otimes T)/J
\\end{CD}`,
  `\\begin{CD}
\\cov(\\mathcal{L}) @>>> \\non(\\mathcal{K}) @>>> \\cf(\\mathcal{K}) @>>>
\\cf(\\mathcal{L})\\\\
@VVV @AAA @AAA @VVV\\\\
\\add(\\mathcal{L}) @>>> \\add(\\mathcal{K}) @>>> \\cov(\\mathcal{K}) @>>>
\\non(\\mathcal{L})
\\end{CD}`,
]);
