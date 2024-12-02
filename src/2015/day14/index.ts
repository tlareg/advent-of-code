// https://adventofcode.com/2015/day/14

import { readFileSync } from 'fs'

type DeerData = {
  speed: number
  flyDuration: number
  restDuration: number
}

const LINE_REGEXP =
  /^(?<name>.+)\s+can fly\s+(?<speed>\d+)\skm\/s.+\s+(?<flyDuration>\d+)\s+seconds.+\s+(?<restDuration>\d+)/

const input = readFileSync(`${__dirname}/input.txt`, 'utf-8')
const solution = solve(input)
console.log(solution)

function solve(input: string) {
  const raceDuration = 2503
  const data = parseInput(input)

  return {
    solution1: solveFirst(data, raceDuration),
    solution2: solveSecond(data, raceDuration),
  }
}

function solveFirst(data: Record<string, DeerData>, raceDuration: number) {
  const distances = getDistances(data, raceDuration)
  return Math.max(...Object.values(distances))
}

function solveSecond(data: Record<string, DeerData>, raceDuration: number) {
  let scores = Object.keys(data).reduce<Record<string, number>>(
    (acc, name) => ({ ...acc, [name]: 0 }),
    {}
  )

  let currentDistances: Record<string, number>
  let currentMaxDistance: number

  for (let i = 1; i < raceDuration; i++) {
    currentDistances = getDistances(data, i)
    currentMaxDistance = Math.max(...Object.values(currentDistances))
    scores = Object.entries(scores).reduce<Record<string, number>>((acc, [name, score]) => {
      if (currentDistances[name] === currentMaxDistance) {
        acc[name]++;
      }
      return acc
    }, scores)
  }

  return Math.max(...Object.values(scores))
}

function parseInput(input: string): Record<string, DeerData> {
  return input
    .replace(/\r\n/g,'\n').split('\n')
    .map((line) => {
      const {
        groups: { name, speed, flyDuration, restDuration },
      } = line.match(LINE_REGEXP) as unknown as {
        groups: {
          name: string
          speed: string
          flyDuration: string
          restDuration: string
        }
      }

      return {
        name,
        speed: parseInt(speed, 10),
        flyDuration: parseInt(flyDuration, 10),
        restDuration: parseInt(restDuration, 10),
      }
    })
    .reduce<Record<string, DeerData>>(
      (acc, { name, ...data }) => ({ ...acc, [name]: data }),
      {}
    )
}

function getDeerDistance(
  { speed, flyDuration, restDuration }: DeerData,
  raceDuration: number
) {
  const cycleDistance = flyDuration * speed
  const cycleDuration = flyDuration + restDuration

  const fullCycles = Math.floor(raceDuration / cycleDuration)
  const fullCyclesDistance = fullCycles * cycleDistance

  const remainingCycleTime = raceDuration % cycleDuration
  const remainingFlyTime = Math.min(remainingCycleTime, flyDuration)
  const remainingDistance = remainingFlyTime * speed

  return fullCyclesDistance + remainingDistance
}

function getDistances(data: Record<string, DeerData>, raceDuration: number) {
  return Object.entries(data).reduce<Record<string, number>>(
    (acc, [name, data]) => {
      acc[name] = getDeerDistance(data, raceDuration)
      return acc
    },
    {}
  )
}
