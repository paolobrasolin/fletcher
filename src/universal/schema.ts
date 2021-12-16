import {
  any,
  array,
  defaulted,
  enums,
  number,
  object,
  string,
  min,
} from "superstruct";

export const Id = number();

const VertexLabel = object({
  content: string(),
});

export const EdgeLabel = object({
  content: string(),
  alignment: enums(["left", "right"]),
});

export const Vertex = object({
  id: Id,
  place: any(), // TODO
  label: VertexLabel,
});

export enum Heads {
  Empty,
  Arrow,
}

export const Head = enums([Heads.Empty, Heads.Arrow]);

export enum Bodies {
  Empty,
  Solid,
}

export const Body = enums([Bodies.Empty, Bodies.Solid]);

export enum Tails {
  Empty,
  Arrow,
}

export const Tail = enums([Tails.Empty, Tails.Arrow]);

export const EdgeStyle = object({
  head: defaulted(Head, Heads.Arrow),
  body: defaulted(Body, Bodies.Solid),
  tail: defaulted(Tail, Tails.Empty),
  level: defaulted(min(number(), 1), 1),
});

export const Edge = object({
  id: Id,
  source: Id,
  target: Id,
  labels: array(EdgeLabel),
  style: EdgeStyle,
});

export const Diagram = object({
  vertices: array(Vertex),
  edges: array(Edge),
});
