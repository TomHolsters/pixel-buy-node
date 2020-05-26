import { Action, IRectangleCoords, ActionTypes } from "./actions"

export type CanvasState = {
  data: {
    coordinates: IRectangleCoords;
    reset: boolean;
  }
}

const initialState: CanvasState = {
  data: {
    coordinates: {
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0
    },
    reset: false
  }
}

export default (state = initialState, action: Action): CanvasState => {
  switch (action.type) {
    case ActionTypes.SET_COORDS:
      return {
        ...state,
        data: {
          ...state.data,
          coordinates: action.payload
        }
      }
    case ActionTypes.RESET_CANVAS:
      return {
        ...state,
        data: {
          ...state.data,
          reset: action.payload
        }
      }
    default:
      return {
        ...state
      }
  }
}
