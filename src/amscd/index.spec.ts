import { create } from "superstruct";
import * as U from "../universal/schema";
// import * as S from "./schema";

import examples from "./examples.spec";
import { read, write } from ".";

describe.each(examples)("$name", ({ dsl, rep }) => {
  test("read", () => expect(read(dsl)).toMatchObject(rep));
  test("write", () => expect(write(create(rep, U.Diagram))).toEqual(dsl));
});
