import type { StairParameters } from './types'

export const DEFAULT_PARAMETERS: StairParameters = {
  width: 1000,
  totalLength: 6000,
  totalHeight: 2000,
  stepHeight: 200,
  platformCount: 0,
  toeStyle: 'none',
  showDimensions: true,
}

export const PARAMETER_LIMITS = {
  width: { min: 800, max: 1500, step: 50 },
  totalLength: { min: 500, max: 30000, step: 100 },
  totalHeight: { min: 500, max: 9500, step: 100 },
  stepHeight: { min: 120, max: 210, step: 5 },
  platformCount: { min: 0, max: 2, step: 1 },
} as const
