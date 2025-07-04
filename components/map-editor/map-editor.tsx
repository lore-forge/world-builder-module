"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { MapToolbar } from "./map-toolbar"
import { MapLayers } from "./map-layers"
import { useMapStore } from "@/lib/map-store"
import { ZoomIn, ZoomOut, RotateCcw, Save, Download, Sparkles } from "lucide-react"

export function MapEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const { selectedTool, layers, locations, addLocation } = useMapStore()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Apply transformations
    ctx.save()
    ctx.translate(offset.x, offset.y)
    ctx.scale(scale, scale)

    // Draw grid if enabled
    if (layers.grid) {
      drawGrid(ctx, canvas.width, canvas.height)
    }

    // Draw locations
    locations.forEach((location) => {
      drawLocation(ctx, location)
    })

    ctx.restore()
  }, [layers, locations, scale, offset])

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.5

    const gridSize = 40

    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    ctx.globalAlpha = 1
  }

  const drawLocation = (ctx: CanvasRenderingContext2D, location: any) => {
    const color = location.type === "settlement" ? "#3b82f6" : location.type === "dungeon" ? "#dc2626" : "#059669"

    // Draw marker
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(location.x, location.y, 8, 0, 2 * Math.PI)
    ctx.fill()

    // Draw border
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw label
    ctx.fillStyle = "#374151"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"
    ctx.fillText(location.name, location.x, location.y + 25)
  }

  const getCanvasPoint = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left - offset.x) / scale,
      y: (e.clientY - rect.top - offset.y) / scale,
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getCanvasPoint(e)

    if (selectedTool === "location") {
      const newLocation = {
        id: Date.now().toString(),
        x: point.x,
        y: point.y,
        name: `Location ${locations.length + 1}`,
        type: "settlement",
        description: "A new location",
      }
      addLocation(newLocation)
    } else if (selectedTool === "brush") {
      setIsDrawing(true)
      setLastPoint(point)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || selectedTool !== "brush" || !lastPoint) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const currentPoint = getCanvasPoint(e)

    ctx.save()
    ctx.translate(offset.x, offset.y)
    ctx.scale(scale, scale)

    ctx.strokeStyle = "#059669"
    ctx.lineWidth = 4
    ctx.lineCap = "round"
    ctx.beginPath()
    ctx.moveTo(lastPoint.x, lastPoint.y)
    ctx.lineTo(currentPoint.x, currentPoint.y)
    ctx.stroke()

    ctx.restore()
    setLastPoint(currentPoint)
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
    setLastPoint(null)
  }

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    const newScale = Math.max(0.1, Math.min(5, scale * delta))
    setScale(newScale)
  }

  const zoomIn = () => setScale((prev) => Math.min(prev * 1.2, 5))
  const zoomOut = () => setScale((prev) => Math.max(prev / 1.2, 0.1))
  const resetView = () => {
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }

  return (
    <div className="flex h-full gap-4">
      {/* Left Sidebar - Tools */}
      <Card className="w-64 p-4 space-y-4">
        <div>
          <h3 className="font-semibold mb-3">Tools</h3>
          <MapToolbar />
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-3">Layers</h3>
          <MapLayers />
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-3">View Controls</h3>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={zoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={zoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={resetView}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Zoom: {Math.round(scale * 100)}%</label>
              <Slider
                value={[scale]}
                onValueChange={([value]) => setScale(value)}
                min={0.1}
                max={5}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Button className="w-full bg-transparent" variant="outline">
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Terrain with AI
          </Button>
          <Button className="w-full bg-transparent" variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Save Map
          </Button>
          <Button className="w-full bg-transparent" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </Card>

      {/* Main Canvas Area */}
      <Card className="flex-1 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">World Map Editor</h3>
            <p className="text-sm text-muted-foreground">Use the tools to create and edit your world map</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Tool: {selectedTool}</Badge>
            <Badge variant="outline">Locations: {locations.length}</Badge>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          />
        </div>
      </Card>
    </div>
  )
}
