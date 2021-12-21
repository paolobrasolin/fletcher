import {
  any,
  array,
  Context,
  defaulted,
  enums,
  integer,
  literal,
  max,
  min,
  number,
  object,
  optional,
  partial,
  refine,
  size,
  string,
  Struct,
  tuple,
} from "superstruct";

//=[ Monkeypatching ]===========================================================

// source: https://github.com/ianstormtaylor/superstruct/pull/966
// solves: https://github.com/ianstormtaylor/superstruct/issues/830
// TODO: remove when PR is merged
// NOTE: this is needed only by the bounded vertices count int MainItem
function dynamic<T>(
  fn: (value: unknown, ctx: Context) => Struct<T, any>,
): Struct<T, null> {
  return new Struct({
    type: "dynamic",
    schema: null,
    *entries(value, ctx) {
      const struct = fn(value, ctx);
      yield* struct.entries(value, ctx);
    },
    validator(value, ctx) {
      const struct = fn(value, ctx);
      return struct.validator(value, ctx);
    },
    coercer(value, ctx) {
      const struct = fn(value, ctx);
      return struct.coercer(value, ctx);
    },
    refiner(value, ctx) {
      const struct = fn(value, ctx);
      return struct.refiner(value, ctx);
    },
  });
}

//=[ Basic ]====================================================================

export const Alignment = max(min(integer(), 0), 3);
export const Angle = max(min(integer(), 0), 360);
export const Factor = max(min(number(), 0), 1);
export const Level = max(min(integer(), 1), 3);
export const Natural = min(integer(), 0);
export const Percent = max(min(integer(), 0), 100);
export const Version = literal(0);
export const Label = defaulted(string(), "");

//=[ Composite ]================================================================

export const Colour = defaulted(
  tuple([Angle, Percent, Percent, defaulted(optional(Factor), 1)]),
  [0, 0, 0, 1],
);

export const Shorten = refine(
  object({
    source: defaulted(optional(Percent), 0),
    target: defaulted(optional(Percent), 0),
  }),
  "Shorten",
  ({ source = 0, target = 0 }) => source + target <= 100,
); // TODO: decent error message

//=[ Edge ]=====================================================================

export const EdgeStyleBody = partial(
  object({
    level: Level, // TODO: mark as deprecated
    name: defaulted(
      enums(["cell", "squiggly", "barred", "dashed", "dotted", "none"]),
      "cell",
    ),
  }),
);

export const EdgeStyleHead = partial(
  object({
    name: defaulted(
      enums(["arrowhead", "none", "epi", "harpoon"]),
      "arrowhead",
    ),
    side: enums(["top", "bottom"]), // NOTE: used only by harpoon
  }),
);

export const EdgeStyleTail = partial(
  object({
    name: defaulted(
      enums(["none", "maps to", "mono", "hook", "arrowhead"]),
      "none",
    ),
    side: enums(["top", "bottom"]), // NOTE: used only by hook
  }),
);

export const EdgeStyle = partial(
  object({
    // NOTE: tail/body/head are used only when name is arrow
    body: defaulted(EdgeStyleBody, {}),
    head: defaulted(EdgeStyleHead, {}),
    name: defaulted(
      enums(["arrow", "adjunction", "corner", "corner-inverse"]),
      "arrow",
    ),
    tail: defaulted(EdgeStyleTail, {}),
  }),
);

export const LabelPosition = defaulted(Percent, 50);

export const EdgeOptions = partial(
  object({
    colour: Colour,
    curve: defaulted(integer(), 0),
    label_position: LabelPosition,
    length: Percent, // TODO: mark as deprecated
    level: defaulted(Level, 1),
    offset: defaulted(integer(), 0),
    shorten: defaulted(Shorten, {}),
    style: defaulted(EdgeStyle, {}),
  }),
);

export const Edge = edge();
export function edge(self = -1, max = Infinity) {
  return refine(
    tuple([
      refine(Natural, "Source", (n) => n != self && n <= max),
      refine(Natural, "Target", (n) => n != self && n <= max),
      optional(Label),
      defaulted(optional(Alignment), 0),
      defaulted(optional(EdgeOptions), {}),
      optional(Colour),
    ]),
    "Edge",
    ([source, target]) => source != target,
  );
}

//=[ Vertex ]===================================================================

export const Vertex = tuple([
  integer(),
  integer(),
  optional(Label),
  optional(Colour),
]);

//=[ Main ]=====================================================================

const MainItem = dynamic((_, { path: [index], branch: [main] }) => {
  if (index == 0) return Version;
  if (index == 1) return max(Natural, main.length - 2);
  if (index - 1 <= main[1]) return Vertex;
  if (index - 1 > main[1]) return edge(index - 2, main.length - 3);
  return any();
});

export const Main = size(array(MainItem), 3, Infinity);
