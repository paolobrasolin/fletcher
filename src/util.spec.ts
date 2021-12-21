import { rgbToHsl, hslToRgb } from "./util";

fdescribe.each`
  r    | g    | b    | h      | sl     | l
  ${0} | ${0} | ${0} | ${0}   | ${0.0} | ${0.0}
  ${1} | ${0} | ${0} | ${0}   | ${1.0} | ${0.5}
  ${0} | ${1} | ${0} | ${120} | ${1.0} | ${0.5}
  ${0} | ${0} | ${1} | ${240} | ${1.0} | ${0.5}
  ${1} | ${1} | ${1} | ${0}   | ${0.0} | ${1.0}
`("RGB [$r,$g,$b] ~ HSL [$h,$sl,$l]", ({ r, g, b, h, sl, l }) => {
  test("rgbToHsl", () => expect(rgbToHsl([r, g, b])).toEqual([h, sl, l]));
  test("hslToRgb", () => expect(hslToRgb([h, sl, l])).toEqual([r, g, b]));
});
