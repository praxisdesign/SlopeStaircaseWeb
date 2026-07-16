import type { StairParameters } from './types'

export function getValidationIssues(params: StairParameters) {
  const issues: string[] = []
  const estimatedSteps = params.totalHeight / params.stepHeight
  const stepDepth = params.totalLength / estimatedSteps

  if (stepDepth < 240) {
    issues.push('Step depth is very short for the selected height and length.')
  }

  if (estimatedSteps > 45) {
    issues.push('This design has many steps. Add platforms or reduce the height.')
  }

  if (params.platformCount === 0 && params.totalHeight > 3000) {
    issues.push('Consider adding a platform for taller stair runs.')
  }

  return issues
}
