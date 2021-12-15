import {
  array,
  enums,
  literal,
  optional,
  string,
  tuple,
  union,
} from "superstruct";

export enum EdgeKind {
  Empty,
  HorizontalEquals,
  VerticalEquals,
  UpArrow,
  DownArrow,
  LeftArrow,
  RightArrow,
}

export const Vertex = string();

export const HorizontalEdge = tuple([
  enums([
    EdgeKind.Empty,
    EdgeKind.HorizontalEquals,
    EdgeKind.LeftArrow,
    EdgeKind.RightArrow,
  ]),
  optional(string()),
  optional(string()),
]);

export const VerticalEdge = tuple([
  enums([
    EdgeKind.Empty,
    EdgeKind.VerticalEquals,
    EdgeKind.UpArrow,
    EdgeKind.DownArrow,
  ]),
  optional(string()),
  optional(string()),
]);

export const Blank = literal(null);

export const Cell = union([Vertex, HorizontalEdge, VerticalEdge, Blank]);

export const Matrix = array(array(Cell));
