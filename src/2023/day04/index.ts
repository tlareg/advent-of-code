// https://adventofcode.com/2023/day/4

import { readFileSync } from 'fs';

const lineRegex =
  /^Card\s+(?<cardNumber>\d+):\s+(?<winningNums>.+)\|(?<cardNums>.+)$/;

type Card = {
  cardNumber: string;
  winningNumbers: string[];
  cardNumbers: string[];
};

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.split('\n');
}

function solve(inputLines: string[]) {
  const cards: Card[] = inputLines.map((line) => {
    const match = line.match(lineRegex);
    const { cardNumber, winningNums, cardNums } = match?.groups ?? {};
    const parseNumsStr = (str: string) => str.trim().split(' ').filter(Boolean);

    return {
      cardNumber,
      winningNumbers: parseNumsStr(winningNums),
      cardNumbers: parseNumsStr(cardNums),
    };
  });

  return {
    part1: solvePart1(cards),
    part2: solvePart2(cards),
  };
}

function solvePart1(cards: Card[]) {
  return cards.reduce((acc, card) => {
    const hits = checkHits(card);
    const cardWorth = hits === 0 ? 0 : Math.pow(2, hits - 1);
    return acc + cardWorth;
  }, 0);
}

function solvePart2(cards: Card[]) {
  const cardInstances = cards.reduce<Record<string, number>>((acc, card) => {
    acc[card.cardNumber] = 1;
    return acc;
  }, {});

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const hits = checkHits(card);
    for (let j = 1; j <= hits && i + j < cards.length; j++) {
      const nextCard = cards[i + j];
      cardInstances[nextCard.cardNumber] =
        (cardInstances[nextCard.cardNumber] ?? 0) +
        cardInstances[card.cardNumber];
    }
  }

  return Object.values(cardInstances).reduce((sum, x) => sum + x, 0);
}

function checkHits(card: Card) {
  return card.cardNumbers.reduce(
    (acc, cardNum) => (card.winningNumbers.includes(cardNum) ? acc + 1 : acc),
    0
  );
}
