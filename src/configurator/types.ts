export type ToeStyle = 'none' | 'vertical' | 'horizontal'

export type StairParameters = {
  width: number
  totalLength: number
  totalHeight: number
  stepHeight: number
  platformCount: number
  toeStyle: ToeStyle
  showDimensions: boolean
}
