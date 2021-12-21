import { Infer, assert, create, number } from "superstruct";
import * as S from "./schema";
import * as U from "../universal/schema";

import { hslToRgb } from "../util";

export function injectColour([h, s, l, a]: Infer<typeof S.Colour>): Infer<
  typeof U.Colour
> {
  assert(a, number());
  const [r, g, b] = hslToRgb([h, s / 100, l / 100]);
  return [r, g, b, a];
}

function injectVertex(
  [x, y, label, colour]: Infer<typeof S.Vertex>,
  index: number,
): Infer<typeof U.Vertex> {
  assert(label, S.Label);
  assert(colour, S.Colour);
  return {
    id: index,
    place: [x, y], // TODO: handle generic layout
    label: {
      content: label,
      colour: injectColour(colour),
    },
  };
}

function injectLabels(
  label: string | undefined,
  alignment: Infer<typeof S.Alignment> | undefined,
  options: Infer<typeof S.EdgeOptions> | undefined,
): Infer<typeof U.EdgeLabel>[] {
  if (!label) return [];
  assert(alignment, S.Alignment);
  assert(options, S.EdgeOptions);
  const { label_position, colour } = options;
  assert(colour, S.Colour);
  assert(label_position, S.LabelPosition);
  return [
    create(
      {
        content: label,
        alignment: [
          U.Alignments.Left,
          U.Alignments.Centre,
          U.Alignments.Right,
          U.Alignments.Over,
        ][alignment],
        colour: injectColour(colour),
      },
      U.EdgeLabel,
    ),
  ];
}

function injectEdgeStyle({
  level,
  colour,
  style,
}: Infer<typeof S.EdgeOptions>): Infer<typeof U.EdgeStyle> {
  assert(style, S.EdgeStyle);
  const { head, body, tail } = style;

  assert(body, S.EdgeStyleBody);
  assert(body.name, S.EdgeStyleBodyName);
  const uBody = {
    [S.Shafts.Barred]: U.Shafts.Solid, // TODO: add bar label!
    [S.Shafts.Cell]: U.Shafts.Solid,
    [S.Shafts.Dashed]: U.Shafts.Dashed,
    [S.Shafts.Dotted]: U.Shafts.Dotted,
    [S.Shafts.None]: U.Shafts.Empty,
    [S.Shafts.Squiggly]: U.Shafts.Squiggly,
  }[body.name];

  assert(head, S.EdgeStyleHead);
  assert(head.name, S.EdgeStyleHeadName);
  const uHead = {
    [S.Tips.Arrowhead]: U.Tips.Arrow,
    [S.Tips.None]: U.Tips.Empty,
    [S.Tips.Epi]: U.Tips.ArrowDouble,
    [S.Tips.Harpoon]: {
      [S.Sides.Top]: U.Tips.HarpoonLeft,
      [S.Sides.Bottom]: U.Tips.HarpoonRight,
      default: undefined, // NOTE: should never happen
    }[head.side || "default"],
  }[head.name];

  assert(tail, S.EdgeStyleTail);
  assert(tail.name, S.EdgeStyleTailName);
  const uTail = {
    [S.Tips.Arrowhead]: U.Tips.Arrow,
    [S.Tips.MapsTo]: U.Tips.Bar,
    [S.Tips.Mono]: U.Tips.ArrowReverse,
    [S.Tips.None]: U.Tips.Empty,
    [S.Tips.Hook]: {
      [S.Sides.Top]: U.Tips.HookRight,
      [S.Sides.Bottom]: U.Tips.HookLeft,
      default: undefined, // NOTE: should never happen
    }[tail.side || "default"],
  }[tail.name];

  assert(level, S.Level);
  assert(colour, S.Colour);

  // TODO: handle special `name`d arrows

  return create(
    {
      body: uBody,
      colour: injectColour(colour),
      head: uHead,
      level: level,
      tail: uTail,
    },
    U.EdgeStyle,
  );
}

function injectEdge(
  [source, target, label, alignment, options]: Infer<typeof S.Edge>,
  index: number,
): Infer<typeof U.Edge> {
  assert(options, S.EdgeOptions);
  return create(
    {
      id: index,
      source: source,
      target: target,
      style: injectEdgeStyle(options),
      labels: injectLabels(label, alignment, options),
    },
    U.Edge,
  );
}

export function inject(input: Infer<typeof S.Main>): Infer<typeof U.Diagram> {
  const [, verticesCount, ...cells] = input;
  const vertices = cells.slice(0, verticesCount).map(injectVertex);
  const edges = cells.slice(verticesCount).map(injectEdge);
  return create(
    {
      vertices,
      edges,
    },
    U.Diagram,
  );
}
