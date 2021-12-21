import { create } from "superstruct";
import * as U from "../universal/schema";
import * as S from "./schema";

import { project } from "./projector";

describe.each([
  [
    "a commutative square",
    [
      0,
      4,
      [0, 0, "A", [0, 0, 0, 1]],
      [1, 0, "B", [0, 0, 0, 1]],
      [1, 1, "D", [0, 0, 0, 1]],
      [0, 1, "C", [0, 0, 0, 1]],
      [
        0,
        1,
        "f",
        0,
        {
          colour: [0, 0, 0, 1],
          curve: 0,
          label_position: 50,
          length: undefined,
          level: 1,
          offset: 0,
          shorten: { source: 0, target: 0 },
          style: {
            body: { level: undefined, name: "cell" },
            head: { name: "arrowhead", side: undefined },
            name: "arrow",
            tail: { name: "none", side: undefined },
          },
        },
        [0, 0, 0, 1],
      ],
      [
        1,
        2,
        "h",
        0,
        {
          colour: [0, 0, 0, 1],
          curve: 0,
          label_position: 50,
          length: undefined,
          level: 1,
          offset: 0,
          shorten: { source: 0, target: 0 },
          style: {
            body: { level: undefined, name: "cell" },
            head: { name: "arrowhead", side: undefined },
            name: "arrow",
            tail: { name: "none", side: undefined },
          },
        },
        [0, 0, 0, 1],
      ],
      [
        0,
        3,
        "g",
        2,
        {
          colour: [0, 0, 0, 1],
          curve: 0,
          label_position: 50,
          length: undefined,
          level: 1,
          offset: 0,
          shorten: { source: 0, target: 0 },
          style: {
            body: { level: undefined, name: "cell" },
            head: { name: "arrowhead", side: undefined },
            name: "arrow",
            tail: { name: "none", side: undefined },
          },
        },
        [0, 0, 0, 1],
      ],
      [
        3,
        2,
        "k",
        2,
        {
          colour: [0, 0, 0, 1],
          curve: 0,
          label_position: 50,
          length: undefined,
          level: 1,
          offset: 0,
          shorten: { source: 0, target: 0 },
          style: {
            body: { level: undefined, name: "cell" },
            head: { name: "arrowhead", side: undefined },
            name: "arrow",
            tail: { name: "none", side: undefined },
          },
        },
        [0, 0, 0, 1],
      ],
    ],

    {
      edges: [
        {
          id: 0,
          labels: [
            {
              content: "f",
            },
          ],
          source: 0,
          style: {
            body: U.Bodies.Solid,
            head: U.Heads.Arrow,
            level: 1,
            tail: U.Tails.Empty,
          },
          target: 1,
        },
        {
          id: 1,
          labels: [
            {
              content: "h",
            },
          ],
          source: 1,
          style: {
            body: U.Bodies.Solid,
            head: U.Heads.Arrow,
            level: 1,
            tail: U.Tails.Empty,
          },
          target: 2,
        },
        {
          id: 2,
          labels: [
            {
              content: "g",
            },
          ],
          source: 0,
          style: {
            body: U.Bodies.Solid,
            head: U.Heads.Arrow,
            level: 1,
            tail: U.Tails.Empty,
          },
          target: 3,
        },
        {
          id: 3,
          labels: [
            {
              content: "k",
            },
          ],
          source: 3,
          style: {
            body: U.Bodies.Solid,
            head: U.Heads.Arrow,
            level: 1,
            tail: U.Tails.Empty,
          },
          target: 2,
        },
      ],
      vertices: [
        {
          id: 0,
          label: {
            colour: [0, 0, 0, 1],
            content: "A",
          },
          place: [0, 0],
        },
        {
          id: 1,
          label: {
            colour: [0, 0, 0, 1],
            content: "B",
          },
          place: [1, 0],
        },
        {
          id: 2,
          label: {
            colour: [0, 0, 0, 1],
            content: "D",
          },
          place: [1, 1],
        },
        {
          id: 3,
          label: {
            colour: [0, 0, 0, 1],
            content: "C",
          },
          place: [0, 1],
        },
      ],
    },
  ],
])("%s", (_, ast, ul) => {
  xtest("project", () => expect(project(create(ul, U.Diagram))).toEqual(ast));
});
