import { test, expect, describe } from 'vitest';
import { runProgram } from '.';

describe('runProgram', () => {
  test('bst', () => {
    const input = {
      registers: { a: 0n, b: 0n, c: 9n },
      program: [2n, 6n],
    };

    const state = runProgram(input);

    expect(state.registers.b).toEqual(1n);
  });

  test('out', () => {
    const input = {
      registers: { a: 10n, b: 0n, c: 0n },
      program: [5n, 0n, 5n, 1n, 5n, 4n],
    };

    const state = runProgram(input);

    expect(state.out.join(',')).toEqual('0,1,2');
  });

  test('adv + out + jnz', () => {
    const input = {
      registers: { a: 2024n, b: 0n, c: 0n },
      program: [0n, 1n, 5n, 4n, 3n, 0n],
    };

    const state = runProgram(input);

    expect(state.out.join(',')).toEqual('4,2,5,6,7,7,7,7,3,1,0');
    expect(state.registers.a).toEqual(0n);
  });

  test('bxl', () => {
    const input = {
      registers: { a: 0n, b: 29n, c: 0n },
      program: [1n, 7n],
    };

    const state = runProgram(input);

    expect(state.registers.b).toEqual(26n);
  });

  test('bxc', () => {
    const input = {
      registers: { a: 0n, b: 2024n, c: 43690n },
      program: [4n, 0n],
    };

    const state = runProgram(input);

    expect(state.registers.b).toEqual(44354n);
  });

  test('full test input', () => {
    const input = {
      registers: { a: 729n, b: 0n, c: 0n },
      program: [0n, 1n, 5n, 4n, 3n, 0n],
    };

    const state = runProgram(input);

    expect(state.out.join(',')).toEqual('4,6,3,5,6,3,5,2,1,0');
  });
});
