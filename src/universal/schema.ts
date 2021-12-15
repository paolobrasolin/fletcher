import { array, string, object, number, any } from "superstruct";

export const Id = number();

const Label = object({
  content: string(),
});

const VertexLabel = Label;
const EdgeLabel = Label;

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
