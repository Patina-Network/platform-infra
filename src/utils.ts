import type { Split } from "type-fest";

export function split<A extends string, B extends string>(
  str: A,
  separator: B,
): Split<A, B> {
  return str.split(separator) as Split<A, B>;
}
