import { assert, Infer, min, number, tuple } from "superstruct";
import * as S from "./schema";
import * as U from "../universal/schema";

export function project({
  vertices,
  edges,
}: Infer<typeof U.Diagram>): Infer<typeof S.Matrix> {
  const matrix: Infer<typeof S.Matrix> = [];
  const places: [number, number][] = [];
  vertices.forEach(({ id, label: { content }, place }) => {
    // NOTE: we're assuming a zero-based matrix layout for simplicity
    // TODO: abandon this assumption
    assert(place, tuple([min(number(), 0), min(number(), 0)]));
    places[id] = place;
    matrix[place[1] * 2] ??= [];
    matrix[place[1] * 2][place[0] * 2] ??= content;
  });
  edges.forEach(({ source, target, labels, style }) => {
    assert(style, U.EdgeStyle);
    const { head, body, tail, level } = style;

    const [sx, sy] = places[source];
    const [tx, ty] = places[target];
    const dx = tx - sx;
    const dy = ty - sy;

    const tlLab =
      labels?.find(({ alignment }) => alignment == U.Alignments.Left)
        ?.content || "";
    const brLab =
      labels?.find(({ alignment }) => alignment == U.Alignments.Right)
        ?.content || "";

    // TODO: raise some error on unsupported hops
    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) return;
    if (!(Math.abs(dx) ^ Math.abs(dy))) return;

    if (dy == 0) matrix[2 * sy] ??= [];
    if (dx == 0) matrix[sy + ty] ??= [];

    if (
      head == U.Tips.Arrow &&
      body == U.Shafts.Solid &&
      tail == U.Tips.Empty &&
      level == 1
    ) {
      if (dy == +1)
        matrix[sy + ty][2 * sx] = [S.EdgeKind.DownArrow, brLab, tlLab];
      if (dy == -1)
        matrix[sy + ty][2 * sx] = [S.EdgeKind.UpArrow, tlLab, brLab];
      if (dx == +1)
        matrix[2 * sy][sx + tx] = [S.EdgeKind.RightArrow, tlLab, brLab];
      if (dx == -1)
        matrix[2 * sy][sx + tx] = [S.EdgeKind.LeftArrow, brLab, tlLab];
    } else if (
      head == U.Tips.Empty &&
      body == U.Shafts.Solid &&
      tail == U.Tips.Empty &&
      level == 2
    ) {
      if (dx == 0)
        matrix[sy + ty][2 * sx] = [S.EdgeKind.VerticalEquals, "", ""];
      if (dy == 0)
        matrix[2 * sy][sx + tx] = [S.EdgeKind.HorizontalEquals, "", ""];
    } else {
      // TODO: raise some error on unsupported styles
    }
  });

  const width = Math.max(...matrix.map((row) => row.length));
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < width; j++) {
      if (i % 2 ^ j % 2) {
        matrix[i][j] ??= [S.EdgeKind.Empty, "", ""];
      } else if (i % 2) {
        matrix[i][j] ??= null;
      } else {
        matrix[i][j] ??= "";
      }
    }
  }

  return matrix;
}
