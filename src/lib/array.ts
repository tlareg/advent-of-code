export function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b)
}

export function product(arr: number[]): number {
  return arr.reduce((a, b) => a * b)
}
