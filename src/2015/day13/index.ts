// https://adventofcode.com/2015/day/13

import { readFileSync } from 'fs'

type Rule = {
  name: string
  dir: 'gain' | 'lose'
  units: number
  nextName: string
}

type PersonName = string
type Person = Record<PersonName, number>
type People = Record<PersonName, Person>
type Setting = PersonName[]

const LINE_REGEXP =
  /(?<name>.+)\s+.+\s+(?<dir>.+)\s+(?<units>\d+)\s+.+to\s+(?<nextName>.+)\./

const input = readFileSync(`${__dirname}/input.txt`, 'utf-8')
const solution = solve(input)
console.log(solution)

function solve(input: string) {
  const people = parseInput(input)

  const updatedPeople = Object.entries(people).reduce<People>(
    (acc, [personName, value]) => {
      acc[personName] = { ...value, I: 0 }
      return acc
    },
    {}
  )

  const peopleAndI = {
    ...updatedPeople,
    I: Object.keys(updatedPeople).reduce<Person>((acc, name) => {
      acc[name] = 0
      return acc
    }, {}),
  }

  return {
    solution1: findBestSettingSum(people),
    solution2: findBestSettingSum(peopleAndI),
  }
}

function parseInput(input: string): People {
  const rules: Rule[] = input.replace(/\r\n/g,'\n').split('\n').map((line) => {
    const { groups } = line.match(LINE_REGEXP) || {}
    return { ...groups, units: parseInt(groups?.units ?? '', 10) } as Rule
  })

  return rules.reduce<People>((acc, { name, dir, units, nextName }) => {
    if (!acc[name]) {
      acc[name] = {}
    }
    acc[name][nextName] = dir === 'gain' ? units : -units
    return acc
  }, {})
}

function findBestSettingSum(people: People) {
  const settingScores = permutations(Object.keys(people)).map((setting) =>
    sumSetting(setting, people)
  )
  return settingScores.reduce(
    (max, score) => (score > max ? score : max),
    settingScores[0]
  )
}

function sumSetting(setting: Setting, people: People) {
  return setting.reduce((sum, personName, idx) => {
    const prevIndex = idx === 0 ? setting.length - 1 : idx - 1
    const nextIndex = idx === setting.length - 1 ? 0 : idx + 1

    const prevPersonName = setting[prevIndex]
    const nextPersonName = setting[nextIndex]

    const person = people[personName]
    sum += person[prevPersonName] + person[nextPersonName]

    return sum
  }, 0)
}

function permutations<T>(xs: T[]): T[][] {
  if (!xs.length) return [[]]

  return xs.flatMap<T[]>((x, i): T[][] => {
    return permutations<T>([...xs.slice(0, i), ...xs.slice(i + 1)]).map(
      (vs) => [x, ...vs]
    )
  })
}
