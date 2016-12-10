class State {
  constructor() {
    this.bots = []
    this.outputs = []
  }

  findById(target, targetId) {
    if (target === 'bot') {
      return this.findBotById(targetId)
    }
    if (target === 'output') {
      return this.findOutputById(targetId)
    }
    return null
  }

  findBotById(id) {
    return this.bots.find(bot => bot.id === id) || this.addBot(id)
  }

  addBot(id) {
    const newBot = new Bot(id, this)
    this.bots = [...this.bots, newBot]
    return newBot
  }

  findOutputById(id) {
    return this.outputs.find(output => output.id === id) || this.addOutput(id)
  }

  addOutput(id) {
    const newOutput = new Output(id)
    this.outputs = [...this.outputs, newOutput]
    return newOutput
  }

  display() {
    this.bots.forEach(b => {
      console.log(`Bot(${b.id}): ${b.vals}`)
    })
    this.outputs.forEach(o => {
      console.log(`Output(${o.id}): ${o.vals}`)
    })
  }
}

class Output {
  constructor(id) {
    this.id = id
    this.vals = []
  }

  pushVal(val) {
    this.vals = [...this.vals, val]
  }
}

class Bot {
  constructor(id, state) {
    this.id = id
    this.state = state
    this.vals = []
    this.commands = []
  }

  pushVal(val) {
    this.vals = [...this.vals, val]
    if (this.vals.length > 1 && this.commands.length) {
      this.executeCommand()
    }
  }

  pushCommand(command) {
    this.commands = [...this.commands, command]
    if (this.vals.length > 1 && this.commands.length) {
      this.executeCommand()
    }
  }

  executeCommand() {
    let lowVal;
    let highVal;

    if (this.vals[0] < this.vals[1]) {
      lowVal = this.vals[0]
      highVal = this.vals[1]
    } else {
      lowVal = this.vals[1]
      highVal = this.vals[0]
    }
    this.vals = []

    if (lowVal === 17 && highVal === 61) {
      console.log(`Part 1 answer = Bot(${this.id})`)
    }

    const [
      lowValTarget, lowValTargetId, highValTarget, highValTargetId
    ] = this.commands.pop()

    this.state.findById(lowValTarget, lowValTargetId).pushVal(lowVal)
    this.state.findById(highValTarget, highValTargetId).pushVal(highVal)
  }
}


const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()

parseInput(inputStr)


function parseInput(str) {
  const state = new State()

  str.split('\r\n').forEach(line => parseInputLine(line, state))

  const part2answer = [0, 1, 2].reduce((acc, id) => {
    return acc * state.findOutputById(id).vals[0]
  }, 1)
  console.log(`Part 2 answer = ${part2answer}`)
}

function parseInputLine(line, state) {
  let match = line.match(/^value\s(\d+)\s.+bot\s(\d+)$/)

  if (match) {
    const val = parseInt(match[1], 10)
    const botId = parseInt(match[2], 10)
    const bot = state.findBotById(botId)
    bot.pushVal(val)
    return;
  } 

  match = line.match(
    /^bot\s(\d+)\s.+low\sto\s(output|bot)\s(\d+).+to\s(output|bot)\s(\d+)$/
  )

  if (match) {
    const botId = parseInt(match[1], 10)
    const lowValTarget = match[2]
    const lowValTargetId = parseInt(match[3], 10)
    const highValTarget = match[4]
    const highValTargetId = parseInt(match[5], 10)
    const bot = state.findBotById(botId)
    bot.pushCommand([lowValTarget, lowValTargetId, highValTarget, highValTargetId])
  }
}