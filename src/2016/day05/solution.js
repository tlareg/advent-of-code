const md5 = require('md5')
const input = 'ojvtpuvg'

function part1() {
  let pwd = ''
  let hash = ''
  let i = 0

  while (pwd.length < 8) {
    hash = md5(input + i)
    if (hash.slice(0, 5) === '00000') {
      pwd += hash[5]
    }
    i++
  }

  console.log('pwd', pwd)
}

function part2() {
  let count = 0
  let pwd = []
  let hash = ''
  let i = 0

  while (count < 8) {
    hash = md5(input + i)
    if (hash.slice(0, 5) === '00000') {
      const idx = +hash[5]
      if (idx >= 0 && idx <= 7 && !pwd[idx]) {
        pwd[idx] = hash[6]
        count++
        console.log(pwd.join(''))
      }
    }
    i++
  }
}

part2()