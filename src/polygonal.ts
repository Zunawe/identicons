import type { IdenticonOptions } from './types'

import { create } from 'xmlbuilder2'
import { createBitGenerator, polar2Cartesian, IMAGE_WIDTH } from './util'

export interface PolygonalIdenticonOptions extends IdenticonOptions {
  numShells?: number
  numSegments?: number
}

export const generate: (options: PolygonalIdenticonOptions) => string = ({
  hash,
  background,
  numShells = 4,
  numSegments = 5
}) => {
  const getBits = createBitGenerator(hash)
  const color = `#${getBits(24).toString(16)}`
  const segmentThickness = Math.floor(IMAGE_WIDTH / ((numShells * 2) + 1))
  const centerX = IMAGE_WIDTH / 2
  const centerY = IMAGE_WIDTH / 2

  const svg = create().ele('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: `0 0 ${IMAGE_WIDTH} ${IMAGE_WIDTH}`,
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
  for (let i = 0; i < numShells; ++i) {
    for (let j = 0; j < numSegments; ++j) {
      if (i === 0 || getBits(1) === 1) {
        const theta1 = (360 / numSegments) * j
        const theta2 = (360 / numSegments) * (j + 1)

        const r1 = segmentThickness * i
        const r2 = segmentThickness * (i + 1)
        // r2 -= (r2 - r1) / 10

        const corners = [
          polar2Cartesian({ r: r2, theta: theta1 }),
          polar2Cartesian({ r: r2, theta: theta2 }),
          polar2Cartesian({ r: r1, theta: theta2 }),
          polar2Cartesian({ r: r1, theta: theta1 })
        ]

        const d = `M ${centerX + corners[0].x} ${centerY + corners[0].y} ` +
                `L ${centerX + corners[1].x} ${centerY + corners[1].y} ` +
                `L ${centerX + corners[2].x} ${centerY + corners[2].y} ` +
                `L ${centerX + corners[3].x} ${centerY + corners[3].y} ` +
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