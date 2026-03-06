export interface WsResizeMessage {
  type: 'resize'
  cols: number
  rows: number
}

export interface WsReplayMessage {
  type: 'replay'
  data: string
}

export interface WsErrorMessage {
  type: 'error'
  message: string
}

export type WsControlMessage = WsResizeMessage | WsReplayMessage | WsErrorMessage
