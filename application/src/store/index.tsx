import { createStore } from "redux"
import canvasStore from "./canvas/reducer"

export const store = createStore(canvasStore, (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__())
