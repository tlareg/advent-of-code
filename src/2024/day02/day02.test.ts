import { test, expect } from 'vitest';
import { isSafeForPart2 } from '.';

test('isSafeForPart2', () => {
  expect(isSafeForPart2([1, 2, 3, 4])).toEqual(true);
  expect(isSafeForPart2([1, 2, 2, 2, 5, 6])).toEqual(false);
  expect(isSafeForPart2([1, 2, 1, 2, 5, 6])).toEqual(false);
  expect(isSafeForPart2([10, 13, 16, 19])).toEqual(true);
  expect(isSafeForPart2([10, 9, 13, 16])).toEqual(true);
});
