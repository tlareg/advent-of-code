import { readFileSync } from 'fs'

function parseInput() {
  const input = readFileSync(`${__dirname}/input.txt`, 'utf-8')
  return input.split('')
}

function solve(input: string[]) {
  let basementInstructionPosition: number | null = null

  const floorNumber = input.reduce((acc, char, index) => {
    const newAcc = char === '(' ? acc + 1 : acc - 1
    if (basementInstructionPosition === null && newAcc === -1) {
      basementInstructionPosition = index + 1
    }
    return newAcc
  }, 0)

  return { floorNumber, basementInstructionPosition }
}

const solution = solve(parseInput())
console.log(solution)
