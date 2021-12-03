import * as nearley from "nearley";
import calculatorGrammar, { Op } from "./calculator";

const grammar = nearley.Grammar.fromCompiled(calculatorGrammar);

const parse = function (chunk: string) {
  const parser = new nearley.Parser(grammar);
  parser.feed(chunk);
  return parser.results;
};

describe("integers", () => {
  test("unsigned", () => expect(parse("123")).toEqual([123]));
  test("positive", () => expect(parse("+123")).toEqual([123]));
  test("negative", () => expect(parse("-123")).toEqual([-123]));
});

describe("floats", () => {
  test("unsigned", () => expect(parse("123.456")).toEqual([123.456]));
  test("positive", () => expect(parse("+123.456")).toEqual([123.456]));
  test("negative", () => expect(parse("-123.456")).toEqual([-123.456]));
});

describe("one operation", () => {
  test("exponentiation", () => expect(parse("1^2")).toEqual([[Op.Exp, 1, 2]]));
  test("division", () => expect(parse("1/2")).toEqual([[Op.Div, 1, 2]]));
  test("multiplication", () => expect(parse("1*2")).toEqual([[Op.Mul, 1, 2]]));
  test("subtraction", () => expect(parse("1-2")).toEqual([[Op.Sub, 1, 2]]));
  test("sum", () => expect(parse("1+2")).toEqual([[Op.Sum, 1, 2]]));
});

describe("two operations, same precedence, left associative", () => {
  const precedences: Op[][] = [
    [Op.Sum, Op.Sub],
    [Op.Mul, Op.Div],
  ];

  precedences.forEach((os) => {
    os.forEach((p) => {
      os.forEach((q) => {
        test(`x${p}y${q}z=(x${p}y)${q}z`, () =>
          expect(parse(`1${p}2${q}3`)).toEqual([[q, [p, 1, 2], 3]]));
        test(`x${p}(y${q}z)!=(x${p}y)${q}z`, () =>
          expect(parse(`1${p}(2${q}3)`)).toEqual([[p, 1, [q, 2, 3]]]));
      });
    });
  });
});

describe("two operations, same precedence, right associative", () => {
  const precedences: Op[][] = [[Op.Exp]];

  precedences.forEach((os) => {
    os.forEach((p) => {
      os.forEach((q) => {
        test(`x${p}y${q}z=x${p}(y${q}z)`, () =>
          expect(parse(`1${p}2${q}3`)).toEqual([[p, 1, [q, 2, 3]]]));
        test(`(x${p}y)${q}z!=x${p}(y${q}z)`, () =>
          expect(parse(`(1${p}2)${q}3`)).toEqual([[q, [p, 1, 2], 3]]));
      });
    });
  });
});

describe("two operations, different precedence", () => {
  const precedences: Op[][] = [[Op.Sum, Op.Sub], [Op.Mul, Op.Div], [Op.Exp]];

  for (let i = 0; i < precedences.length - 1; i++) {
    precedences[i].forEach((l) => {
      precedences[i + 1].forEach((h) => {
        test(`x${h}y${l}z=(x${h}y)${l}z`, () =>
          expect(parse(`1${h}2${l}3`)).toEqual([[l, [h, 1, 2], 3]]));
        test(`x${h}(y${l}z)!=(x${h}y)${l}z`, () =>
          expect(parse(`1${h}(2${l}3)`)).toEqual([[h, 1, [l, 2, 3]]]));
        test(`x${l}y${h}z=x${l}(y${h}z)`, () =>
          expect(parse(`1${l}2${h}3`)).toEqual([[l, 1, [h, 2, 3]]]));
        test(`(x${l}y)${h}z!=x${l}(y${h}z)`, () =>
          expect(parse(`(1${l}2)${h}3`)).toEqual([[h, [l, 1, 2], 3]]));
      });
    });
  }
});

test("whitespace", () => expect(parse(" 1 + 2 ")).toEqual([[Op.Sum, 1, 2]]));
