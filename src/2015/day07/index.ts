// https://adventofcode.com/2015/day/7

import { readFileSync } from 'fs'

type Wires = Record<string, string | number>

const SIGNAL_REGEX = /^\d+$/
const MULTI_OPERATOR_REGEX =
  /^(?<paramA>.+)\s+(?<operator>AND|OR|LSHIFT|RSHIFT)\s+(?<paramB>.+)$/
const NOT_REGEX = /^NOT\s+(?<paramA>.+)$/

function parse16Bit(val: number) {
  const n = 65536
  return ((val % n) + n) % n
}

function parseVal(val: string | number) {
  return parse16Bit(typeof val === 'string' ? parseInt(val, 10) : val)
}

const solution = solve(parseInput())
console.log(solution)

function parseInput() {
  const input = readFileSync(`${__dirname}/input.txt`, 'utf-8')
  const wires: Wires = {}

  input.replace(/\r\n/g,'\n').split('\n').forEach((line) => {
    const [src, dst] = line.split('->').map((x) => x.trim())
    wires[dst] = src
  })

  return wires
}

function solve(wires: ReturnType<typeof parseInput>) {
  const part1 = get({ ...wires }, 'a')
  const part2 = get({ ...wires, b: part1 }, 'a')

  return { part1, part2 }
}

function get(wires: Wires, param: string) {
  let matchResult = param.match(SIGNAL_REGEX)

  if (matchResult) {
    return parseVal(matchResult[0])
  }

  if (typeof wires[param] === 'number') {
    return parseVal(wires[param])
  }

  const val = compute(wires, wires[param] as string)
  wires[param] = parseVal(val)

  return val
}

function compute(wires: Wires, src: string): number {
  let matchResult = src.match(SIGNAL_REGEX)

  if (matchResult) {
    return parseVal(matchResult[0])
  }

  matchResult = src.match(MULTI_OPERATOR_REGEX)
  if (matchResult) {
    const {
      groups: { paramA, operator, paramB },
    } = matchResult as unknown as {
      groups: { paramA: string; operator: string; paramB: string }
    }

    if (operator === 'AND') {
      return get(wires, paramA) & get(wires, paramB)
    }

    if (operator === 'OR') {
      return get(wires, paramA) | get(wires, paramB)
    }

    if (operator === 'LSHIFT') {
      return get(wires, paramA) << get(wires, paramB)
    }

    if (operator === 'RSHIFT') {
      return get(wires, paramA) >> get(wires, paramB)
    }
  }

  matchResult = src.match(NOT_REGEX)
  if (matchResult) {
    const {
      groups: { paramA },
    } = matchResult as unknown as { groups: { paramA: string } }

    return ~get(wires, paramA)
  }

  return get(wires, src)
}
