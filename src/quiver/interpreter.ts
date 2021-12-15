import { Infer } from "superstruct";
import * as S from "./schema";
import * as U from "../universal/schema";

function injectVertex(
  [x, y, label, colour]: Infer<typeof S.Vertex>,
  index: number,
): Infer<typeof U.Vertex> {
  return {
    id: index,
    place: [x, y], // TODO: handle generic layout
    label: {
      content: label || "",
      // colour: colour,
    },
  };
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
    labels: [
      {
        content: label || "",
        // alignment: alignment,
        // position: options?.label_position,
        // colour: options?.colour,
      },
    ],
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
