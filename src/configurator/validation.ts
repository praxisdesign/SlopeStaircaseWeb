import { PARAMETER_LIMITS } from './constants'
import { getStairGeometry } from './geometry'
import type { StairParameters } from './types'

export function getValidationIssues(params: StairParameters) {
  const issues: string[] = []
  const { stepCount, stepDepth, stepRise } = getStairGeometry(params)

  if (stepDepth < 240) {
    issues.push('Step depth is very short for the selected height and length.')
  }

  if (stepRise < PARAMETER_LIMITS.stepHeight.min || stepRise > PARAMETER_LIMITS.stepHeight.max) {
    issues.push(
      `Effective riser height (${stepRise.toFixed(0)}mm) falls outside the safe range (${PARAMETER_LIMITS.stepHeight.min}-${PARAMETER_LIMITS.stepHeight.max}mm) once rounded to a whole number of steps. Adjust Rise Height or Step Height.`,
    )
  }

  if (stepCount > 45) {
    issues.push('This design has many steps. Add platforms or reduce the height.')
  }

  if (params.platformCount === 0 && params.totalHeight > 3000) {
    issues.push('Consider adding a platform for taller stair runs.')
  }

  return issues
}
