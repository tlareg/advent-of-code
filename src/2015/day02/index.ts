// https://adventofcode.com/2015/day/2

import { readFileSync } from 'fs'

function parseInput() {
  const input = readFileSync(`${__dirname}/input.txt`, 'utf-8')
  return input
    .replace(/\r\n/g,'\n').split('\n')
    .map(
      (sizeString) =>
        sizeString.split('x').map(Number) as [number, number, number]
    )
}

function solve(input: ReturnType<typeof parseInput>) {
  const allPaper = input.reduce((acc, sizes) => acc + paperForGift(sizes), 0)
  const allRibbon = input.reduce((acc, sizes) => acc + ribbonForGift(sizes), 0)
  return { allPaper, allRibbon }
}

function paperForGift([l, w, h]: [number, number, number]) {
  const rectangles = [l * w, w * h, h * l]
  const base = rectangles.reduce((sum, rectangle) => sum + 2 * rectangle, 0)
  const smallestRectangle = Math.min(...rectangles)
  return base + smallestRectangle
}

function ribbonForGift(sizes: [number, number, number]) {
  const maxSize = Math.max(...sizes)
  const smallSizes = [...sizes];
  smallSizes.splice(sizes.indexOf(maxSize), 1);
  const [a, b] = smallSizes;

  const bow = sizes.reduce((acc, n) => acc * n, 1)

  return 2 * a + 2 * b + bow
}

const solution = solve(parseInput())
console.log(solution)
