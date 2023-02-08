export const createBitGenerator: (hash: string) => ((n: number) => number) = (hash: string) => {
  const bits = hash
    .split('')
    .map((c) => Number.parseInt(c, 16))
    .map((n) => n.toString(2).padStart(4, '0'))
    .join('')
    .split('')

  return (n) => {
    if (n > bits.length) throw new Error('Provided hash did not contain enough data')
    return Number.parseInt(bits.splice(0, n).join(''), 2)
  }
}

export const polar2Cartesian: (coords: { r: number, theta: number }) => ({ x: number, y: number }) = ({ r, theta }) => {
  return {
    x: r * Math.cos(Math.PI * (theta - 90) / 180),
    y: r * Math.sin(Math.PI * (theta - 90) / 180)
  }
}

export const IMAGE_WIDTH = 360

export const binary2Hex: (binaryString: string) => string = (binaryString) => Number.parseInt(binaryString, 2).toString(16)
export const binary2Number: (binaryString: string) => number = (binaryString) => Number.parseInt(binaryString, 2)
export const hex2Binary: (hexString: string) => string = (hexString) => Number.parseInt(hexString, 16).toString(2)
export const hex2Number: (hexString: string) => number = (hexString) => Number.parseInt(hexString, 16)

// const hashStringToByteArray: (s: string) => number[] = (s) => {
//   const bytes: number[] = []
//   s = s.padStart(Math.ceil(s.length / 2) * 2, '0')

//   for (let i = 0; i < s.length; i += 2) {
//     bytes.push(Number.parseInt(s.substring(i, i + 2), 16))
//   }

//   return bytes
// }

// const reverseArray: <T>(a: T[]) => T[] = (a) => {
//   const newA: typeof a = new Array(a.length)

//   for (let i = 0; i < a.length; ++i) {
//     newA[a.length - i - 1] = a[i]
//   }

//   return newA
// }