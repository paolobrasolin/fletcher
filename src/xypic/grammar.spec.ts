import { spawn } from "child_process";
import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";

import * as nearley from "nearley";

import xypicGrammar from "./grammar";

//=[ Parsing ]==================================================================

const parse = function (chunk: string, start?: string) {
  const grammar = nearley.Grammar.fromCompiled(xypicGrammar);
  if (start) grammar.start = start;
  const parser = new nearley.Parser(grammar);
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
\\usepackage[all]{xy}
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

//█[ I | The Kernel ]███████████████████████████████████████████████████████████

//■[ I.3 | Positions ]■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

testExamples(
  "pos",
  [
    "0",
    "0+0",
    "0-0",
    "0!0",
    "0.0",
    "0,0",
    "0;0",
    "0:0",
    // "0::0", // FIXME
    "0*{}",
    "0**{}",
    "0?<",
    "0@+0",
    '0=:"foo"',
  ],
  (example) => `\\xy${example}\\endxy`,
);

testExamples(
  "coord",
  ["0", "", "c", "p", "x", "y", "s1", "s{2}", '"foo"', "{;\\relax}"],
  (example) => `\\xy
@+@+@+              % stack some coordinates
="foo"              % save a coordinate
,${example},        % go to given coordinate
\\endxy`,
);

testExamples(
  "vector",
  ["0", "<1sp>", "<1em,-1.5cm>", "(1.6,-2)", "a(60)", "L", "L(2)", "/l1em/"],
  (example) => `\\xy
${example}**@{-}     % draw a line from origin to given vector
\\endxy`,
);

testExamples(
  "corner",
  [
    "L",
    "R",
    "D",
    "U",
    "CL",
    "CR",
    "CD",
    "CU",
    "C",
    "LD",
    "RD",
    "LU",
    "RU",
    "E",
    "P",
    "A",
  ],
  (example) => `\\xy
.(-1,-2).(3,4)*\\frm{-} % draw a box from (-1,-2) to (3,4)
;c;${example}**@{-}     % draw a line from c to given corner
\\endxy`,
);

testExamples(
  "place",
  [
    "<",
    "<<",
    "<<<<",
    ">",
    ">>",
    ">>>>",
    "(2)",
    "/1em/",
    "(2)>>",
    "!{(0,1);(1,0)}",
  ],
  (example) => `\\xy
<1cm,0cm>:              % set cartesian coordinates base
(0,0);(1,1)**@{-}       % trace a line from (0,0) to (1,1)
?${example}*{\\bullet}  % place a bullet at given place
\\endxy`,
);

testExamples("slide", ["/1pt/"]);

//■[ I.4 | Objects ]■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

testExamples("object", ["{}", "!0{}"]);

testExamples("objectbox", [
  "{}",
  // library_object
  // "@{}", // FIXME
  "\\hbox{}",
  "\\object{}",
  "\\composite{{}}",
  "\\xybox{}",
]);

testExamples("modifier", ["!0", "!{}", "+0", "h", "i", "[]", "[=]", "l"]);

testExamples("add_op", ["+", "-", "=", "+=", "-="]);

testExamples("size", ["", "0"]);

testExamples("direction", ["l", "v0", "q{}", "l:0", "l_", "l^"]);

testExamples("diag", ["l", "r", "d", "u", "ld", "rd", "lu", "ru"]);

testExamples("composite", ["{}", "{}*{}", "{}*{}*{}"]);

//■[ I.5 | Decorations ]■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

testExamples("decor", [
  "",
  "\\save0",
  "\\restore",
  "\\POS0",
  "\\afterPOS{\\relax}0",
  "\\drop{}",
  "\\connect{}",
  "\\relax",
  "\\xyverbose",
  "\\xytracing",
  "\\xyquiet",
  "\\xyignore{0\\relax}",
  "\\xycompile{0\\relax}",
  "\\xycompileto{foobar}{0\\relax}",
]);
