// https://adventofcode.com/2015/day/9

import { readFileSync } from 'fs'

type Edges = Record<string, Record<string, number>>

const LINE_REGEXP = /^(?<from>.+)\s+to\s+(?<to>.+)\s+=\s(?<distance>.+)$/

const solution = solve(parseInput())
console.log(solution)

function parseInput() {
  const input = readFileSync(`${__dirname}/input.txt`, 'utf-8')

  const edges: Edges = {}

  input.replace(/\r\n/g,'\n').split('\n').forEach((line) => {
    const { groups } = line.trim().match(LINE_REGEXP) ?? {}
    const { from, to, distance: distanceStr } = groups ?? {}
    const distance = parseInt(distanceStr ?? '', 10)

    if (!edges[from]) edges[from] = {}
    if (!edges[to]) edges[to] = {}

    edges[from][to] = distance
    edges[to][from] = distance
  })

  return edges
}

function solve(edges: Edges) {
  const places = Object.keys(edges)

  return permutations(places).reduce<{ min?: number; max?: number }>(
    (acc, variant) => {
      const variantDistance = variant.reduce((sum, place, index) => {
        if (index === 0) return sum
        return sum + edges[variant[index - 1]][place]
      }, 0)

      acc.min =
        acc.min === undefined
          ? variantDistance
          : Math.min(acc.min, variantDistance)

      acc.max =
        acc.max === undefined
          ? variantDistance
          : Math.max(acc.max, variantDistance)

      return acc
    },
    { min: undefined, max: undefined }
  )
}

function permutations<T>(xs: T[]): T[][] {
  if (!xs.length) return [[]]

  return xs.flatMap<T[]>((x, i): T[][] => {
    return permutations<T>([...xs.slice(0, i), ...xs.slice(i + 1)]).map(
      (vs) => [x, ...vs]
    )
  })
}
