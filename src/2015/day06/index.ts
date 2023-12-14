// https://adventofcode.com/2015/day/6

import { readFileSync } from 'fs'

const LINE_REGEX =
  /^(?<command>turn on|turn off|toggle)\s+(?<start>\d+,\d+)\s+through\s+(?<end>\d+,\d+)$/

type CoordsStr = `${number},${number}`

type LineMatch = {
  groups: {
    command: Command
    start: CoordsStr
    end: CoordsStr
  }
}

type Command = 'turn off' | 'turn on' | 'toggle'

type CommandConfig<T> = {
  grid: Grid<T>
  command: Command
  start: [number, number]
  end: [number, number]
}

type Grid<T> = T[][]

type Callbacks<T> = Record<Command, (x: T) => T>

const GRID_SIZE = {
  x: 1000,
  y: 1000,
}

const parsedInput = parseInput()
const solution1 = solve1(parsedInput)
const solution2 = solve2(parsedInput)

console.log({ solution1, solution2 })

function parseInput() {
  const input = readFileSync(`${__dirname}/input.txt`, 'utf-8')

  const parseCoordsStr = (str: CoordsStr) =>
    str.split(',').map(Number) as [number, number]

  return input.replace(/\r\n/g,'\n').split('\n').map((line) => {
    const {
      groups: { command, start, end },
    } = line.match(LINE_REGEX) as unknown as LineMatch

    return {
      command,
      start: parseCoordsStr(start),
      end: parseCoordsStr(end),
    }
  })
}

function solve1(input: ReturnType<typeof parseInput>) {
  let grid = initGrid<boolean>(false)

  const callbacks1: Callbacks<boolean> = {
    'turn on': () => true,
    'turn off': () => false,
    toggle: (val) => !val,
  }

  input.forEach((line) => {
    grid = executeCommand(callbacks1, { ...line, grid })
  })

  return sumLit(grid)
}

function solve2(input: ReturnType<typeof parseInput>) {
  let grid = initGrid<number>(0)

  const callbacks2: Callbacks<number> = {
    'turn on': (val) => val + 1,
    'turn off': (val) => (val > 0 ? val - 1 : 0),
    toggle: (val) => val + 2,
  }

  input.forEach((line) => {
    grid = executeCommand(callbacks2, { ...line, grid })
  })

  return sumBrightness(grid)
}

function initGrid<T>(initVal: T): Grid<T> {
  const grid = []

  for (let x = 0; x < GRID_SIZE.x; x++) {
    const line = []
    for (let y = 0; y < GRID_SIZE.y; y++) {
      line[y] = initVal
    }
    grid[x] = line
  }

  return grid
}

function executeCommand<T>(
  callbacks: Callbacks<T>,
  commandConfig: CommandConfig<T>
) {
  return mapGrid<T>({
    ...commandConfig,
    callback: callbacks[commandConfig.command],
  })
}

function mapGrid<T>({
  grid,
  start,
  end,
  callback,
}: {
  grid: Grid<T>
  callback: (cellValue: T) => T
  start?: [number, number]
  end?: [number, number]
}) {
  const [startX, startY] = start ?? [0, 0]
  const [endX, endY] = end ?? [GRID_SIZE.x - 1, GRID_SIZE.y - 1]

  for (let x = startX; x <= endX; x++) {
    for (let y = startY; y <= endY; y++) {
      grid[x][y] = callback(grid[x][y])
    }
  }

  return grid
}

function sumLit(grid: Grid<boolean>) {
  let sum = 0

  mapGrid<boolean>({
    grid,
    callback: (val) => {
      if (val) {
        sum++
      }
      return val
    },
  })

  return sum
}

function sumBrightness(grid: Grid<number>) {
  let sum = 0

  mapGrid<number>({
    grid,
    callback: (val) => {
      sum += val
      return val
    },
  })

  return sum
}
