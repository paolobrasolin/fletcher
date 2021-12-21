export function rgbToHsl([r, g, b]: [number, number, number]): [
  number,
  number,
  number,
] {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const v = max;
  const c = max - min;
  const l = (max + min) / 2;
  let h;
  if (c == 0) h = undefined;
  else if (v == r) h = 60 * (0 + (g - b) / c);
  else if (v == g) h = 60 * (2 + (b - r) / c);
  else if (v == b) h = 60 * (4 + (r - g) / c);
  // const sv = v == 0 ? 0 : c / v;
  const sl = [0, 1].includes(l) ? 0 : (v - l) / Math.min(l, 1 - l);
  return [h || 0, sl, l];
}

export function hslToRgb([h, s, l]: [number, number, number]): [
  number,
  number,
  number,
] {
  const b = s * Math.min(l, 1 - l);
  const k = (n: number) => (n + h / 30) % 12;
  const f = (n: number) =>
    l - b * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return [f(0), f(8), f(4)];
}
