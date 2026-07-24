import type { StairParameters } from './types'

export interface StairGeometry {
  stepCount: number
  stepDepth: number
  stepRise: number
  totalLength: number
  totalRise: number
}

// Single source of truth for step count / effective riser & tread depth. Both the 3D
// model and the validation checks must derive these the same way — the actual riser
// used to build the stair is totalHeight divided by the *rounded* step count, not the
// raw totalHeight/stepHeight ratio, so anything validating against stepHeight limits
// has to check this rounded value or it can miss real out-of-range risers.
export function getStairGeometry(params: StairParameters): StairGeometry {
  const stepCount = Math.max(1, Math.round(params.totalHeight / params.stepHeight))
  const stepDepth = params.totalLength / stepCount
  const stepRise = params.totalHeight / stepCount
  return {
    stepCount,
    stepDepth,
    stepRise,
    totalLength: stepDepth * stepCount,
    totalRise: stepRise * stepCount,
  }
}
