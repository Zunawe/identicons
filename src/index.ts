import { IdenticonOptions } from './types'

import { generate as generateMatrixIdenticon, MatrixIdenticonOptions } from './matrix'
import { generate as generateCircularIdenticon, CircularIdenticonOptions } from './circular'
import { generate as generatePolygonalIdenticon, PolygonalIdenticonOptions } from './polygonal'

const generators = {
  MATRIX: generateMatrixIdenticon,
  CIRCULAR: generateCircularIdenticon,
  POLYGONAL: generatePolygonalIdenticon,
}

export const generateIdenticon: (options: IdenticonOptions) => string = (options) => {
  switch (options.type) {
    case 'MATRIX':
      return generateMatrixIdenticon(options as MatrixIdenticonOptions)
    case 'CIRCULAR':
      return generateCircularIdenticon(options as CircularIdenticonOptions)
    case 'POLYGONAL':
      return generatePolygonalIdenticon(options as PolygonalIdenticonOptions)
    default:
      throw new Error(`Unknown identicon type: ${options.type}`)
  }
}
