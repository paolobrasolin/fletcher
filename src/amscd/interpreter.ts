import { Infer, assert } from "superstruct";
import * as S from "./schema";
import * as U from "../universal/schema";

const id = (i: number, j: number, width: number): Infer<typeof U.Id> =>
  j / 2 + (i / 2) * width;

const injectVertex = (
  cel: Infer<typeof S.Vertex>,
  i: number,
  j: number,
  width: number,
): Infer<typeof U.Vertex> => {
  return {
    id: id(i, j, width),
    place: [0, j / 2, i / 2],
    label: {
      content: cel,
    },
  };
};

const injectHorizontalEdge = (
  [kind, tlLab, brLab]: Infer<typeof S.HorizontalEdge>,
  i: number,
  j: number,
  width: number,
): Infer<typeof U.Edge> | undefined => {
  if (S.EdgeKind.Empty == kind) return;
  const flip = S.EdgeKind.LeftArrow == kind ? -1 : 1;
  return {
    id: 0, // temporary
    source: id(i, j - 1 * flip, width),
    target: id(i, j + 1 * flip, width),
    labels: [], // TODO
  };
};

const injectVerticalEdge = (
  [kind, tlLab, brLab]: Infer<typeof S.VerticalEdge>,
  i: number,
  j: number,
  width: number,
): Infer<typeof U.Edge> | undefined => {
  if (S.EdgeKind.Empty == kind) return;
  const flip = S.EdgeKind.UpArrow == kind ? -1 : 1;
  return {
    id: 0, // temporary
    source: id(i - 1 * flip, j, width),
    target: id(i + 1 * flip, j, width),
    labels: [], // TODO
  };
};

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
          const edge = injectHorizontalEdge(cell, i, j, width);
          if (edge) edges.push(edge);
        }
      } else {
        if (j % 2 == 0) {
          assert(cell, S.VerticalEdge);
          const edge = injectVerticalEdge(cell, i, j, width);
          if (edge) edges.push(edge);
        } else {
          assert(cell, S.Blank);
        }
      }
    });
  });

  edges.forEach((edge, index) => {
    edge.id = index;
  });

  return { vertices, edges };
}
