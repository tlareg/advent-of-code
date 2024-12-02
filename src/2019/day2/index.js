const fs = require('fs')
const input = fs
  .readFileSync('./input.txt')
  .toString()
  .split(',')
  .map(Number)

const add = (intcode, aPos, bPos, resultPos) => {
  intcode[resultPos] = intcode[aPos] + intcode[bPos]
}

const multiply = (intcode, aPos, bPos, resultPos) => {
  intcode[resultPos] = intcode[aPos] * intcode[bPos]
}

const ops = {
  1: add,
  2: multiply,
}

const compute = (intcode, noun, verb) => {
  intcode[1] = noun
  intcode[2] = verb

  let currPosition = 0
  let opCode

  while (true) {
    opCode = intcode[currPosition]

    if (opCode === 99) break

    if (![1, 2].includes(opCode)) throw 'no such opcode, something went wrong'

    ops[opCode](
      intcode,
      intcode[currPosition + 1],
      intcode[currPosition + 2],
      intcode[currPosition + 3]
    )

    currPosition += 4
  }

  return intcode[0]
}

const firstStar = compute([...input], 12, 2)
console.log({ firstStar })

const computeSecond = () => {
  const expectedOutput = 19690720
  let output
  for (let x = 0; x < 99; x++) {
    for (let y = 0; y < 99; y++) {
      output = compute([...input], x, y)
      if (output === expectedOutput) {
          return { noun: x, verb: y };
      }
    }
  }
}

const { noun, verb } = computeSecond();
const secondStar = 100 * noun + verb;
console.log({ secondStar });
