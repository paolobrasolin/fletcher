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
];

export default examples;
