import { test, expect, describe } from 'vitest';
import { countPossibleWays } from '.';

describe('countPossibleWays', () => {
  const possibleTowels = ['r', 'wr', 'b', 'g', 'bwu', 'rb', 'gb', 'br'];

  test('brwrr', () => {
    expect(countPossibleWays('brwrr', possibleTowels)).toEqual(2);
  });

  test('bggr', () => {
    expect(countPossibleWays('bggr', possibleTowels)).toEqual(1);
  });

  test('br', () => {
    expect(countPossibleWays('br', possibleTowels)).toEqual(2);
  });

  test('bbr', () => {
    expect(countPossibleWays('bbr', possibleTowels)).toEqual(2);
  });

  test('gbbr', () => {
    expect(countPossibleWays('gbbr', possibleTowels)).toEqual(4);
  });

  test('rrbgbr', () => {
    expect(countPossibleWays('rrbgbr', possibleTowels)).toEqual(6);
  });

  test('ubwu', () => {
    expect(countPossibleWays('ubwu', possibleTowels)).toEqual(0);
  });

  test('bwurrg', () => {
    expect(countPossibleWays('bwurrg', possibleTowels)).toEqual(1);
  });

  test('brgr', () => {
    expect(countPossibleWays('brgr', possibleTowels)).toEqual(2);
  });

  test('bbrgwb', () => {
    expect(countPossibleWays('bbrgwb', possibleTowels)).toEqual(0);
  });
});
