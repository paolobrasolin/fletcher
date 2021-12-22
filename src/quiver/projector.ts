import { Infer, create, is, enums } from "superstruct";
import * as S from "./schema";
import * as U from "../universal/schema";

import { rgbToHsl } from "../util";

export function projectColour([r, g, b, a]: Infer<typeof U.Colour>): Infer<
  typeof S.Colour
> {
  const [h, s, l] = rgbToHsl([r, g, b]);
  return [h, s * 100, l * 100, a];
}

function projectVertices(
  vertices: Infer<typeof U.Vertex>[],
): Infer<typeof S.Vertex>[] {
  // NOTE: we're assuming the ids are sequential, even if not sorted
  // TODO: we need to relax the assumption, I think
  return [...vertices]
    .sort(({ id: idA }, { id: idB }) => Math.sign(idA - idB))
    .map(({ id, label, place }) => {
      const [x, y] = place;
      return [x, y, label.content, projectColour(label.colour)];
    });
}

const SupportedBody = enums([
  U.Shafts.Empty,
  U.Shafts.Solid,
  U.Shafts.Dotted,
  U.Shafts.Dashed,
  U.Shafts.Squiggly,
]);

function projectBody(
  body: Infer<typeof U.Body>,
): Infer<typeof S.EdgeStyleBody> {
  if (!is(body, SupportedBody)) return {};
  return create(
    {
      name: {
        [U.Shafts.Empty]: S.Shafts.None,
        [U.Shafts.Solid]: S.Shafts.Cell,
        [U.Shafts.Dotted]: S.Shafts.Dotted,
        [U.Shafts.Dashed]: S.Shafts.Dashed,
        [U.Shafts.Squiggly]: S.Shafts.Squiggly,
      }[body],
    },
    S.EdgeStyleBody,
  );
}
const SupportedHead = enums([
  U.Tips.Empty,
  U.Tips.Arrow,
  U.Tips.ArrowDouble,
  U.Tips.HarpoonLeft,
  U.Tips.HarpoonRight,
]);

function projectHead(
  head: Infer<typeof U.Head>,
): Infer<typeof S.EdgeStyleHead> {
  if (!is(head, SupportedHead)) return {};
  return create(
    {
      name: {
        [U.Tips.Empty]: S.Tips.None,
        [U.Tips.Arrow]: S.Tips.Arrowhead,
        [U.Tips.ArrowDouble]: S.Tips.Epi,
        [U.Tips.HarpoonLeft]: S.Tips.Harpoon,
        [U.Tips.HarpoonRight]: S.Tips.Harpoon,
      }[head],
      side: {
        [U.Tips.Empty]: undefined,
        [U.Tips.Arrow]: undefined,
        [U.Tips.ArrowDouble]: undefined,
        [U.Tips.HarpoonLeft]: S.Sides.Top,
        [U.Tips.HarpoonRight]: S.Sides.Bottom,
      }[head],
    },
    S.EdgeStyleHead,
  );
}

const SupportedTail = enums([
  U.Tips.Empty,
  U.Tips.Arrow,
  U.Tips.ArrowReverse,
  U.Tips.HookLeft,
  U.Tips.HookRight,
  U.Tips.Bar,
]);

function projectTail(
  tail: Infer<typeof U.Tail>,
): Infer<typeof S.EdgeStyleTail> {
  if (!is(tail, SupportedTail)) return {};
  return create(
    {
      name: {
        [U.Tips.Empty]: S.Tips.None,
        [U.Tips.Arrow]: S.Tips.Arrowhead,
        [U.Tips.ArrowReverse]: S.Tips.Mono,
        [U.Tips.HookLeft]: S.Tips.Hook,
        [U.Tips.HookRight]: S.Tips.Hook,
        [U.Tips.Bar]: S.Tips.MapsTo,
      }[tail],
      side: {
        [U.Tips.Empty]: undefined,
        [U.Tips.Arrow]: undefined,
        [U.Tips.ArrowReverse]: undefined,
        [U.Tips.HookLeft]: S.Sides.Bottom,
        [U.Tips.HookRight]: S.Sides.Top,
        [U.Tips.Bar]: undefined,
      }[tail],
    },
    S.EdgeStyleTail,
  );
}

export function projectEdgeStyle({
  head,
  body,
  tail,
}: Infer<typeof U.EdgeStyle>): Infer<typeof S.EdgeStyle> {
  // TODO: handle unsupported shafts/tips with warning
  // TODO: handle special arrows
  return create(
    {
      // name: S.EdgeStyleNames.Arrow,
      body: projectBody(body),
      head: projectHead(head),
      tail: projectTail(tail),
    },
    S.EdgeStyle,
  );
}

function projectEdges(edges: Infer<typeof U.Edge>[]): Infer<typeof S.Edge>[] {
  return edges.map(({ source, target, labels, style }) => {
    return [
      source,
      target,
      labels[0].content,
      {
        [U.Alignments.Left]: 0,
        [U.Alignments.Centre]: 1,
        [U.Alignments.Right]: 2,
        [U.Alignments.Over]: 3,
      }[labels[0].alignment],
      {
        colour: projectColour(style.colour),
        level: style.level,
        style: projectEdgeStyle(style),
      },
      projectColour(labels[0].colour),
    ];
  });
}

export function project({
  vertices,
  edges,
}: Infer<typeof U.Diagram>): Infer<typeof S.Main> {
  return [
    0,
    vertices.length,
    ...projectVertices(vertices),
    ...projectEdges(edges),
  ];
}
