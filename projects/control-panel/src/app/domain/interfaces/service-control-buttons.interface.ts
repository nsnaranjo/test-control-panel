export type ButtonType = 'start' | 'stop' | 'restart' | 'terminal' | 'runLog' | 'observation'

export interface ServiceControlButtonsInterface {
  type: ButtonType
  visible: boolean
  tooltip: string
  svgTemplate?: any
}
