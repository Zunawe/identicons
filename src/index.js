const generateSquare = require('./square')
const generateCircular = require('./circle')
const generatePolygonal = require('./polygon')

const generators = {
  SQUARE: generateSquare,
  CIRCULAR: generateCircular,
  POLYGONAL: generatePolygonal
}

const identicon = (options) => {
  return generators[options.type](options)
}

module.exports = identicon
