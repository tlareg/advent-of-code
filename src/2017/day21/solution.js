const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()

const rules = parseInput(inputStr)
console.log(solve(rules))

function parseInput(inputStr) {
  return inputStr.split('\r\n').map(line => {
    const match = line.match(/^(.+)\s+=>\s+(.+)$/)
    return {
      condition: patternToMatrix(match[1]),
      result: patternToMatrix(match[2])
    }
  })
}

function solve(rules) {
  const rulesBySize = {
    2: rules.filter(r => r.condition.length === 2),
    3: rules.filter(r => r.condition.length === 3)
  }

  const beginPattern = '.#./..#/###'

  let matrix = patternToMatrix(beginPattern)
  let splitSize;

  let firstStar = 0

  for (let i = 0 ; i < 18; ++i) {
    splitSize = (matrix.length % 2 === 0) ? 2 : 3
    let squaresMatrix = splitMatrix(matrix, splitSize)

    squaresMatrix = mapSquaresMatrix(squaresMatrix, square => {
      const rule = getMatchingRule(rulesBySize[splitSize], square)
      return cloneMatrix(rule.result)
    })

    matrix = mergeSquaresMatrix(squaresMatrix)

    if (i === 4) {
      firstStar = countActivePixels(matrix)
    }
  }

  return { firstStar, secondStar: countActivePixels(matrix) }
}

function countActivePixels(matrix) {
  return matrix.map(r => r.join('')).join('').split('')
    .reduce((sum, c) => c === '#' ? sum + 1 : sum, 0)
}

function splitMatrix(matrix, splitSize) {
  if (matrix.length === splitSize) {
    return [[cloneMatrix(matrix)]]
  }

  let squaresMatrix = []

  for (let i = 0; i < matrix.length; i += splitSize) {
    const squaresRow = []
    for (let j = 0; j < matrix.length; j += splitSize) {
      const square = []
      for (let k = 0; k < splitSize; k++) {
        const slice = matrix[i + k].slice(j, j + splitSize)
        square.push(slice)
      }
      squaresRow.push(square)
    }
    squaresMatrix.push(squaresRow)
  }

  return squaresMatrix
}

function mergeSquaresMatrix(squaresMatrix) {
  const matrix = []
  const squareSize = squaresMatrix[0][0].length

  squaresMatrix.forEach(squaresRow => {
    for (let i = 0; i < squareSize; i++) {
      const matrixRow = squaresRow.reduce((row, s) => row.concat(s[i]), [])
      matrix.push(matrixRow)
    }
  })

  return matrix
}

function getMatchingRule(rules, square) {
  return rules.find(r => isRuleMatching(r.condition, square))
}

function isRuleMatching(conditionMatrix, originalSquare) {
  const pattern = matrixToPattern(conditionMatrix)
  square = cloneMatrix(originalSquare)

  if (match(square, pattern)) return true
  if (match(horizontalFlipMatrix(cloneMatrix(square)), pattern)) return true

  for (let i = 0; i < 3; i++) {
    square = rotateMatrix(square)
    if (match(square, pattern)) return true
    if (match(horizontalFlipMatrix(cloneMatrix(square)), pattern)) return true
  }

  return false
}

function match(matrix, pattern) {
  return matrixToPattern(matrix) === pattern
}

function verticalFlipMatrix(matrix) {
  const out = []
  for (let i = 0, l = matrix.length; i < l; i++) {
    let opp = i - l + 1
    out[i] = matrix[Math.abs(opp)]
  }
  return out
}

function horizontalFlipMatrix(matrix) {
  const out = []
  for (let i = 0, l1 = matrix.length; i < l1; i++) {
    out[i] = []
    let row = matrix[i]

    for (let j = 0, l2 = row.length; j < l2; j++) {
      let opp = j - l2 + 1
      out[i][j] = matrix[i][Math.abs(opp)]
    }
  }
  return out
}

function rotateMatrix(matrix) {
  matrix = matrix.reverse();
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < i; j++) {
      let temp = matrix[i][j];
      matrix[i][j] = matrix[j][i];
      matrix[j][i] = temp;
    }
  }
  return matrix
}

function patternToMatrix(m) {
  return m.split('/').map(row => row.split(''))
}

function matrixToPattern(matrix) {
  return matrix.map(row => row.join('')).join('/')
}

function mapSquaresMatrix(squaresMatrix, callback) {
  return squaresMatrix.map(squaresRow => {
    return squaresRow.map(square => callback(square))
  })
}

function logSquaresMatrix(squaresMatrix) {
  mapSquaresMatrix(squaresMatrix, square => logMatrix(square))
}

function logMatrix(matrix) {
  console.log(matrix.map(row => row.join('')).join('\n'))
}

function cloneMatrix(matrix) {
  return matrix.map(row => [...row])
}