import * as U from "../universal/schema";

import { read, write } from ".";

describe.each([
  [
    "simple commutative diagram",
    "WzAsNCxbMCwwLCJBIl0sWzEsMCwiQiJdLFsxLDEsIkQiXSxbMCwxLCJDIl0sWzAsMSwiZiJdLFsxLDIsImgiXSxbMCwzLCJnIiwyXSxbMywyLCJrIiwyXV0=",
    {
      edges: [
        {
          id: 0,
          labels: [{ alignment: U.Alignments.Left, content: "f" }],
          source: 0,
          style: {
            head: U.Heads.Arrow,
            body: U.Bodies.Solid,
            level: 1,
            tail: U.Tails.Empty,
          },
          target: 1,
        },
        {
          id: 1,
          labels: [{ alignment: U.Alignments.Left, content: "h" }],
          source: 1,
          style: {
            head: U.Heads.Arrow,
            body: U.Bodies.Solid,
            level: 1,
            tail: U.Tails.Empty,
          },
          target: 2,
        },
        {
          id: 2,
          labels: [{ alignment: U.Alignments.Right, content: "g" }],
          source: 0,
          style: {
            head: U.Heads.Arrow,
            body: U.Bodies.Solid,
            level: 1,
            tail: U.Tails.Empty,
          },
          target: 3,
        },
        {
          id: 3,
          labels: [{ alignment: U.Alignments.Right, content: "k" }],
          source: 3,
          style: {
            body: U.Bodies.Solid,
            head: U.Heads.Arrow,
            level: 1,
            tail: U.Tails.Empty,
          },
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
  ],
])("%s", (_, sourcecode, representation) => {
  test("read", () => expect(read(sourcecode)).toMatchObject(representation));
  // test("write", () => expect(write(representation)).toEqual(sourcecode));
});
