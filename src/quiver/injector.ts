import { Infer, assert } from "superstruct";
import * as S from "./schema";
import * as U from "../universal/schema";

function injectVertex(
  [x, y, label, colour]: Infer<typeof S.Vertex>,
  index: number,
): Infer<typeof U.Vertex> {
  assert(label, S.Label);
  return {
    id: index,
    place: [x, y], // TODO: handle generic layout
    label: {
      content: label,
    },
  };
}

function injectLabels(
  label: string | undefined,
  alignment: Infer<typeof S.Alignment> | undefined,
  options: Infer<typeof S.EdgeOptions> | undefined,
): Infer<typeof U.EdgeLabel>[] {
  if (!label) return [];
  return [
    {
      content: label,
    },
  ];
}

function injectEdge(
  [source, target, label, alignment, options]: Infer<typeof S.Edge>,
  index: number,
): Infer<typeof U.Edge> {
  return {
    id: index,
    source: source,
    target: target,
    // style: {
    //   colour: options?.colour,
    //   curve: options?.curve,
    //   level: options?.level,
    //   offset: options?.offset,
    //   // length,
    //   // shorten,
    //   style: options?.style, // TODO
    // },
    style: {
      body: U.Bodies.Solid,
      head: U.Heads.Arrow,
      level: 1,
      tail: U.Tails.Empty,
    },
    labels: injectLabels(label, alignment, options),
  };
}

export function inject(input: Infer<typeof S.Main>): Infer<typeof U.Diagram> {
  const [, verticesCount, ...cells] = input;
  const vertices = cells.slice(0, verticesCount).map(injectVertex);
  const edges = cells.slice(verticesCount).map(injectEdge);

  return {
    vertices,
    edges,
  };
}
