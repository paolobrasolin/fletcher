import {
  any,
  array,
  defaulted,
  enums,
  max,
  min,
  number,
  object,
  partial,
  string,
  tuple,
} from "superstruct";

// TODO: arbitrary precision
// TODO: alternative colour spaces
export const Colour = defaulted(
  tuple([
    max(min(number(), 0), 1), // r
    max(min(number(), 0), 1), // g
    max(min(number(), 0), 1), // b
    max(min(number(), 0), 1), // a
  ]),
  [0, 0, 0, 1], // fully opaque black
);

export const Id = number();

//=[ Vertex ]===================================================================

const VertexLabel = object({
  content: string(),
  colour: Colour,
});

export const Vertex = object({
  id: Id,
  place: any(), // TODO
  label: VertexLabel,
});

//=[ Edge ]=====================================================================

export enum Alignments {
  Left,
  Centre,
  Right,
  Over,
}

export const Alignment = defaulted(
  enums([
    Alignments.Left,
    Alignments.Centre,
    Alignments.Right,
    Alignments.Over,
  ]),
  Alignments.Left,
);

export const EdgeLabel = object({
  content: string(),
  alignment: Alignment,
  colour: Colour,
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
  labels: defaulted(array(EdgeLabel), []),
  style: EdgeStyle,
});

//=[ Diagram ]==================================================================

export const Diagram = object({
  vertices: array(Vertex),
  edges: array(Edge),
});
