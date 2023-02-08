import type { IdenticonOptions } from './types'

import { create } from 'xmlbuilder2'
import { createBitGenerator, polar2Cartesian, IMAGE_WIDTH } from './util'

export interface CircularIdenticonOptions extends IdenticonOptions {
  numShells?: number
  numSegments?: number
  symmetryAxis?: number
}

export const generate: (options: CircularIdenticonOptions) => string = ({
  hash,
  background,
  numShells = 4,
  numSegments = Infinity,
  symmetryAxis
}) => {
  const getBits = createBitGenerator(hash)
  const color = `#${getBits(24).toString(16).padStart(6, '0')}`
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

  svg.ele('circle', {
    cx: centerX,
    cy: centerY,
    r: segmentThickness + 1,
    fill: color
  })

  for (let i = 1; i < numShells; ++i) {
    const startingAngle = snapToSegments(360 * (getBits(8) / 0xFF), numSegments)
    const angleSize = snapToSegments(360 * (getBits(8) / 0xFF), numSegments)

    if (angleSize !== 0) {
      const r1 = segmentThickness * i
      const r2 = segmentThickness * (i + 1) + 1
      
      svg.ele('path', {
        d: createPath(centerX, centerY, r1, r2, startingAngle, angleSize),
        fill: color
      })

      if (symmetryAxis !== undefined) {
        svg.ele('path', {
          d: createPath(centerX, centerY, r1, r2, (2 * symmetryAxis) - startingAngle - angleSize, angleSize),
          fill: color
        })
      }
    }
  }

  return svg.end()
}

const createPath: (
  centerX: number,
  centerY: number,
  r1: number,
  r2: number,
  startingAngle: number,
  angleSize: number
) => string = (centerX, centerY, r1, r2, startingAngle, angleSize) => {
  const corners = [
    polar2Cartesian({ r: r2, theta: startingAngle }),
    polar2Cartesian({ r: r2, theta: startingAngle + angleSize }),
    polar2Cartesian({ r: r1, theta: startingAngle + angleSize }),
    polar2Cartesian({ r: r1, theta: startingAngle })
  ]

  return  `M ${centerX + corners[0].x} ${centerY + corners[0].y} ` +
          `A ${r2} ${r2} 0 ${angleSize > 180 ? 1 : 0} 1 ${centerX + corners[1].x} ${centerY + corners[1].y} ` +
          `L ${centerX + corners[2].x} ${centerY + corners[2].y} ` +
          `A ${r1} ${r1} 0 ${angleSize > 180 ? 1 : 0} 0 ${centerX + corners[3].x} ${centerY + corners[3].y} ` +
          'Z'
}

const snapToSegments: (theta: number, numSegments: number) => number = (theta, numSegments) => {
  if (numSegments === Infinity) {
    return theta
  }

  const segmentSize = 360 / numSegments

  theta /= segmentSize
  theta = Math.round(theta)
  return theta * segmentSize
}
