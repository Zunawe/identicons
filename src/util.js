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
  return byteArray(a).map((n) => n.toString(2)).join('').split('').map(Number.parseInt)
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

const int2ByteString = (n) => {
  return ('0' + n.toString(16)).slice(-2)
}

const polar = (r, theta) => {
  return {
    x: r * Math.cos(Math.PI * (theta - 90) / 180),
    y: r * Math.sin(Math.PI * (theta - 90) / 180)
  }
}

module.exports = {
  addBackground,
  bitArray,
  byteArray,
  int2ByteString,
  polar
}
