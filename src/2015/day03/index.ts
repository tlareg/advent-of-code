// https://adventofcode.com/2015/day/3

import { readFileSync } from 'fs'

function parseInput() {
  const input = readFileSync(`${__dirname}/input.txt`, 'utf-8')
  return input
}

const key = (x: number, y: number) => `${x},${y}`

function solve(input: ReturnType<typeof parseInput>) {
  let firstGrid = { [key(0, 0)]: 1 }
  let gridWithRoboSanta = { [key(0, 0)]: 2 }

  firstGrid = runSanta(firstGrid, input)
  const numberOfHouses = Object.entries(firstGrid).length

  const [evenInputs, oddInputs] = [...input].reduce(
    (acc, char, i) => {
      acc[i % 2].push(char)
      return acc
    },
    [[], []] as string[][]
  )
  gridWithRoboSanta = runSanta(gridWithRoboSanta, evenInputs.join(''))
  gridWithRoboSanta = runSanta(gridWithRoboSanta, oddInputs.join(''))
  const numberOfHousesWithRoboSanta = Object.entries(gridWithRoboSanta).length

  return { numberOfHouses, numberOfHousesWithRoboSanta }
}

function runSanta(
  grid: Record<string, number>,
  input: ReturnType<typeof parseInput>
) {
  let x = 0
  let y = 0
  let currentKey

  for (let dir of input) {
    if (dir === '^') y = y + 1
    if (dir === 'v') y = y - 1
    if (dir === '>') x = x + 1
    if (dir === '<') x = x - 1
    currentKey = key(x, y)
    grid[currentKey] = grid[currentKey] ? grid[currentKey] + 1 : 1
  }

  return grid
}

const solution = solve(parseInput())
console.log(solution)
