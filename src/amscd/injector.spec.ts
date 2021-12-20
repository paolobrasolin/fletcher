import * as U from "../universal/schema";
import * as S from "./schema";

import { inject } from "./injector";

test("Chichon's diagram", () => {
  expect(
    inject([
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
    ]),
  ).toEqual({
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
  });
});
