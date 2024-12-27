// https://adventofcode.com/2024/day/24

import { readFileSync } from 'fs';

type Operator = 'AND' | 'OR' | 'XOR';

type Gate = {
  a: string;
  b: string;
  operator: Operator;
  result: string;
  isComputed: boolean;
};

type Wires = Record<string, number>;

type State = {
  wires: Wires;
  gates: Gate[];
};

const OPERATIONS = {
  AND: (a: number, b: number) => a & b,
  OR: (a: number, b: number) => a | b,
  XOR: (a: number, b: number) => a ^ b,
} as const;

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(inputLines: string[]) {
  let state = parseInput(inputLines);

  computeGates(state);

  const output = getOutputNumber(state);

  return {
    part1: output,
  };
}

function parseInput(inputLines: string[]): State {
  const wires: Wires = {};
  const gates: Gate[] = [];

  for (const line of inputLines) {
    let match = line.match(/^(?<name>\w+): (?<value>\d)+$/);
    if (match && match.groups) {
      const { name, value } = match.groups;
      wires[name] = Number(value);
      continue;
    }

    match = line.match(
      /^(?<a>\w+) (?<operator>AND|OR|XOR) (?<b>\w+) -> (?<result>\w+)$/
    );
    if (match && match.groups) {
      const { a, b, operator, result } = match.groups;
      gates.push({
        a,
        b,
        operator: operator as Operator,
        result,
        isComputed: false,
      });
    }
  }

  return {
    wires,
    gates,
  };
}

function computeGates(state: State) {
  while (state.gates.some((g) => !g.isComputed)) {
    for (const gate of state.gates) {
      computeGate(state, gate);
    }
  }
}

function computeGate(state: State, gate: Gate) {
  const { a, b, operator, result } = gate;
  if (state.wires[a] === undefined || state.wires[b] === undefined) {
    return;
  }

  state.wires[result] = OPERATIONS[operator](state.wires[a], state.wires[b]);
  gate.isComputed = true;
}

function getOutputNumber(state: State): number {
  const sortedZKeys = Object.keys(state.wires)
    .filter((key) => key[0] === 'z')
    .sort((a, b) => {
      const numA = parseInt(a.substring(1), 10);
      const numB = parseInt(b.substring(1), 10);
      return numB - numA;
    });

  const binaryString = sortedZKeys.reduce(
    (binaryString, zKey) => `${binaryString}${state.wires[zKey]}`,
    ''
  );

  return parseInt(binaryString, 2);
}
