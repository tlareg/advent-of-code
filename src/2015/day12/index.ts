// https://adventofcode.com/2015/day/12

import { readFileSync } from 'fs'

const solution = solve()
console.log(solution)

function solve() {
  const input = readFileSync(`${__dirname}/input.txt`, 'utf-8')
  const json = JSON.parse(input)
  return { solution1: sumJSON(json), solution2: sumJSON(json, true) }
}

type JsonNode = string | number | object | Array<JsonNode>

function sumJSON(json: JsonNode, ignoreRed: boolean = false): number {
  if (typeof json === 'number') {
    return json
  }

  if (typeof json === 'string') {
    return 0
  }

  if (Array.isArray(json)) {
    return (json as JsonNode[]).reduce<number>(
      (sum, value) => sum + sumJSON(value, ignoreRed),
      0
    )
  }

  if (typeof json === 'object') {
    if (ignoreRed && Object.values(json).some(v => v === 'red')) {
      return 0;
    }
    return Object.values(json).reduce((sum, value) => sum + sumJSON(value, ignoreRed), 0)
  }

  return 0
}
