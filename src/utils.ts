import type { Split } from "type-fest";

import _ from "lodash";

export function split<A extends string, B extends string>(
  str: A,
  separator: B,
): Split<A, B> {
  return str.split(separator) as Split<A, B>;
}

/**
 * copy `a` into new object, apply `b` over it
 *
 * if any array objects are encountered, they will be concatenated together.
 */
export function mergeWithConcatArrays<TA, TB>(a: TA, b: TB) {
  return _.mergeWith({}, a, b, (objValue, srcValue) => {
    if (_.isArray(objValue)) {
      return objValue.concat(srcValue);
    }
  });
}
