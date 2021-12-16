import { assert, Infer } from "superstruct";
import * as S from "./schema";

// TODO: shared helper?
export function stripGroups(input: string): string {
  let [i, f] = [input, input];
  do [i, f] = [f, f.replace(/{[^{}]+}/, "")];
  while (f != i);
  return f;
}

// TODO: shared helper?
export function protectChar(unsafeChar: string, input: string): string {
  return stripGroups(input).includes(unsafeChar) ? `{${input}}` : input;
}

export function renderLabel(kind: S.EdgeKind, label: string): string {
  return protectChar(kind, label);
}

export function renderEdge([kind, tlLab, brLab]:
  | Infer<typeof S.HorizontalEdge>
  | Infer<typeof S.VerticalEdge>): string {
  const noLabel = [
    S.EdgeKind.Empty,
    S.EdgeKind.VerticalEquals,
    S.EdgeKind.HorizontalEquals,
  ].includes(kind);
  if (noLabel) return `@${kind}`;
  const fstLab = renderLabel(kind, tlLab || "");
  const sndLab = renderLabel(kind, brLab || "");
  return `@${kind}${fstLab}${kind}${sndLab}${kind}`;
}

export function render(matrix: Infer<typeof S.Matrix>): string {
  const cells: string[][] = matrix.map((row, i) => {
    return row.map((cell, j) => {
      if (i % 2 == 0) {
        if (j % 2 == 0) {
          assert(cell, S.Vertex);
          return cell;
        } else {
          assert(cell, S.HorizontalEdge);
          return renderEdge(cell);
        }
      } else {
        if (j % 2 == 0) {
          assert(cell, S.VerticalEdge);
          return renderEdge(cell);
        } else {
          assert(cell, S.Blank);
          return "";
        }
      }
    });
  });
  const widths: number[] = [];
  cells.forEach((row) => {
    row.forEach((cell, j) => {
      widths[j] = Math.max(widths[j] || 0, cell?.length || 0);
    });
  });
  cells.forEach((row) => {
    row.forEach((cell, j) => {
      row[j] = cell.padEnd(widths[j], " ");
    });
  });
  const result = cells
    .map((row) => row.join("  ").padStart(2, "  "))
    .join("  \\\\\n")
    .trimEnd();
  return `\\begin{CD}\n${result}\n\\end{CD}`;
}
