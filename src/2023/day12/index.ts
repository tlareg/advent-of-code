// https://adventofcode.com/2023/day/12

import { readFileSync } from 'fs';
import { memoize, sum } from '../../lib';

// stolen from Reddit and rewritten my way with my comments, but I learned a lot
// how to approach such problems in the future
const getPossibleArrangements = memoize(
  (symbols: string, groupsOrder: number[]): number => {
    if (symbols.length === 0) {
      // no symbols, but also no groups, so 1 possible arrangement
      if (groupsOrder.length === 0) {
        return 1;
      }

      // no symbols but there are some groups, so 0 possible arrangements
      return 0;
    }

    if (groupsOrder.length === 0) {
      const hasGroupInSymbols = symbols.split('').some((s) => s === '#');

      // no groups and
      // A) groups in symbols present - 0 possible arrangements
      // B) no symbols - 1 possible arrangement
      return hasGroupInSymbols ? 0 : 1;
    }

    const neededGapsCount = groupsOrder.length - 1;
    const minSymbolsLength =
      groupsOrder.reduce((a, b) => a + b) + neededGapsCount;
    if (symbols.length < minSymbolsLength) {
      // symbols not long enough - 0 possible arrangements
      return 0;
    }

    if (symbols[0] === '.') {
      // we can ommit "." symbol at the beginning
      return getPossibleArrangements(symbols.slice(1), groupsOrder);
    }

    if (symbols[0] === '#') {
      const [currentGroup, ...remainingGroups] = groupsOrder;

      for (let i = 0; i < currentGroup; i++) {
        // there needs to be exactly n "#" symbols, so if there is "." symbol ->
        // 0 possible arrangements
        if (symbols[i] === '.') {
          return 0;
        }
      }

      // if there is no gap after group -> 0 possible arrangements
      if (symbols[currentGroup] === '#') {
        return 0;
      }

      // current group is fine, so we can check further - cut group + gap space
      // from symbols, and check for remainingGroups
      return getPossibleArrangements(
        symbols.slice(currentGroup + 1),
        remainingGroups
      );
    }

    // first symbol is "?" so we need to check when it is "#" and "."
    return (
      getPossibleArrangements('#' + symbols.slice(1), groupsOrder) +
      getPossibleArrangements('.' + symbols.slice(1), groupsOrder)
    );
  }
);

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(inputLines: string[]) {
  const linesData = inputLines.map((line) => {
    const [symbols, groupsOrderStr] = line.split(' ');
    const groupsOrder = groupsOrderStr.split(',').map((n) => parseInt(n, 10));
    return [symbols, groupsOrder] as const;
  });

  const part1Counts = linesData.map((lineData) =>
    getPossibleArrangements(...lineData)
  );

  const part2Counts = linesData.map(([symbols, groupsOrder]) => {
    const symbolsX5 = Array(6).join(`${symbols}?`).slice(0, -1);
    const groupsOrderX5 = Array(5).fill(groupsOrder).flat();

    return getPossibleArrangements(symbolsX5, groupsOrderX5);
  });

  return {
    part1: sum(part1Counts),
    part2: sum(part2Counts),
  };
}
