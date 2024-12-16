// https://adventofcode.com/2020/day/4

import { readFileSync } from 'fs';

type Doc = Record<string, string>;

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(inputLines: string[]) {
  const docs = parseInput(inputLines);

  return {
    part1: docs.filter((doc) => isValid(doc)).length,
    part2: docs.filter((doc) => isValidForPart2(doc)).length,
  };
}

function parseInput(inputLines: string[]): Doc[] {
  let docs: Doc[] = [];
  let currentDoc: Doc = {};

  for (const line of inputLines) {
    if (line === '') {
      docs.push(currentDoc);
      currentDoc = {};
    }

    line.split(' ').map((item) => {
      const [label, value] = item.split(':');
      currentDoc[label] = value;
    });
  }

  if (Object.keys(currentDoc).length) {
    docs.push(currentDoc);
  }

  return docs;
}

function isValid(doc: Doc): boolean {
  const labels = Object.keys(doc);
  const requiredFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];
  return requiredFields.reduce(
    (acc, name) => acc && labels.includes(name),
    true
  );
}

function isValidForPart2(doc: Doc): boolean {
  if (!isValid(doc)) {
    return false;
  }

  const validationRules = getValidationRules();

  return Object.entries(doc).reduce((acc, [key, value]) => {
    const validate = validationRules[key] || ((_v: string) => true);
    return acc && validate(value);
  }, true);
}

function getValidationRules(): Record<string, (value: string) => boolean> {
  return {
    byr: (value: string) => isValidYear(value, 1920, 2002),
    iyr: (value: string) => isValidYear(value, 2010, 2020),
    eyr: (value: string) => isValidYear(value, 2020, 2030),
    hgt: (value: string) => isValidHeight(value),
    hcl: (value: string) => isValidHairColor(value),
    ecl: (value: string) => isValidEyeColor(value),
    pid: (value: string) => isPidValid(value),
  };
}

function isValidYear(value: string, min: number, max: number): boolean {
  if (!value || !value.match(/^\d{4}$/)) {
    return false;
  }

  const n = parseInt(value, 10);
  if (n < min || n > max) {
    return false;
  }

  return true;
}

function isValidHeight(value: string): boolean {
  if (!value) {
    return false;
  }

  const match = value.match(/(?<h>\d+)(?<unit>cm|in)/);
  if (!match) {
    return false;
  }

  const { h, unit } = match.groups as { h: string; unit: string };

  const hNum = parseInt(h, 10);
  if (unit === 'cm' && (hNum < 150 || hNum > 193)) {
    return false;
  }

  if (unit === 'in' && (hNum < 59 || hNum > 76)) {
    return false;
  }

  return true;
}

function isValidHairColor(value: string): boolean {
  return !!value && !!value.match(/^#[0-9a-f]{6}$/);
}

function isValidEyeColor(value: string): boolean {
  return (
    !!value && ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(value)
  );
}

function isPidValid(value: string): boolean {
  return !!value && !!value.match(/^\d{9}$/);
}
