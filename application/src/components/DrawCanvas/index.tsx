import React, { memo, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { resetCanvasAction, setCoordinatesAction, IRectangleCoords } from "../../store/canvas/actions"
import { CanvasState } from "../../store/canvas/reducer"

function DrawCanvas() {
  const dispatch = useDispatch()
  const resetCanvas = useSelector((state: CanvasState) => state.data.reset)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rectangleCoords: IRectangleCoords = {
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  }
  let canvasContext: CanvasRenderingContext2D | null;
  let dragging: boolean = false;

  const mouseDown = (event: MouseEvent) => {
    dragging = true;
    rectangleCoords.startX = event.offsetX;
    rectangleCoords.startY = event.offsetY;
  }
  const mouseUp = (_: MouseEvent) => {
    dragging = false;
    dispatch(setCoordinatesAction(rectangleCoords))
  }
  const mouseMove = (event: MouseEvent) => {
    if (!dragging) {
      return;
    }
    
    canvasContext!.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    rectangleCoords.endX = event.offsetX;
    rectangleCoords.endY = event.offsetY;

    const width = event.offsetX - rectangleCoords.startX;
    const height = event.offsetY - rectangleCoords.startY;
    canvasContext!.fillRect(rectangleCoords.startX, rectangleCoords.startY, width, height)
  }

  useEffect(() => {
    if (canvasRef.current === null) {
      return
    }

    canvasContext = canvasRef.current.getContext('2d')
    canvasContext!.fillStyle = '#FFFFFF'
    canvasRef.current.addEventListener('mousedown', mouseDown, false);
    canvasRef.current.addEventListener('mouseup', mouseUp, false);
    canvasRef.current.addEventListener('mousemove', mouseMove, false);
  }, [])

  useEffect(() => {
    if (!resetCanvas) {
      return;
    }

    canvasContext = canvasRef!.current!.getContext('2d')
    canvasContext!.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    dispatch(resetCanvasAction(false))
  }, [resetCanvas])

  return <canvas ref={canvasRef} width={700} height={700} />
}

export default memo(DrawCanvas)