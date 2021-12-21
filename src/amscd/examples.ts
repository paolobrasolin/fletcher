import * as U from "../universal/schema";
import * as S from "./schema";

const examples = [
  {
    name: "kitchen sink w/ labeled arrows",
    dsl: `\\begin{CD}
A       @>f>x>  B       \\\\
@AiAtA          @VyVgV  \\\\
C       @<z<h<  D
\\end{CD}`,
    ast: [
      ["A", [S.EdgeKind.RightArrow, "f", "x"], "B"],
      [[S.EdgeKind.UpArrow, "i", "t"], null, [S.EdgeKind.DownArrow, "y", "g"]],
      ["C", [S.EdgeKind.LeftArrow, "z", "h"], "D"],
    ],
    rep: {
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
  },
  {
    name: "kitchen sink w/ unlabeled arrows",
    dsl: `\\begin{CD}
A   @=  B   \\\\
@|      @.  \\\\
C   @.  D
\\end{CD}`,
    ast: [
      ["A", [S.EdgeKind.HorizontalEquals], "B"],
      [[S.EdgeKind.VerticalEquals], null, [S.EdgeKind.Empty]],
      ["C", [S.EdgeKind.Empty], "D"],
    ],
    rep: {
      edges: [
        {
          id: 0,
          source: 0,
          target: 1,
          style: {
            head: U.Tips.Empty,
            level: 2,
          },
        },
        {
          id: 1,
          source: 0,
          target: 2,
          style: {
            head: U.Tips.Empty,
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
  },
  {
    name: "Chichon's diagram",
    dsl: `\\begin{CD}
\\cov(\\mathcal{L})  @>>>  \\non(\\mathcal{K})  @>>>  \\cf(\\mathcal{K})   @>>>  \\cf(\\mathcal{L})   \\\\
@VVV                     @AAA                     @AAA                     @VVV               \\\\
\\add(\\mathcal{L})  @>>>  \\add(\\mathcal{K})  @>>>  \\cov(\\mathcal{K})  @>>>  \\non(\\mathcal{L})
\\end{CD}`,
    ast: [
      [
        "\\cov(\\mathcal{L})",
        [S.EdgeKind.RightArrow, "", ""],
        "\\non(\\mathcal{K})",
        [S.EdgeKind.RightArrow, "", ""],
        "\\cf(\\mathcal{K})",
        [S.EdgeKind.RightArrow, "", ""],
        "\\cf(\\mathcal{L})",
      ],
      [
        [S.EdgeKind.DownArrow, "", ""],
        null,
        [S.EdgeKind.UpArrow, "", ""],
        null,
        [S.EdgeKind.UpArrow, "", ""],
        null,
        [S.EdgeKind.DownArrow, "", ""],
      ],
      [
        "\\add(\\mathcal{L})",
        [S.EdgeKind.RightArrow, "", ""],
        "\\add(\\mathcal{K})",
        [S.EdgeKind.RightArrow, "", ""],
        "\\cov(\\mathcal{K})",
        [S.EdgeKind.RightArrow, "", ""],
        "\\non(\\mathcal{L})",
      ],
    ],
    rep: {
      edges: [
        { id: 0, source: 0, target: 1 },
        { id: 1, source: 1, target: 2 },
        { id: 2, source: 2, target: 3 },
        { id: 3, source: 0, target: 4 },
        { id: 4, source: 5, target: 1 },
        { id: 5, source: 6, target: 2 },
        { id: 6, source: 3, target: 7 },
        { id: 7, source: 4, target: 5 },
        { id: 8, source: 5, target: 6 },
        { id: 9, source: 6, target: 7 },
      ],
      vertices: [
        {
          id: 0,
          label: { content: "\\cov(\\mathcal{L})" },
          place: [0, 0],
        },
        {
          id: 1,
          label: { content: "\\non(\\mathcal{K})" },
          place: [1, 0],
        },
        {
          id: 2,
          label: { content: "\\cf(\\mathcal{K})" },
          place: [2, 0],
        },
        {
          id: 3,
          label: { content: "\\cf(\\mathcal{L})" },
          place: [3, 0],
        },
        {
          id: 4,
          label: { content: "\\add(\\mathcal{L})" },
          place: [0, 1],
        },
        {
          id: 5,
          label: { content: "\\add(\\mathcal{K})" },
          place: [1, 1],
        },
        {
          id: 6,
          label: { content: "\\cov(\\mathcal{K})" },
          place: [2, 1],
        },
        {
          id: 7,
          label: { content: "\\non(\\mathcal{L})" },
          place: [3, 1],
        },
      ],
    },
  },
];

export default examples;
