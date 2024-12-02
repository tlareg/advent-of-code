const createEvalReg = registers => name =>
  (registers[name] || (registers[name] = 0))

const createEvalArg = registers => arg => {
  const parsedArg = parseInt(arg, 10)
  return (parsedArg || parsedArg === 0)
    ? parsedArg
    : createEvalReg(registers)(arg)
}

const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()
const instructions = parseInput(inputStr)


// console.log(solveFirst(instructions))
console.log(solveSecond())

function parseInput(inputStr) {
  return inputStr.replace(/\r\n/g,'\n').split('\n').map(line => {
    return line.split(/\s+/)
  })
}

function solveFirst(instructions) {
  let state = {
    registers: {},
    pos: 0,
    mulCount: 0
  }

  while (instructions[state.pos]) {
    state = handleInstruction(state, instructions[state.pos])
  }

  return state.mulCount
}

function solveSecond() {
  let a = 1
  let b = 93
  let c = 0
  let d = 0
  let e = 0
  let f = 0
  let g = 0
  let h = 0

  b = b * 100 + 100000
  c = b + 17000
  do {
    f = 1
    d = 2
    for (let dd = d; dd * dd < b; ++dd) {
      if (b % dd === 0) {
        f = 0
        break
      }
    }
    if (f === 0) h++
    g = b - c
    b += 17
  } while (g !== 0)

  return h
}

function handleInstruction(state, [name, ...args], opts) {
  const regs = state.registers
  const evalArg = createEvalArg(regs)
  const evalReg = createEvalReg(regs)
  const [x, y] = args

  switch(name) {
    case 'set':
      regs[x] = evalArg(y)
      state.pos++
      return state

    case 'sub':
      regs[x] = evalReg(x) - evalArg(y)
      state.pos++
      return state

    case 'mul':
      regs[x] = evalReg(x) * evalArg(y)
      state.pos++
      state.mulCount++
      return state

    case 'jnz':
      state.pos = state.pos + ((evalArg(x) !== 0) ? evalArg(y) : 1)
      return state
    
    default:
      return state
  }
}