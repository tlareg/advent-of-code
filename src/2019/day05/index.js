const fs = require('fs')
const input = fs
  .readFileSync('./input.txt')
  .toString()
  .split(',')
  .map(Number)

const add = (intcode, a, b, resultPos) => {
  intcode[resultPos] = a + b
}

const multiply = (intcode, a, b, resultPos) => {
  intcode[resultPos] = a * b
}

const saveInput = (intcode, resultPos, input) => {
  intcode[resultPos] = input
}

const getParam = (intcode, pos, mode) =>
  mode === '1' ? intcode[pos] : intcode[intcode[pos]]

const compute = intcode => {
  let currPosition = 0

  while (true) {
    let [paramMode3, paramMode2, paramMode1, ...opCode] = String(
      intcode[currPosition]
    ).padStart(5, '0')

    opCode = parseInt(opCode.join(''), 10)

    if (opCode === 99) break

    if (![1, 2, 3, 4].includes(opCode))
      throw 'no such opcode, something went wrong'

    const param1 = getParam(intcode, currPosition + 1, paramMode1)
    const param2 = getParam(intcode, currPosition + 2, paramMode2)

    if (opCode === 1) {
      add(intcode, param1, param2, intcode[currPosition + 3])
      currPosition += 4
    } else if (opCode === 2) {
      multiply(intcode, param1, param2, intcode[currPosition + 3])
      currPosition += 4
    } else if (opCode === 3) {
      saveInput(intcode, intcode[currPosition + 1], 1)
      currPosition += 2
    } else if (opCode === 4) {
      console.log(param1)
      currPosition += 2
    }
  }
}

compute([...input])
