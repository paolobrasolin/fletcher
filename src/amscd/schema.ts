import {
  array,
  defaulted,
  enums,
  literal,
  optional,
  string,
  tuple,
  union,
} from "superstruct";

export enum EdgeKind {
  // NOTE: using strings is kinda dirty, but it really helps w/ (de)serialization
  Empty = ".",
  HorizontalEquals = "=",
  VerticalEquals = "|",
  UpArrow = "A",
  DownArrow = "V",
  LeftArrow = "<",
  RightArrow = ">",
}

export const Vertex = string();

export const Label = defaulted(string(), "");

export const HorizontalEdge = tuple([
  enums([
    EdgeKind.Empty,
    EdgeKind.HorizontalEquals,
    EdgeKind.LeftArrow,
    EdgeKind.RightArrow,
  ]),
  optional(Label),
  optional(Label),
]);

export const VerticalEdge = tuple([
  enums([
    EdgeKind.Empty,
    EdgeKind.VerticalEquals,
    EdgeKind.UpArrow,
    EdgeKind.DownArrow,
  ]),
  optional(Label),
  optional(Label),
]);

export const Edge = union([HorizontalEdge, VerticalEdge]);

export const Blank = literal(null);

export const Cell = union([Vertex, Edge, Blank]);

export const Matrix = array(array(Cell));
