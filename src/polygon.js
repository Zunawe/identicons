const xmlbuilder = require('xmlbuilder')

const { addBackground, bitArray, byteArray, polar } = require('./util')

const generate = ({ hash, size = 4, width = 128, segments = 5, background }) => {
  let bytes = byteArray(hash)
  let bits = bitArray(bytes)
  
  let color = '#' + bytes.slice(bytes.length - 3, bytes.length).map(int2ByteString).join('')
  let segmentWidth = Math.floor(width / ((size * 2) + 1))

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

  for (let i = 0; i < size; ++i) {
    for (let j = 0; j < segments; ++j) {
      if (!i || bits[((i - 1) * segments) + j] === 1) {
        let theta1 = (360 / segments) * j
        let theta2 = (360 / segments) * (j + 1)

        let r1 = segmentWidth * i
        let r2 = segmentWidth * (i + 1)
        r2 -= (r2 - r1) / 10

        let points = [polar(r2, theta1), polar(r2, theta2), polar(r1, theta2), polar(r1, theta1)]
        let cx = width / 2
        let cy = width / 2

        let d = `M ${cx + points[0].x} ${cy + points[0].y} ` +
                `L ${cx + points[1].x} ${cy + points[1].y} ` +
                `L ${cx + points[2].x} ${cy + points[2].y} ` +
                `L ${cx + points[3].x} ${cy + points[3].y} ` +
                'Z'
        
        svg.ele('path', {
          d: d,
          fill: color
        })
      }
    }
  }

  return svg.end()
}

module.exports = generate
