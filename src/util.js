const addBackground = (svg, { color, width, rx, ry }) => {
  return svg.ele('rect', {
    x: 0,
    y: 0,
    width: width,
    height: width,
    rx: rx,
    ry: ry || rx,
    fill: color
  })
}

const bitArray = (a) => {
  return byteArray(a).map((n) => int2BitString(n)).join('').split('').map((digit) => Number.parseInt(digit))
}

const byteArray = (a) => {
  if (typeof a === 'string') {
    let bytes = []
    for (let i = 0; i < a.length / 2; ++i) {
      let bytei = a.length - ((i + 1) * 2)
      bytes.push(Number.parseInt(a.slice(bytei, bytei + 2), 16))
    }
    return bytes
  }

  if (a instanceof ArrayBuffer) {
    let bytes = []
    let view = new DataView(a)
    for (let i = 0; i < a.byteLength; ++i) {
      bytes.push(view.getUint8(i))
    }
    return bytes
  }

  if (Array.isArray(a) && a.every(Number.isInteger)) {
    return a
  }

  throw new TypeError(`Unable to construct an array of bytes from provided input: ${a.toString()}`)
}

const int2BitString = (n) => {
  return ('00000000' + n.toString(2)).slice(-8)
}

const int2ByteString = (n) => {
  return ('0' + n.toString(16)).slice(-2)
}

const polar = (r, theta) => {
  return {
    x: r * Math.cos(Math.PI * (theta - 90) / 180),
    y: r * Math.sin(Math.PI * (theta - 90) / 180)
  }
}

const reverse = (arr) => {
  let newArr = new Array(arr.length)
  for (let i = 0; i < arr.length; ++i) {
    newArr[arr.length - i - 1] = arr[i]
  }
  return newArr
}

module.exports = {
  addBackground,
  bitArray,
  byteArray,
  int2BitString,
  int2ByteString,
  polar,
  reverse
}
