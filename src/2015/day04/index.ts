import crypto from 'crypto'

const input = 'yzbqklnj'

for (let i = 0; ; i++) {
  const hash = crypto
    .createHash('md5')
    .update(input + i)
    .digest('hex')

  if (hash.startsWith('00000')) {
    console.log({ numWithFiveZerosHash: i });
  }

  if (hash.startsWith('000000')) {
    console.log({ numWithSixZerosHash: i });
    break;
  }
}
