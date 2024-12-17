// https://adventofcode.com/2024/day/17

import { readFileSync } from 'fs';

export type State = {
  registers: {
    a: bigint;
    b: bigint;
    c: bigint;
  };
  program: bigint[];
  pointer: number;
  out: bigint[];
};

type Input = Pick<State, 'registers' | 'program'>;

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(inputLines: string[]) {
  const inputData = parseInput(inputLines);
  return {
    part1: solvePart1(inputData),
    // part2: solvePart2BruteForce(inputData),
  };
}

function solvePart1(inputData: Input): string {
  const state = runProgram(inputData);
  return state.out.join(',');
}

/**
 * unfortunately real input is to large for this brute force
 */
function solvePart2BruteForce(inputData: Input): bigint {
  let currentState: State = {
    registers: { ...inputData.registers },
    program: [...inputData.program],
    pointer: 0,
    out: [],
  };

  let prevState: State;

  let a = 0n;

  do {
    a++;
    prevState = {
      registers: {
        ...currentState.registers,
        a,
      },
      program: currentState.program,
      pointer: 0,
      out: [],
    };
    currentState = runProgram(prevState);
  } while (!isCopyOfItself(currentState, prevState));

  return a;
}

function isCopyOfItself(currentState: State, prevState: State) {
  return (
    currentState.out.join(',') === prevState.program.join(',') &&
    currentState.registers.b === prevState.registers.b &&
    currentState.registers.c === prevState.registers.c
  );
}

function parseInput(inputLines: string[]): Input {
  let a = 0n;
  let b = 0n;
  let c = 0n;
  let program: bigint[] = [];

  const readRegister = (line: string) =>
    BigInt(parseInt(line.split(':')[1], 10));

  for (const line of inputLines) {
    if (line.startsWith('Register A')) {
      a = readRegister(line);
      continue;
    }

    if (line.startsWith('Register B')) {
      b = readRegister(line);
      continue;
    }

    if (line.startsWith('Register C')) {
      c = readRegister(line);
      continue;
    }

    if (line.startsWith('Program')) {
      program = line
        .split(':')[1]
        .split(',')
        .map((n) => BigInt(parseInt(n, 10)));
      continue;
    }
  }

  return {
    registers: {
      a,
      b,
      c,
    },
    program,
  };
}

export function runProgram(
  inputData: Pick<State, 'registers' | 'program'>
): State {
  const state: State = {
    registers: { ...inputData.registers },
    program: [...inputData.program],
    pointer: 0,
    out: [],
  };

  while (state.pointer < state.program.length) {
    const opcode = state.program[state.pointer];
    const operand = state.program[state.pointer + 1];
    runInstruction(state, opcode, operand);
    state.pointer += 2;
  }

  return state;
}

function runInstruction(state: State, opcode: bigint, operand: bigint) {
  if (opcode === 0n) adv(state, operand);
  if (opcode === 1n) bxl(state, operand);
  if (opcode === 2n) bst(state, operand);
  if (opcode === 3n) jnz(state, operand);
  if (opcode === 4n) bxc(state, operand);
  if (opcode === 5n) out(state, operand);
  if (opcode === 6n) bdv(state, operand);
  if (opcode === 7n) cdv(state, operand);
}

function combo({ a, b, c }: State['registers'], operand: bigint): bigint {
  if ([0n, 1n, 2n, 3n].includes(operand)) return operand;
  if (operand === 4n) return a;
  if (operand === 5n) return b;
  if (operand === 6n) return c;
  if (operand === 7n) throw 'combo operand 7 - program invalid';
  throw 'invalid operand';
}

function bxl(state: State, operand: bigint) {
  state.registers.b = state.registers.b ^ operand;
}

function bst(state: State, operand: bigint) {
  state.registers.b = combo(state.registers, operand) % 8n;
}

function jnz(state: State, operand: bigint) {
  if (state.registers.a === 0n) {
    return;
  }
  state.pointer = Number(operand) - 2;
}

function bxc(state: State, _operand: bigint) {
  state.registers.b = state.registers.b ^ state.registers.c;
}

function out(state: State, operand: bigint) {
  state.out.push(combo(state.registers, operand) % 8n);
}

function adv(state: State, operand: bigint) {
  dv(state, operand, 'a');
}

function bdv(state: State, operand: bigint) {
  dv(state, operand, 'b');
}

function cdv(state: State, operand: bigint) {
  dv(state, operand, 'c');
}

function dv(
  state: State,
  operand: bigint,
  targetRegister: keyof State['registers']
) {
  // state.registers.a / 2n ** operandValue;
  state.registers[targetRegister] =
    state.registers.a >> combo(state.registers, operand);
}
