const input = '.^^^.^.^^^.^.......^^.^^^^.^^^^..^^^^^.^.^^^..^^.^.^^..^.^..^^...^.^^.^^^...^^.^.^^^..^^^^.....^....'
const rowsLen = 40
// const rowsLen = 400000

const rows = createRows(input)
printRows(rows)
console.log(countSafeTiles(rows))

function createRows(input) {
  const rows = [ input.split('') ]
  for (let i = 1; i < rowsLen; i++) {
    const prevRow = rows[i - 1]
    const nextRow = createRow(prevRow)
    rows.push(nextRow)
  }
  return rows
}

function createRow(prevRow) {
  const prevRowExtended = ['.', ...prevRow, '.']
  const row = []
  for (let i = 0; i < prevRowExtended.length - 2; i++) {
    const slice = prevRowExtended.slice(i, i + 3)
    row.push(createTile(slice))
  }
  return row
}

function createTile([left, center, right]) {
  const isTrap = x => x === '^'
  if (isTrap(left) && isTrap(center) && !isTrap(right)) { return '^' }
  if (!isTrap(left) && isTrap(center) && isTrap(right)) { return '^' }
  if (isTrap(left) && !isTrap(center) && !isTrap(right)) { return '^' }
  if (!isTrap(left) && !isTrap(center) && isTrap(right)) { return '^' }
  return '.'
}

function printRows(rows) {
  console.log(rows.map(r => r.join('')).join('\n'))
}

function countSafeTiles(rows) {
  return rows.reduce((sum, row) => {
    sum += row.filter(t => t !== '^').length
    return sum
  }, 0)
}