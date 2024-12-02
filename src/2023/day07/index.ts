// https://adventofcode.com/2023/day/7

import { readFileSync } from 'fs';

const CARDS = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  T: 10,
  '9': 9,
  '8': 8,
  '7': 7,
  '6': 6,
  '5': 5,
  '4': 4,
  '3': 3,
  '2': 2,
} as const;

const JOCKER_CARDS = { ...CARDS, J: 1 } as const;

type Card = keyof typeof CARDS;

const HAND_TYPES = {
  'Five of a kind': 7,
  'Four of a kind': 6,
  'Full house': 5,
  'Three of a kind': 4,
  'Two pair': 3,
  'One pair': 2,
  'High card': 1,
} as const;

type HandType = keyof typeof HAND_TYPES;

type CardsCountMap = { [card in string]: number };

type Hand = {
  bid: number;
  cards: string;
  cardsCountMap: CardsCountMap;
  type: HandType;
};

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(inputLines: string[]) {
  return {
    part1: getTotalWinnings(inputLines),
    part2: getTotalWinnings(inputLines, true),
  };
}

function getTotalWinnings(inputLines: string[], withJoker: boolean = false) {
  const hands = inputLines.map((line) => createHand(line, withJoker));
  const sortedHands = hands.sort((a, b) => compareHands(a, b, withJoker));
  return sortedHands
    .map((hand, i) => hand.bid * (i + 1))
    .reduce((sum, x) => sum + x, 0);
}

function createHand(inputLine: string, withJoker: boolean): Hand {
  const [cards, bidStr] = inputLine.split(' ');

  const bid = parseInt(bidStr, 10);
  const cardsCountMap = countHand(cards);
  const type = getHandType(cardsCountMap, withJoker);

  return {
    bid,
    cards,
    cardsCountMap,
    type,
  };
}

function countHand(cards: Hand['cards']): CardsCountMap {
  return cards.split('').reduce<CardsCountMap>((map, card) => {
    map[card] = (map[card] ?? 0) + 1;
    return map;
  }, {});
}

function getHandType(map: CardsCountMap, withJoker: boolean): HandType {
  const keys = Object.keys(map);
  const keysLength = keys.length;
  const counts = Object.values(map);
  const jockersCount = !withJoker ? 0 : map['J'] ?? 0;

  function assertJocker(counts: number[]) {
    if (jockersCount && !counts.includes(jockersCount)) {
      throw `Unhandled jocker, ${JSON.stringify(map, null, 2)}`;
    }
  }

  if (keysLength === 1) {
    assertJocker([5]);
    return 'Five of a kind';
  }

  if (keysLength === 2) {
    assertJocker([1, 2, 3, 4]);
    if (jockersCount) {
      return 'Five of a kind';
    }
    if (counts.includes(4)) {
      return 'Four of a kind';
    }
    return 'Full house';
  }

  if (counts.includes(3)) {
    assertJocker([1, 3]);
    if (jockersCount) {
      return 'Four of a kind';
    }
    return 'Three of a kind';
  }

  if (counts.includes(2)) {
    assertJocker([1, 2]);

    const numOfPairs = counts.reduce(
      (numOfPairs, count) => (count === 2 ? numOfPairs + 1 : numOfPairs),
      0
    );

    if (numOfPairs > 1) {
      if (jockersCount === 1) {
        return 'Full house';
      }
      if (jockersCount === 2) {
        return 'Four of a kind';
      }
      return 'Two pair';
    }
    if (jockersCount) {
      return 'Three of a kind';
    }
    return 'One pair';
  }

  if (jockersCount) {
    assertJocker([1]);
    return 'One pair';
  }

  return 'High card';
}

function compareHands(handA: Hand, handB: Hand, withJoker: boolean) {
  if (handA.type === handB.type) {
    return compareUsingSecondOrderingRule(handA.cards, handB.cards, withJoker);
  }
  return HAND_TYPES[handA.type] - HAND_TYPES[handB.type];
}

function compareUsingSecondOrderingRule(
  cardsA: string,
  cardsB: string,
  withJoker: boolean = false
) {
  const values = withJoker ? JOCKER_CARDS : CARDS;
  for (let i = 0; i < cardsA.length; i++) {
    const a = cardsA[i] as Card;
    const b = cardsB[i] as Card;
    if (values[a] === values[b]) {
      continue;
    }
    return values[a] - values[b];
  }
  return 0;
}
