import type { IdenticonOptions } from './types'

import { create } from 'xmlbuilder2'
import { createBitGenerator, IMAGE_WIDTH } from './util'

export interface MatrixIdenticonOptions extends IdenticonOptions {
  numRows: number
}

export const generate: (options: MatrixIdenticonOptions) => string = ({
  hash,
  numRows,
  background
}) => {
  const getBits = createBitGenerator(hash)
  const color = `#${getBits(24).toString(16)}`
  const boxWidth = Math.floor(IMAGE_WIDTH / (numRows + 1))
  const paddingWidth = Math.floor((boxWidth / 2) + ((IMAGE_WIDTH % (numRows + 1)) / 2))

  const svg = create().ele('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: `0 0 ${256} ${256}`,
    preserveAspectRatio: 'xMinYMin'
  })

  if (background !== undefined) {
    svg.ele('rect', {
      fill: background.color,
      x: 0,
      y: 0,
      width: IMAGE_WIDTH,
      height: IMAGE_WIDTH,
      rx: background.borderRadius,
      ry: background.borderRadius
    })
  }

  for (let r = 0; r < numRows; ++r) {
    for (let c = 0; c < Math.ceil(numRows / 2); ++c) {
      const bit = getBits(1) === 1

      if (bit) {
        svg.ele('rect', {
          x: paddingWidth + (c * boxWidth),
          y: paddingWidth + (r * boxWidth),
          width: boxWidth,
          height: boxWidth,
          fill: color
        })
        svg.ele('rect', {
          x: paddingWidth + ((numRows - 1 - c) * boxWidth),
          y: paddingWidth + (r * boxWidth),
          width: boxWidth,
          height: boxWidth,
          fill: color
        })
      }
    }
  }

  return svg.end()
}
