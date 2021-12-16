import { read, write } from ".";
import * as U from "../universal/schema";

describe.each([
  [
    "kitchen sink w/ labeled arrows",
    `\\begin{CD}
A       @>f>x>  B       \\\\
@AiAtA          @VyVgV  \\\\
C       @<z<h<  D
\\end{CD}`,
    {
      edges: [
        {
          id: 0,
          labels: [
            { alignment: "left", content: "f" },
            { alignment: "right", content: "x" },
          ],
          source: 0,
          target: 1,
          style: {
            body: U.Bodies.Solid,
            head: U.Heads.Arrow,
            level: 1,
            tail: U.Tails.Empty,
          },
        },
        {
          id: 1,
          labels: [
            { alignment: "left", content: "i" },
            { alignment: "right", content: "t" },
          ],
          source: 2,
          target: 0,
          style: {
            body: U.Bodies.Solid,
            head: U.Heads.Arrow,
            level: 1,
            tail: U.Tails.Empty,
          },
        },
        {
          id: 2,
          labels: [
            { alignment: "right", content: "y" },
            { alignment: "left", content: "g" },
          ],
          source: 1,
          target: 3,
          style: {
            body: U.Bodies.Solid,
            head: U.Heads.Arrow,
            level: 1,
            tail: U.Tails.Empty,
          },
        },
        {
          id: 3,
          labels: [
            { alignment: "right", content: "z" },
            { alignment: "left", content: "h" },
          ],
          source: 3,
          target: 2,
          style: {
            body: U.Bodies.Solid,
            head: U.Heads.Arrow,
            level: 1,
            tail: U.Tails.Empty,
          },
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
          label: { content: "C" },
          place: [0, 1],
        },
        {
          id: 3,
          label: { content: "D" },
          place: [1, 1],
        },
      ],
    },
  ],
  [
    "kitchen sink w/ unlabeled arrows",
    `\\begin{CD}
A   @=  B   \\\\
@|      @.  \\\\
C   @.  D
\\end{CD}`,
    {
      edges: [
        {
          id: 0,
          labels: [],
          source: 0,
          target: 1,
          style: {
            body: U.Bodies.Solid,
            head: U.Heads.Empty,
            level: 2,
            tail: U.Tails.Empty,
          },
        },
        {
          id: 1,
          labels: [],
          source: 0,
          target: 2,
          style: {
            body: U.Bodies.Solid,
            head: U.Heads.Empty,
            level: 2,
            tail: U.Tails.Empty,
          },
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
          label: { content: "C" },
          place: [0, 1],
        },
        {
          id: 3,
          label: { content: "D" },
          place: [1, 1],
        },
      ],
    },
  ],
])("%s", (_, sourcecode, representation) => {
  test("read", () => expect(read(sourcecode)).toEqual(representation));
  test("write", () => expect(write(representation)).toEqual(sourcecode));
});
