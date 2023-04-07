// https://adventofcode.com/2015/day/15

import { readFileSync } from 'fs'

type Ingredient = {
  name: string
  capacity: number
  durability: number
  flavor: number
  texture: number
  calories: number
}

const scoreProperties = ['capacity', 'durability', 'flavor', 'texture'] as const
type ScoreProperty = typeof scoreProperties[number]
type Property = ScoreProperty | 'calories'

const LINE_REGEXP =
  /^(?<name>.+):\s+capacity\s+(?<capacity>.+),\s+durability\s(?<durability>.+),\s+flavor\s+(?<flavor>.+)\s+texture\s+(?<texture>.+),\s+calories\s+(?<calories>.+)$/

const input = readFileSync(`${__dirname}/input.txt`, 'utf-8')

const ingredients = parseInput(input)
const solution1 = solve(ingredients, { countCalories: false })
const solution2 = solve(ingredients, { countCalories: true })
console.log({ solution1, solution2 })

function parseInput(input: string): Record<string, Ingredient> {
  return input.split('\n').reduce<Record<string, Ingredient>>((acc, line) => {
    const { groups } = line.match(LINE_REGEXP) as unknown as {
      groups: Record<keyof Ingredient, string>
    }

    const { name, ...rest } = groups
    acc[groups.name] = {
      name: groups.name,
      ...Object.entries(rest).reduce<Omit<Ingredient, 'name'>>(
        (acc, [key, value]) => ({ ...acc, [key]: parseInt(value, 10) }),
        {} as Omit<Ingredient, 'name'>
      ),
    }

    return acc
  }, {})
}

function solve(
  ingredients: Record<string, Ingredient>,
  { countCalories }: { countCalories: boolean }
) {
  let max = 0

  for (let s = 0; s <= 100; s++) {
    for (let b = 0; b <= 100 - s; b++) {
      for (let ch = 0; ch <= 100 - s - b; ch++) {
        const ca = 100 - s - b - ch
        const amounts = {
          Sprinkles: s,
          Butterscotch: b,
          Chocolate: ch,
          Candy: ca,
        }
        const score = computeScore(ingredients, amounts)

        let canUseScore = true
        if (countCalories) {
          const calories = computeProperty(ingredients, amounts, 'calories')
          if (calories !== 500) {
            canUseScore = false
          }
        }

        if (canUseScore) {
          max = Math.max(max, score)
        }
      }
    }
  }

  return max
}

function computeScore(
  ingredients: Record<string, Ingredient>,
  amounts: Record<string, number>
) {
  return scoreProperties.reduce(
    (acc, prop) => acc * computeProperty(ingredients, amounts, prop),
    1
  )
}

function computeProperty(
  ingredients: Record<string, Ingredient>,
  amounts: Record<string, number>,
  property: Property
) {
  const propertyScore = Object.entries(amounts).reduce(
    (sum, [key, value]) => sum + value * ingredients[key][property],
    0
  )
  return propertyScore >= 0 ? propertyScore : 0
}
