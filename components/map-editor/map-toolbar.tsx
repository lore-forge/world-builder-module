"use client"

import { Button } from "@/components/ui/button"
import { useMapStore } from "@/lib/map-store"
import { MousePointer, Paintbrush, Eraser, MapPin, Hand, Square } from "lucide-react"

const tools = [
  { id: "select", name: "Select", icon: MousePointer },
  { id: "pan", name: "Pan", icon: Hand },
  { id: "brush", name: "Terrain Brush", icon: Paintbrush },
  { id: "eraser", name: "Eraser", icon: Eraser },
  { id: "location", name: "Add Location", icon: MapPin },
  { id: "selection", name: "Selection", icon: Square },
] as const

export function MapToolbar() {
  const { selectedTool, setSelectedTool } = useMapStore()

  return (
    <div className="grid grid-cols-2 gap-2">
      {tools.map((tool) => (
        <Button
          key={tool.id}
          variant={selectedTool === tool.id ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedTool(tool.id)}
          className="flex flex-col gap-1 h-auto py-2"
        >
          <tool.icon className="h-4 w-4" />
          <span className="text-xs">{tool.name}</span>
        </Button>
      ))}
    </div>
  )
}
