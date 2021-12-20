import {
  any,
  array,
  defaulted,
  enums,
  min,
  number,
  object,
  optional,
  partial,
  string,
} from "superstruct";

//=[ Common ]===================================================================

export const Id = number();

//=[ Vertex ]===================================================================

const VertexLabel = object({
  content: string(),
});

export const Vertex = object({
  id: Id,
  place: any(), // TODO
  label: VertexLabel,
});

//=[ Edge ]=====================================================================

export enum Alignments {
  Left,
  Right,
}

export const Alignment = defaulted(
  enums([Alignments.Left, Alignments.Right]),
  Alignments.Left,
);

export const EdgeLabel = object({
  content: string(),
  alignment: optional(Alignment),
});

export enum Heads {
  Empty,
  Arrow,
}

export const Head = defaulted(enums([Heads.Empty, Heads.Arrow]), Heads.Arrow);

export enum Bodies {
  Empty,
  Solid,
}

export const Body = defaulted(
  enums([Bodies.Empty, Bodies.Solid]),
  Bodies.Solid,
);

export enum Tails {
  Empty,
  Arrow,
}

export const Tail = defaulted(enums([Tails.Empty, Tails.Arrow]), Tails.Empty);

export const Level = defaulted(min(number(), 1), 1);

export const EdgeStyle = defaulted(
  partial(
    object({
      head: Head,
      body: Body,
      tail: Tail,
      level: Level,
    }),
  ),
  {},
);

export const Edge = object({
  id: Id,
  source: Id,
  target: Id,
  labels: optional(array(EdgeLabel)),
  style: optional(EdgeStyle),
});

//=[ Diagram ]==================================================================

export const Diagram = object({
  vertices: array(Vertex),
  edges: array(Edge),
});
