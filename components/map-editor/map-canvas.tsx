"use client"

import { useRef, useState, useEffect } from 'react'
import { Stage, Layer, Rect, Circle, Text, Line } from 'react-konva'
import Konva from 'konva'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { 
  MousePointer2, 
  Pencil, 
  Square, 
  Circle as CircleIcon, 
  Type, 
  Eraser,
  Download,
  Upload,
  ZoomIn,
  ZoomOut,
  Move
} from 'lucide-react'

interface MapCanvasProps {
  width?: number
  height?: number
  onSave?: (imageData: string) => void
}

type Tool = 'select' | 'pen' | 'rectangle' | 'circle' | 'text' | 'eraser' | 'pan'

export function MapCanvas({ width = 800, height = 600, onSave }: MapCanvasProps) {
  const stageRef = useRef<Konva.Stage>(null)
  const [tool, setTool] = useState<Tool>('select')
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPath, setCurrentPath] = useState<number[]>([])
  const [shapes, setShapes] = useState<any[]>([])
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [brushSize, setBrushSize] = useState(5)
  const [color, setColor] = useState('#000000')

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (tool === 'pan') return
    
    setIsDrawing(true)
    const pos = e.target.getStage()?.getPointerPosition()
    if (!pos) return

    const scaledPos = {
      x: (pos.x - position.x) / scale,
      y: (pos.y - position.y) / scale
    }

    switch (tool) {
      case 'pen':
        setCurrentPath([scaledPos.x, scaledPos.y])
        break
      case 'rectangle':
        setShapes([...shapes, {
          type: 'rectangle',
          x: scaledPos.x,
          y: scaledPos.y,
          width: 0,
          height: 0,
          stroke: color,
          strokeWidth: brushSize,
          id: Date.now().toString()
        }])
        break
      case 'circle':
        setShapes([...shapes, {
          type: 'circle',
          x: scaledPos.x,
          y: scaledPos.y,
          radius: 0,
          stroke: color,
          strokeWidth: brushSize,
          id: Date.now().toString()
        }])
        break
      case 'text':
        const text = prompt('Enter text:')
        if (text) {
          setShapes([...shapes, {
            type: 'text',
            x: scaledPos.x,
            y: scaledPos.y,
            text: text,
            fontSize: 16,
            fill: color,
            id: Date.now().toString()
          }])
        }
        setIsDrawing(false)
        break
    }
  }

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDrawing) return
    
    const pos = e.target.getStage()?.getPointerPosition()
    if (!pos) return

    const scaledPos = {
      x: (pos.x - position.x) / scale,
      y: (pos.y - position.y) / scale
    }

    switch (tool) {
      case 'pen':
        setCurrentPath([...currentPath, scaledPos.x, scaledPos.y])
        break
      case 'rectangle':
        const lastRect = shapes[shapes.length - 1]
        if (lastRect && lastRect.type === 'rectangle') {
          const newShapes = [...shapes]
          newShapes[newShapes.length - 1] = {
            ...lastRect,
            width: scaledPos.x - lastRect.x,
            height: scaledPos.y - lastRect.y
          }
          setShapes(newShapes)
        }
        break
      case 'circle':
        const lastCircle = shapes[shapes.length - 1]
        if (lastCircle && lastCircle.type === 'circle') {
          const newShapes = [...shapes]
          const radius = Math.sqrt(
            Math.pow(scaledPos.x - lastCircle.x, 2) + 
            Math.pow(scaledPos.y - lastCircle.y, 2)
          )
          newShapes[newShapes.length - 1] = {
            ...lastCircle,
            radius: radius
          }
          setShapes(newShapes)
        }
        break
    }
  }

  const handleMouseUp = () => {
    if (!isDrawing) return
    setIsDrawing(false)

    if (tool === 'pen' && currentPath.length > 0) {
      setShapes([...shapes, {
        type: 'line',
        points: currentPath,
        stroke: color,
        strokeWidth: brushSize,
        tension: 0.5,
        lineCap: 'round',
        lineJoin: 'round',
        id: Date.now().toString()
      }])
      setCurrentPath([])
    }
  }

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault()
    const scaleBy = 1.1
    const stage = stageRef.current
    if (!stage) return

    const oldScale = scale
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy
    
    setScale(Math.min(Math.max(0.1, newScale), 10))
  }

  const handleExport = () => {
    const stage = stageRef.current
    if (!stage) return
    
    const dataURL = stage.toDataURL()
    if (onSave) {
      onSave(dataURL)
    } else {
      // Download the image
      const link = document.createElement('a')
      link.download = 'map.png'
      link.href = dataURL
      link.click()
    }
  }

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the canvas?')) {
      setShapes([])
      setCurrentPath([])
    }
  }

  const renderShape = (shape: any) => {
    switch (shape.type) {
      case 'rectangle':
        return <Rect key={shape.id} {...shape} />
      case 'circle':
        return <Circle key={shape.id} {...shape} />
      case 'line':
        return <Line key={shape.id} {...shape} />
      case 'text':
        return <Text key={shape.id} {...shape} />
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center gap-4 p-4 bg-card rounded-lg border">
        <ToggleGroup type="single" value={tool} onValueChange={(value: string) => value && setTool(value as Tool)}>
          <ToggleGroupItem value="select" aria-label="Select">
            <MousePointer2 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="pen" aria-label="Pen">
            <Pencil className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="rectangle" aria-label="Rectangle">
            <Square className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="circle" aria-label="Circle">
            <CircleIcon className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="text" aria-label="Text">
            <Type className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="eraser" aria-label="Eraser">
            <Eraser className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="pan" aria-label="Pan">
            <Move className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="flex items-center gap-2">
          <label className="text-sm">Brush Size:</label>
          <Slider
            value={[brushSize]}
            onValueChange={([value]) => setBrushSize(value)}
            min={1}
            max={50}
            step={1}
            className="w-24"
          />
          <span className="text-sm w-8">{brushSize}</span>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm">Color:</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Button size="sm" variant="outline" onClick={() => setScale(scale * 1.2)}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => setScale(scale / 1.2)}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm">{Math.round(scale * 100)}%</span>
        </div>

        <Button size="sm" variant="outline" onClick={handleClear}>
          Clear
        </Button>
        <Button size="sm" variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Canvas */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <Stage
          ref={stageRef}
          width={width}
          height={height}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          onWheel={handleWheel}
          scaleX={scale}
          scaleY={scale}
          x={position.x}
          y={position.y}
          draggable={tool === 'pan'}
          onDragEnd={(e) => {
            setPosition({
              x: e.target.x(),
              y: e.target.y()
            })
          }}
        >
          <Layer>
            {/* Grid background */}
            <Rect
              x={0}
              y={0}
              width={width / scale}
              height={height / scale}
              fill="#f8f8f8"
            />
            
            {/* Render all shapes */}
            {shapes.map(renderShape)}
            
            {/* Current drawing path */}
            {tool === 'pen' && currentPath.length > 0 && (
              <Line
                points={currentPath}
                stroke={color}
                strokeWidth={brushSize}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
              />
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  )
}
