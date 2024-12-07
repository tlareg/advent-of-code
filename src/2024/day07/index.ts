// https://adventofcode.com/2024/day/07

import { readFileSync } from 'fs';
import { memoize } from '../../lib';

type InputData = Array<{
  value: number;
  numbers: number[];
}>;

type Operator = '*' | '+' | '||';

const generatePossibleOperatorSets = memoize(
  (existingOperators: Operator[], n: number): Operator[][] => {
    if (n <= 0) return [];

    const results: Operator[][] = [];

    function backtrack(path: Operator[]) {
      if (path.length === n) {
        results.push([...path]);
        return;
      }

      for (const char of existingOperators) {
        path.push(char);
        backtrack(path);
        path.pop();
      }
    }

    backtrack([]);

    return results;
  }
);

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(inputLines: string[]) {
  const inputData = inputLines.map((line) => {
    const [value, numbers] = line.split(':');
    return {
      value: Number(value),
      numbers: numbers.split(' ').filter(Boolean).map(Number),
    };
  });

  return {
    part1: solveForOperators(inputData, ['+', '*']),
    part2: solveForOperators(inputData, ['+', '*', '||']),
  };
}

function solveForOperators(
  inputData: InputData,
  existingOperators: Operator[]
) {
  return inputData
    .filter(({ value, numbers }) =>
      canBeTrueEquation(value, numbers, existingOperators)
    )
    .reduce((sum, { value }) => sum + value, 0);
}

function canBeTrueEquation(
  value: number,
  numbers: number[],
  existingOperators: Operator[]
): boolean {
  const operatorSets = generatePossibleOperatorSets(
    existingOperators,
    numbers.length - 1
  );

  for (let i = 0; i < operatorSets.length; i++) {
    const valueForOperators = computeValueForOperators(
      numbers,
      operatorSets[i],
      value
    );
    if (valueForOperators === value) {
      return true;
    }
  }

  return false;
}

function computeValueForOperators(
  numbers: number[],
  operators: Operator[],
  desiredValue: number
): number | boolean {
  let acc = numbers[0];

  for (let i = 1; i < numbers.length; i++) {
    acc = doOperation(operators[i - 1], acc, numbers[i]);
    if (acc > desiredValue) {
      return false;
    }
  }

  return acc;
}

function doOperation(operator: Operator, a: number, b: number): number {
  if (operator === '+') return a + b;
  if (operator === '*') return a * b;
  if (operator === '||') return Number(`${a}${b}`);
  throw 'unknown operator';
}
