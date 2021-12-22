// import { create } from "superstruct";
import * as U from "../universal/schema";
import * as S from "./schema";

const examples = [
  {
    name: "simple commutative diagram",
    dsl: "WzAsNCxbMCwwLCJBIl0sWzEsMCwiQiJdLFsxLDEsIkQiXSxbMCwxLCJDIl0sWzAsMSwiZiJdLFsxLDIsImgiXSxbMCwzLCJnIiwyXSxbMywyLCJrIiwyXV0=",
    ast: [
      0,
      4,
      [0, 0, "A"],
      [1, 0, "B"],
      [1, 1, "D"],
      [0, 1, "C"],
      [0, 1, "f"],
      [1, 2, "h"],
      [0, 3, "g", 2],
      [3, 2, "k", 2],
    ],
    rep: {
      edges: [
        {
          id: 0,
          labels: [{ alignment: U.Alignments.Left, content: "f" }],
          source: 0,
          target: 1,
        },
        {
          id: 1,
          labels: [{ alignment: U.Alignments.Left, content: "h" }],
          source: 1,
          target: 2,
        },
        {
          id: 2,
          labels: [{ alignment: U.Alignments.Right, content: "g" }],
          source: 0,
          target: 3,
        },
        {
          id: 3,
          labels: [{ alignment: U.Alignments.Right, content: "k" }],
          source: 3,
          target: 2,
        },
      ],
      vertices: [
        {
          id: 0,
          label: { content: "A" },
          place: [0, 0],
        },
        {
          id: 1,
          label: { content: "B" },
          place: [1, 0],
        },
        {
          id: 2,
          label: { content: "D" },
          place: [1, 1],
        },
        {
          id: 3,
          label: { content: "C" },
          place: [0, 1],
        },
      ],
    },
  },
  {
    name: "arrow options kitchen sink",
    dsl: "WzAsMixbMCwwLCJBIl0sWzEsMCwiQiJdLFswLDEsImYiLDEseyJsYWJlbF9wb3NpdGlvbiI6MzAsIm9mZnNldCI6LTUsImN1cnZlIjotNSwic2hvcnRlbiI6eyJzb3VyY2UiOjIwLCJ0YXJnZXQiOjIwfSwibGV2ZWwiOjMsImNvbG91ciI6WzEyMCw2MCw2MF0sInN0eWxlIjp7InRhaWwiOnsibmFtZSI6Im1hcHMgdG8ifSwiYm9keSI6eyJuYW1lIjoic3F1aWdnbHkifSwiaGVhZCI6eyJuYW1lIjoiZXBpIn19fSxbMCw2MCw2MCwxXV1d",
    ast: [
      0,
      2,
      [0, 0, "A"],
      [1, 0, "B"],
      [
        0,
        1,
        "f",
        1,
        {
          colour: [120, 60, 60],
          curve: -5,
          label_position: 30,
          level: 3,
          offset: -5,
          shorten: { source: 20, target: 20 },
          style: {
            body: { name: S.Shafts.Squiggly },
            head: { name: S.Tips.Epi },
            tail: { name: S.Tips.MapsTo },
          },
        },
        [0, 60, 60, 1],
      ],
    ],
    rep: {
      edges: [
        {
          id: 0,
          labels: [
            {
              alignment: U.Alignments.Centre,
              colour: [0.36, 0.84, 0.36, 1],
              content: "f",
            },
          ],
          source: 0,
          style: {
            body: U.Shafts.Squiggly,
            colour: [0.36, 0.84, 0.36, 1],
            head: U.Tips.ArrowDouble,
            level: 3,
            tail: U.Tips.Bar,
          },
          target: 1,
        },
      ],
      vertices: [
        {
          id: 0,
          label: { content: "A" },
          place: [0, 0],
        },
        {
          id: 1,
          label: { content: "B" },
          place: [1, 0],
        },
      ],
    },
  },
];

describe.each(examples)("$name", ({ name, dsl, ast, rep }) => {
  test("name is present", () => expect(name).not.toBeFalsy());
  test("DSL code is present", () => expect(dsl).not.toBeFalsy());
  // TODO: I tried checking coercion here, but it seems the data is modified in place for later tests, which is... disturbing. Is it happening anywhere else?
  // test("DSL AST is coercible", () =>
  //   expect(() => create(ast, S.Main)).not.toThrow());
  // test("UL AST is coercible", () =>
  //   expect(() => create(rep, U.Diagram)).not.toThrow());
});

export default examples;
