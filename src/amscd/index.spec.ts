import { read } from ".";

test("kitchen sink", () => {
  expect(
    read(`\\begin{CD}
A       @>f>x>  B       @=  C   \\\\
@AiAtA          @VyVgV      @|  \\\\
D       @<z<h<  E       @.  F
\\end{CD}`),
  ).toEqual({
    edges: [
      {
        id: 0,
        labels: [
          { content: "f", alignment: "left" },
          { content: "x", alignment: "right" },
        ],
        source: 0,
        target: 1,
      },
      {
        id: 1,
        labels: [],
        source: 1,
        target: 2,
      },
      {
        id: 2,
        labels: [
          { content: "i", alignment: "left" },
          { content: "t", alignment: "right" },
        ],
        source: 3,
        target: 0,
      },
      {
        id: 3,
        labels: [
          { content: "y", alignment: "right" },
          { content: "g", alignment: "left" },
        ],
        source: 1,
        target: 4,
      },
      {
        id: 4,
        labels: [],
        source: 2,
        target: 5,
      },
      {
        id: 5,
        labels: [
          { content: "z", alignment: "right" },
          { content: "h", alignment: "left" },
        ],
        source: 4,
        target: 3,
      },
    ],
    vertices: [
      {
        id: 0,
        label: {
          content: "A",
        },
        place: [0, 0],
      },
      {
        id: 1,
        label: {
          content: "B",
        },
        place: [1, 0],
      },
      {
        id: 2,
        label: {
          content: "C",
        },
        place: [2, 0],
      },
      {
        id: 3,
        label: {
          content: "D",
        },
        place: [0, 1],
      },
      {
        id: 4,
        label: {
          content: "E",
        },
        place: [1, 1],
      },
      {
        id: 5,
        label: {
          content: "F",
        },
        place: [2, 1],
      },
    ],
  });
});
