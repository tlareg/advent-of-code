"use strict"

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

console.log(solveFirst(instructions))
console.log(solveSecond(instructions))

function parseInput(inputStr) {
  return inputStr.replace(/\r\n/g,'\n').split('\n').map(line => {
    return line.split(/\s+/)
  })
}

function solveFirst(instructions) {
  let state = {
    registers: {},
    sndQueue: [],
    firstAnswer: undefined,
    pos: 0
  }

  while (state.firstAnswer === undefined) {
    state = handleInstruction(
      state, instructions[state.pos], { isFirstPart: true }
    )
  }

  return state.firstAnswer
}

function solveSecond() {
  const createInitialState = p => ({
    registers: { p },
    sndQueue: [],
    sndCount: 0,
    rcvCallback: undefined,
    waiting: false,
    pos: 0
  })

  let state0 = createInitialState(0)
  let state1 = createInitialState(1)

  while (!state1.waiting || !state0.waiting) {
    handleTickForState(state0, state1)
    handleTickForState(state1, state0)
  }

  return state1.sndCount
}

function handleTickForState(sA, sB) {
  if (sA.rcvCallback) {
    if (sB.sndQueue.length) {
      sA.waiting = false
      sA.rcvCallback(sB.sndQueue.shift())
    } else {
      sA.waiting = true
    }
  } else {
    sA = handleInstruction(
      sA, instructions[sA.pos], { isFirstPart: false }
    )
  }
}

function handleInstruction(state, [name, ...args], opts) {
  const regs = state.registers
  const evalArg = createEvalArg(regs)
  const evalReg = createEvalReg(regs)
  const [x, y] = args

  switch(name) {
    case 'snd':
      state.sndQueue.push(evalArg(x))
      if (!opts.isFirstPart) {
        state.sndCount++
      }
      state.pos++
      return state

    case 'set':
      regs[x] = evalArg(y)
      state.pos++
      return state

    case 'add':
      regs[x] = evalReg(x) + evalArg(y)
      state.pos++
      return state

    case 'mul':
      regs[x] = evalReg(x) * evalArg(y)
      state.pos++
      return state

    case 'mod':
      regs[x] = evalReg(x) % evalArg(y)
      state.pos++
      return state

    case 'rcv':
      if (opts.isFirstPart) {
        if (evalArg(x) !== 0) {
          state.firstAnswer = state.sndQueue[state.sndQueue.length - 1]
        }
      } else {
        state.rcvCallback = val => {
          regs[x] = val
          state.rcvCallback = undefined
        }
      }
      state.pos++
      return state

    case 'jgz':
      state.pos = state.pos + ((evalArg(x) > 0) ? evalArg(y) : 1)
      return state
  }
}