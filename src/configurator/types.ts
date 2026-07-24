export type ToeStyle = 'none' | 'vertical' | 'horizontal'

export type CameraSnapshot = {
  position: [number, number, number]
  target: [number, number, number]
}

export type StairParameters = {
  width: number
  totalLength: number
  totalHeight: number
  stepHeight: number
  platformCount: number
  toeStyle: ToeStyle
  showDimensions: boolean
}
