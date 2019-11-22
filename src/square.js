const xmlbuilder = require('xmlbuilder')

const { addBackground, bitArray, byteArray } = require('./util')

const generate = ({ hash, size = 5, width = 128, background }) => {
  let bytes = byteArray(hash)
  let bits = bitArray(bytes)

  let color = '#' + bytes.slice(bytes.length - 3, bytes.length).map(int2ByteString).join('')

  let boxWidth = Math.floor(width / (size + 1))
  let marginWidth = Math.floor((boxWidth / 2) + ((width % (size + 1)) / 2))

  let svg = xmlbuilder.create('svg')
  svg.att('width', width)
  svg.att('height', width)
  svg.att('xmlns', 'http://www.w3.org/2000/svg')

  if (background) {
    addBackground(svg, {
      color: '#EEEEEE',
      width: width,
      rx: 0,
      ...background
    })
  }

  let map = new Array(size * size)
  for (let r = 0; r < size; ++r) {
    for (let c = 0; c < Math.ceil(size / 2); ++c) {
      map[(r * size) + c] = bits[(r * size) + c]
      map[((r + 1) * size) - (c + 1)] = bits[(r * size) + c]
    }
  }

  for (let i = 0; i < size * size; ++i) {
    if (map[i] === 1) {
      let r = Math.floor(i / size)
      let c = i % size

      svg.ele('rect', {
        x: marginWidth + (c * boxWidth),
        y: marginWidth + (r * boxWidth),
        width: boxWidth,
        height: boxWidth,
        fill: color
      })
    }
  }

  return svg.end()
}

module.exports = generate
