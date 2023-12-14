const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt', 'utf8').toString()

solve(inputStr, { a: 0, b: 0, c: 0, d: 0 })
solve(inputStr, { a: 0, b: 0, c: 1, d: 0 })

function solve(str, state) {
  const lines = str.replace(/\r\n/g,'\n').split('\n')
  const getVal = arg => state.hasOwnProperty(arg) ? state[arg] : parseInt(arg, 10)
  let i = 0
  while (i < lines.length) {
    let [cmd, arg1, arg2] = lines[i++].split(' ')
    if (cmd === 'cpy') { state[arg2] = getVal(arg1) }
    else if (cmd === 'inc') { state[arg1]++ } 
    else if (cmd === 'dec') { state[arg1]-- }
    else if (cmd === 'jnz' && getVal(arg1) !== 0) { i += parseInt(arg2, 10) - 1 }
  }
  console.log(state)
}