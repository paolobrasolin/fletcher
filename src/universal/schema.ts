import { array, string, object, number, any, enums } from "superstruct";

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

export const Edge = object({
  id: Id,
  source: Id,
  target: Id,
  labels: array(EdgeLabel),
});

export const Diagram = object({
  vertices: array(Vertex),
  edges: array(Edge),
});
