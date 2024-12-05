// https://adventofcode.com/2024/day/5

import { readFileSync } from 'fs';

type Rule = [string, string];
type Update = string[];

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(inputLines: string[]) {
  const { rules, updates } = parseInput(inputLines);

  const { correctUpdates, incorrectUpdates } = updates.reduce<{
    correctUpdates: Update[];
    incorrectUpdates: Update[];
  }>(
    (acc, update) => {
      if (isUpdateCorrect(update, rules)) {
        acc.correctUpdates.push(update);
      } else {
        acc.incorrectUpdates.push(update);
      }
      return acc;
    },
    { correctUpdates: [], incorrectUpdates: [] }
  );

  const correctedUpdates = incorrectUpdates.map((update) =>
    correctUpdate(update, rules)
  );

  return {
    part1: sumMiddleElements(correctUpdates),
    part2: sumMiddleElements(correctedUpdates)
  };
}

function parseInput(inputLines: string[]): {
  rules: Rule[];
  updates: Update[];
} {
  const rules: Rule[] = [];
  const updates: Update[] = [];

  for (let i = 0; i < inputLines.length; i++) {
    const line = inputLines[i];

    if (line.includes('|')) {
      rules.push(line.split('|') as Rule);
      continue;
    }

    if (line.includes(',')) {
      updates.push(line.split(','));
    }
  }

  return { rules, updates };
}

function isUpdateCorrect(update: Update, rules: Rule[]): boolean {
  return rules.every((rule) => isRuleSatisfied(update, rule));
}

function isRuleSatisfied(update: Update, rule: Rule): boolean {
  const [firstPage, secondPage] = rule;
  const firstPageIdx = update.indexOf(firstPage);
  const secondPageIdx = update.indexOf(secondPage);

  if (firstPageIdx === -1 || secondPageIdx === -1) {
    return true;
  }

  return firstPageIdx < secondPageIdx;
}

function getMiddle<T>(array: T[]): T {
  return array[Math.floor(array.length / 2)];
}

function sumMiddleElements(updates: Update[]) {
  return updates
    .map((update) => getMiddle(update))
    .reduce((sum, n) => sum + parseInt(n, 10), 0);
}

function correctUpdate(update: Update, rules: Rule[]) {
  let isCorrect = false;

  while (!isCorrect) {
    isCorrect = true;

    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];

      const [firstPage, secondPage] = rule;
      const firstPageIdx = update.indexOf(firstPage);
      const secondPageIdx = update.indexOf(secondPage);

      if (firstPageIdx === -1 || secondPageIdx === -1) {
        continue;
      }

      if (firstPageIdx < secondPageIdx) {
        continue;
      }

      isCorrect = false;
      swapElements(update, firstPageIdx, secondPageIdx);
    }
  }

  return update;
}

function swapElements<T>(array: T[], idxA: number, idxB: number) {
  [array[idxA], array[idxB]] = [array[idxB], array[idxA]];
}
