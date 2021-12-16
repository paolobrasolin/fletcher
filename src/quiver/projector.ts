import { Infer } from "superstruct";
import * as S from "./schema";
import * as U from "../universal/schema";

export function project(input: Infer<typeof U.Diagram>): Infer<typeof S.Main> {
  throw Error("TODO");
}
