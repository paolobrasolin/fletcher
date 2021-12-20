import * as U from "../universal/schema";

import { read, write } from ".";

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
            { alignment: U.Alignments.Left, content: "f" },
            { alignment: U.Alignments.Right, content: "x" },
          ],
          source: 0,
          target: 1,
        },
        {
          id: 1,
          labels: [
            { alignment: U.Alignments.Left, content: "i" },
            { alignment: U.Alignments.Right, content: "t" },
          ],
          source: 2,
          target: 0,
        },
        {
          id: 2,
          labels: [
            { alignment: U.Alignments.Right, content: "y" },
            { alignment: U.Alignments.Left, content: "g" },
          ],
          source: 1,
          target: 3,
        },
        {
          id: 3,
          labels: [
            { alignment: U.Alignments.Right, content: "z" },
            { alignment: U.Alignments.Left, content: "h" },
          ],
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
          source: 0,
          target: 1,
          style: {
            head: U.Heads.Empty,
            level: 2,
          },
        },
        {
          id: 1,
          source: 0,
          target: 2,
          style: {
            head: U.Heads.Empty,
            level: 2,
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
