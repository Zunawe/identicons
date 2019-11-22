const xmlbuilder = require('xmlbuilder')

const { addBackground, byteArray, int2ByteString, polar } = require('./util')

const generate = ({ hash, size = 4, width = 128, segments = Infinity, symmetricAxisAngle, background }) => {
  let bytes = byteArray(hash)
  bytes = reverse(bytes)

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

  svg.ele('circle', {
    cx: width / 2,
    cy: width / 2,
    r: segmentWidth + 1,
    fill: color
  })

  for (let i = 1; i < size; ++i) {
    let theta1 = floorToCongruent(360 * (bytes[(i * 2) + 0] / 0xFF), 360 / segments)
    let theta2 = floorToCongruent(360 * (bytes[(i * 2) + 1] / 0xFF), 360 / segments)

    if(theta2 < theta1){
      let temp = theta1
      theta1 = theta2
      theta2 = temp
    }

    svg.ele('path', {
      d: buildArc(width / 2, width / 2, segmentWidth * i, segmentWidth * (i + 1) + 1, theta1, theta2),
      fill: color
    })

    if (symmetricAxisAngle !== undefined) {
      svg.ele('path', {
        d: buildArc(width / 2, width / 2, segmentWidth * i, segmentWidth * (i + 1) + 1, (symmetricAxisAngle * 2) - theta2, (symmetricAxisAngle * 2) - theta1),
        fill: color
      })
    }
  }

  return svg.end({ pretty: false })
}

/**
 * Generates the path attribute for an arc given a shell and two angles.
 * 
 * @param {number} shell - The shell to draw the arc for (affects radii).
 * @param {number} theta1 - The starting angle for drawing the arc (0, 360) (degrees).
 * @param {number} theta2 - The end angle for drawing the arc, theta2 > theta1 (0, 360) (degrees).
 * @returns {string} Value of the d attribute for the path element.
 */
const buildArc = (cx, cy, r1, r2, theta1, theta2) => {
  let largeArcFlag = (theta2 - theta1) < 180 ? 0 : 1

  let points = [polar(r2, theta1), polar(r2, theta2), polar(r1, theta2), polar(r1, theta1)]

  return `M ${cx + points[0].x} ${cy + points[0].y} ` +
         `A ${r2} ${r2} 0 ${largeArcFlag} 1 ${cx + points[1].x} ${cy + points[1].y} ` +
         `L ${cx + points[2].x} ${cy + points[2].y} ` +
         `A ${r1} ${r1} 0 ${largeArcFlag} 0 ${cx + points[3].x} ${cy + points[3].y} ` +
         'Z'
}

/**
 * Reduces a number to a multiple of some other number. Like generalized integer division.
 * 
 * @private
 * @param {number} n - The number to floor.
 * @param {number} m - The number to floor to a multiple of.
 * @returns {number} Multiple of m closest to but not greater than n.
 */
const floorToCongruent = (n, m) => {
  if (!m) {
    return n
  }

  n /= m
  n = Math.floor(n)
  return n * m
}

const reverse = (arr) => {
  let newArr = new Array(arr.length)
  for (let i = 0; i < arr.length; ++i) {
    newArr[arr.length - i - 1] = arr[i]
  }
  return newArr
}

module.exports = generate
