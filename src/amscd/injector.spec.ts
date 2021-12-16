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
      {
        id: 0,
        labels: [],
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
        labels: [],
        source: 1,
        target: 2,
        style: {
          body: U.Bodies.Solid,
          head: U.Heads.Arrow,
          level: 1,
          tail: U.Tails.Empty,
        },
      },
      {
        id: 2,
        labels: [],
        source: 2,
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
        labels: [],
        source: 0,
        target: 4,
        style: {
          body: U.Bodies.Solid,
          head: U.Heads.Arrow,
          level: 1,
          tail: U.Tails.Empty,
        },
      },
      {
        id: 4,
        labels: [],
        source: 5,
        target: 1,
        style: {
          body: U.Bodies.Solid,
          head: U.Heads.Arrow,
          level: 1,
          tail: U.Tails.Empty,
        },
      },
      {
        id: 5,
        labels: [],
        source: 6,
        target: 2,
        style: {
          body: U.Bodies.Solid,
          head: U.Heads.Arrow,
          level: 1,
          tail: U.Tails.Empty,
        },
      },
      {
        id: 6,
        labels: [],
        source: 3,
        target: 7,
        style: {
          body: U.Bodies.Solid,
          head: U.Heads.Arrow,
          level: 1,
          tail: U.Tails.Empty,
        },
      },
      {
        id: 7,
        labels: [],
        source: 4,
        target: 5,
        style: {
          body: U.Bodies.Solid,
          head: U.Heads.Arrow,
          level: 1,
          tail: U.Tails.Empty,
        },
      },
      {
        id: 8,
        labels: [],
        source: 5,
        target: 6,
        style: {
          body: U.Bodies.Solid,
          head: U.Heads.Arrow,
          level: 1,
          tail: U.Tails.Empty,
        },
      },
      {
        id: 9,
        labels: [],
        source: 6,
        target: 7,
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
        label: {
          content: "\\cov(\\mathcal{L})",
        },
        place: [0, 0],
      },
      {
        id: 1,
        label: {
          content: "\\non(\\mathcal{K})",
        },
        place: [1, 0],
      },
      {
        id: 2,
        label: {
          content: "\\cf(\\mathcal{K})",
        },
        place: [2, 0],
      },
      {
        id: 3,
        label: {
          content: "\\cf(\\mathcal{L})",
        },
        place: [3, 0],
      },
      {
        id: 4,
        label: {
          content: "\\add(\\mathcal{L})",
        },
        place: [0, 1],
      },
      {
        id: 5,
        label: {
          content: "\\add(\\mathcal{K})",
        },
        place: [1, 1],
      },
      {
        id: 6,
        label: {
          content: "\\cov(\\mathcal{K})",
        },
        place: [2, 1],
      },
      {
        id: 7,
        label: {
          content: "\\non(\\mathcal{L})",
        },
        place: [3, 1],
      },
    ],
  });
});
