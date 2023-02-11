// https://adventofcode.com/2015/day/10

const input = '3113322113'

const solution = solve(input)
console.log({ solution })

function solve(input: string) {
  let result = input

  for (let i = 0; i < 40; i++) {
    result = lookAndSay(result)
  }

  let solution1 = result.length

  for (let i = 0; i < 10; i++) {
    result = lookAndSay(result)
  }

  return { solution1, solution2: result.length }
}

function lookAndSay(input: string) {
  if (input.length === 1) {
    return `1${input[0]}`
  }

  let result = ''
  let prevChar = input[0]
  let currentCount = 1
  let currentChar

  for (let i = 1; i < input.length; i++) {
    currentChar = input[i]

    if (currentChar === prevChar) {
      currentCount += 1
    } else {
      result += `${currentCount}${prevChar}`
      currentCount = 1
    }

    if (i === input.length - 1) {
      result += `${currentCount}${currentChar}`
    }

    prevChar = currentChar
  }

  return result
}
