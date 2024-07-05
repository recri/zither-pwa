export const rangeFromZeroToLast = (last: number) =>
  Array.from(Array(last + 1).keys());

export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));
