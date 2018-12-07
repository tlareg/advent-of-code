const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()

const lines = inputStr.split('\r\n')

const showRecords = records =>
  console.log(records.map(r => ({ ...r, date: r.date.toString() })))

const records = lines
  .map(line => {
    const match = line.match(
      /^\[(\d+-\d+-\d+\s+\d+:\d+)\]\s+(Guard #(\d+) begins shift|(falls) asleep|(wakes) up)$/
    )

    const date = new Date(match[1])
    const guardId = match[3] ? parseInt(match[3], 10) : false
    const fallsAsleep = !!match[4]
    const wakesUp = !!match[5]

    return {
      date,
      guardId,
      wakesUp,
      fallsAsleep,
    }
  })
  .sort((a, b) => +a.date - +b.date)

let currentGuardId
let guards = records.reduce((guards, record) => {
  if (record.guardId) {
    currentGuardId = record.guardId
  }
  if (!guards[currentGuardId]) {
    guards[currentGuardId] = { records: [] }
  }
  guards[currentGuardId].records.push(record)
  return guards
}, {})

guards = Object.keys(guards).reduce((acc, guardId) => {
  const guard = guards[guardId]

  guard.minutesAsleep = guard.records.reduce(
    ({ sum, minutesCount }, record, idx) => {
      if (record.guardId) return { sum, minutesCount }
      if (record.fallsAsleep) return { sum, minutesCount }
      if (record.wakesUp) {
        const recordFallsAsleep = guard.records[idx - 1]

        const fallsAsleepDate = recordFallsAsleep.date
        const wakesUpDate = record.date

        for (
          let i = fallsAsleepDate.getMinutes();
          i < wakesUpDate.getMinutes();
          i++
        ) {
          minutesCount[i] = (minutesCount[i] || 0) + 1
        }

        const diffMs = wakesUpDate - fallsAsleepDate
        const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000)

        return {
          sum: sum + diffMins,
          minutesCount,
        }
      }
      return { sum, minutesCount }
    },
    { sum: 0, minutesCount: {} }
  )

  acc[guardId] = guard
  return acc
}, {})

const crappyGuard = Object.keys(guards).reduce(
  ({ maxMinutesAsleepSum, guardId }, currentGuardId) => {
    const currentGuard = guards[currentGuardId]
    if (currentGuard.minutesAsleep.sum > maxMinutesAsleepSum) {
      return {
        guardId: currentGuardId,
        maxMinutesAsleepSum: currentGuard.minutesAsleep.sum,
      }
    }
    return { maxMinutesAsleepSum, guardId }
  },
  {
    guardId: '',
    maxMinutesAsleepSum: 0,
  }
)

// guards
//   [guardId] guard
//     records
//     minutesAsleep
//       sum: number
//       minutesCount
//         [minute]: count

const getMostOftenMinuteAsleep = guard => {
  const minutesCount = guard.minutesAsleep.minutesCount
  const { max, maxMinute } = Object.keys(minutesCount).reduce(
    ({ max, maxMinute }, minute) =>
      minutesCount[minute] > max
        ? { max: minutesCount[minute], maxMinute: minute }
        : { max, maxMinute },
    { max: 0, maxMinute: null }
  )
  return {
    maxCount: max,
    maxMinute: parseInt(maxMinute, 10),
  }
}

const firstStar =
  crappyGuard.guardId * getMostOftenMinuteAsleep(guards[crappyGuard.guardId]).maxMinute
console.log(`firstStar: ${firstStar}`)

const secondStar = Object.keys(guards).reduce(
  ({ maxGuardId, maxCount, maxMinute }, guardId) => {
    const { maxCount: count, maxMinute: minute } = getMostOftenMinuteAsleep(guards[guardId])
    if (count > maxCount) {
      return { maxGuardId: guardId, maxCount: count, maxMinute: minute }
    }
    return { maxGuardId, maxCount, maxMinute }
  },
  { maxGuardId: null, maxCount: 0, maxMinute: null }
)

console.log(
  `secondStar: ${parseInt(secondStar.maxGuardId, 10) * secondStar.maxMinute}`
)
