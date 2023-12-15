// https://adventofcode.com/2023/day/x

import { readFileSync } from 'fs';

type SequenceData = {
  label: string;
  operation: '-' | '=';
  focalLength: string;
};

type Box = Map<string, number>;

const solution = solve(readInput(`${__dirname}/input.txt`));
console.log(solution);

function readInput(inputFilePath: string) {
  return readFileSync(inputFilePath, 'utf-8')
    .replace(/\r\n/g, '')
    .replace(/\n/g, '')
    .split(',');
}

function solve(sequences: string[]) {
  return {
    part1: solvePart1(sequences),
    part2: solvePart2(sequences),
  };
}

function solvePart1(sequences: string[]) {
  return sequences.reduce((sum, s) => sum + computeHash(s), 0);
}

function computeHash(str: string) {
  return str
    .split('')
    .reduce((value, char) => ((value + char.charCodeAt(0)) * 17) % 256, 0);
}

function solvePart2(sequences: string[]) {
  return computeFocusingPower(setupLenses(sequences));
}

function setupLenses(sequences: string[]) {
  return sequences.reduce((boxes, sequence) => {
    const sequenceData = parseSequence(sequence);
    const box = getBox(boxes, computeHash(sequenceData.label));
    updateBox(box, sequenceData);
    return boxes;
  }, []);
}

function parseSequence(sequence: string): SequenceData {
  return sequence.match(/(?<label>[a-z]+)(?<operation>-|=)(?<focalLength>\d)*/)!
    .groups as SequenceData;
}

function getBox(boxes: Box[], boxId: number) {
  let box = boxes[boxId];
  if (!box) {
    box = new Map<string, number>();
    boxes[boxId] = box;
  }
  return box;
}

function updateBox(
  box: Map<string, number>,
  { label, operation, focalLength }: SequenceData
) {
  if (operation === '=') {
    box.set(label, parseInt(focalLength, 10));
  } else {
    box.delete(label);
  }
}

function computeFocusingPower(boxes: Box[]) {
  return boxes.reduce(
    (focusingPower, box, boxId) =>
      focusingPower + computeBoxFocusingPower(box, boxId),
    0
  );
}

function computeBoxFocusingPower(box: Box, boxId: number) {
  return [...box].reduce(
    (focusingPower, [_label, focalLength], slotId) =>
      focusingPower + (boxId + 1) * (slotId + 1) * focalLength,
    0
  );
}
