// https://adventofcode.com/2015/day/5

import { readFileSync } from 'fs'

function parseInput() {
  const input = readFileSync(`${__dirname}/input.txt`, 'utf-8')
  return input.split('\n')
}

function solve(input: ReturnType<typeof parseInput>) {
  return input.reduce(
    ({ oldRulesCount, newRulesCount }, str) => ({
      oldRulesCount: isNice(str) ? ++oldRulesCount : oldRulesCount,
      newRulesCount: newIsNice(str) ? ++newRulesCount : newRulesCount,
    }),
    { oldRulesCount: 0, newRulesCount: 0 }
  )
}

function isNice(str: string) {
  const forbiddenParts = ['ab', 'cd', 'pq', 'xy']
  if (forbiddenParts.some((part) => str.includes(part))) {
    return false
  }

  const vowels = ['a', 'e', 'i', 'o', 'u']
  let vowelsCount = 0
  let hasDoubleLetter = false

  for (let i = 0; i <= str.length; i++) {
    if (vowels.includes(str[i])) {
      vowelsCount++
    }
    if (!hasDoubleLetter && i > 0 && str[i] === str[i - 1]) {
      hasDoubleLetter = true
    }
    if (vowelsCount >= 3 && hasDoubleLetter) {
      return true
    }
  }

  return false
}

function newIsNice(str: string) {
  let hasRepeatingPair = false
  let hasRepeatingLetter = false

  if (str.length < 4) {
    return false
  }

  for (let i = 2; i <= str.length; i++) {
    const pair = `${str[i - 2]}${str[i - 1]}`
    const substr1 = str.substring(0, i - 2)
    const substr2 = str.substring(i, str.length)
    if (
      (substr1.length && substr1.includes(pair)) ||
      (substr2.length && substr2.includes(pair))
    ) {
      hasRepeatingPair = true
    }

    if (str[i - 2] === str[i]) {
      hasRepeatingLetter = true
    }

    if (hasRepeatingPair && hasRepeatingLetter) {
      return true
    }
  }

  return false
}

const solution = solve(parseInput())
console.log(solution)
