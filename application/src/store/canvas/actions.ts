export interface IRectangleCoords {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export enum ActionTypes {
  SET_COORDS = "SET_COORDS",
  RESET_CANVAS = "RESET_CANVAS"
}

export type SetCoordinatesAction = {
  type: ActionTypes.SET_COORDS;
  payload: IRectangleCoords;
}

export type ResetCanvasAction = {
  type: ActionTypes.RESET_CANVAS;
  payload: boolean
}

export type Action = SetCoordinatesAction | ResetCanvasAction

export function setCoordinatesAction(payload: IRectangleCoords): SetCoordinatesAction {
  return {
    type: ActionTypes.SET_COORDS,
    payload
  }
}

export function resetCanvasAction(payload: boolean): ResetCanvasAction {
  return {
    type: ActionTypes.RESET_CANVAS,
    payload
  }
}
