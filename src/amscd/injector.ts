import { Infer, assert, create } from "superstruct";
import * as S from "./schema";
import * as U from "../universal/schema";

function id(i: number, j: number, width: number): Infer<typeof U.Id> {
  return j / 2 + (i / 2) * width;
}

function injectVertex(
  cel: Infer<typeof S.Vertex>,
  i: number,
  j: number,
  width: number,
): Infer<typeof U.Vertex> {
  return create(
    {
      id: id(i, j, width),
      place: [j / 2, i / 2],
      label: {
        content: cel,
      },
    },
    U.Vertex,
  );
}

function injectLabels(
  kind: S.EdgeKind,
  tlLab: string,
  brLab: string,
): Infer<typeof U.EdgeLabel>[] {
  const flip = [S.EdgeKind.RightArrow, S.EdgeKind.UpArrow].includes(kind);
  const labels = [];
  if (tlLab)
    labels.push({
      content: tlLab,
      alignment: flip ? U.Alignments.Left : U.Alignments.Right,
    });
  if (brLab)
    labels.push({
      content: brLab,
      alignment: flip ? U.Alignments.Right : U.Alignments.Left,
    });
  return labels.map((label) => create(label, U.EdgeLabel));
}

function injectStyle(kind: S.EdgeKind): Infer<typeof U.EdgeStyle> {
  if ([S.EdgeKind.VerticalEquals, S.EdgeKind.HorizontalEquals].includes(kind)) {
    return create({ head: U.Heads.Empty, level: 2 }, U.EdgeStyle);
  }
  return create({}, U.EdgeStyle);
}

function injectHorizontalEdge(
  [kind, tlLab, brLab]: Infer<typeof S.HorizontalEdge>,
  i: number,
  j: number,
  width: number,
): Infer<typeof U.Edge> {
  const flip = S.EdgeKind.LeftArrow == kind ? -1 : 1;
  assert(tlLab, S.Label);
  assert(brLab, S.Label);
  return create(
    {
      id: 0, // temporary
      source: id(i, j - 1 * flip, width),
      target: id(i, j + 1 * flip, width),
      labels: injectLabels(kind, tlLab, brLab),
      style: injectStyle(kind),
    },
    U.Edge,
  );
}

function injectVerticalEdge(
  [kind, tlLab, brLab]: Infer<typeof S.VerticalEdge>,
  i: number,
  j: number,
  width: number,
): Infer<typeof U.Edge> {
  const flip = S.EdgeKind.UpArrow == kind ? -1 : 1;
  assert(tlLab, S.Label);
  assert(brLab, S.Label);
  return create(
    {
      id: 0, // temporary
      source: id(i - 1 * flip, j, width),
      target: id(i + 1 * flip, j, width),
      labels: injectLabels(kind, tlLab, brLab),
      style: injectStyle(kind),
    },
    U.Edge,
  );
}

export function inject(input: Infer<typeof S.Matrix>): Infer<typeof U.Diagram> {
  const vertices: Infer<typeof U.Vertex>[] = [];
  const edges: Infer<typeof U.Edge>[] = [];

  const width: number = Math.ceil(
    Math.max(...input.map((row) => row.length), 0) / 2,
  );

  input.forEach((row, i: number) => {
    row.forEach((cell, j: number) => {
      if (i % 2 == 0) {
        if (j % 2 == 0) {
          assert(cell, S.Vertex);
          const vertex = injectVertex(cell, i, j, width);
          if (vertex) vertices.push(vertex);
        } else {
          assert(cell, S.HorizontalEdge);
          if (S.EdgeKind.Empty == cell[0]) return;
          const edge = injectHorizontalEdge(cell, i, j, width);
          if (edge) edges.push(edge);
        }
      } else {
        if (j % 2 == 0) {
          assert(cell, S.VerticalEdge);
          if (S.EdgeKind.Empty == cell[0]) return;
          const edge = injectVerticalEdge(cell, i, j, width);
          if (edge) edges.push(edge);
        } else {
          assert(cell, S.Blank);
        }
      }
    });
  });

  // Indices are easier to generate a posteriori.
  edges.forEach((edge, index) => {
    edge.id = index;
  });

  return create({ vertices, edges }, U.Diagram);
}
