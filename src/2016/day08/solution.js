// from http://stackoverflow.com/questions/1985260/javascript-array-rotate
Array.prototype.rotate = (function() {
  var unshift = Array.prototype.unshift,
      splice = Array.prototype.splice;

  return function(count) {
    var len = this.length >>> 0,
        count = count >> 0;

    unshift.apply(this, splice.call(this, count % len, len));
    return this;
  };
})();


const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()

parseInput(inputStr)

function parseInput(str) {
  const screen = initScreen()
  const lines = str.replace(/\r\n/g,'\n').split('\n')
  
  lines.forEach(line => parseInputLine(line, screen))

  // part 1 answer
  console.log(howManyLit(screen))
}

function howManyLit(screen) {
  return screen.reduce((sum, column) => {
    column.forEach(item => {
      if (item === '#') { ++sum }
    })
    return sum
  }, 0)
}

function initScreen() {
  const WIDTH = 50
  const HEIGHT = 6
  let screen = []

  fillScreen({ 
    screen, 
    width: WIDTH, 
    height: HEIGHT,
    character: '.'
  })

  return screen
}

function fillScreen({ screen, width, height, character }) {
  for (let y = 0; y < height; y++) {
    screen[y] = screen[y] || []
    for (let x = 0; x < width; x++) {
      screen[y][x] = character
    }
  }
}

function displayScreen(screen) {
  console.log('\n')
  screen.forEach(column => {
    console.log(column.join(''))
  })
  console.log('\n')
}

function parseInputLine(line, screen) {
  // console.log(line)

  const lineArr = line.split(' ')
  const command = lineArr[0]

  if (command === 'rect') {
    const size = lineArr[1].split('x')
    const width = parseInt(size[0], 10)
    const height = parseInt(size[1], 10)
    rect({ screen, width, height })
  } else if (command === 'rotate') {
    const dir = lineArr[1]
    const idx = parseInt(lineArr[2].split('=')[1], 10)
    const by = parseInt(lineArr[4], 10)
    rotate({ screen, dir, idx, by })
  }

  // displayScreen(screen)
}

function rect({ screen, width, height }) {
  fillScreen({ screen, width, height, character: '#'})
}

function rotate({ screen, dir, idx, by }) {
  if (dir === 'column') {
    replaceScreenColumn(
      screen, idx, cloneScreenColumn(screen, idx).rotate(-by)
    )
  } else if (dir === 'row') {
    screen[idx].rotate(-by)
  }
}

function cloneScreenColumn(screen, idx) {
  let column = []
  for (let i = 0, len = screen.length; i < len; i++) {
    column.push(screen[i][idx])
  }
  return column
}

function replaceScreenColumn(screen, idx, newColumn) {
  for (let i = 0, len = screen.length; i < len; i++) {
    screen[i][idx] = newColumn[i]
  }
}