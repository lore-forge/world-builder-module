"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useMapStore } from "@/lib/map-store"

export function MapLayers() {
  const { layers, toggleLayer } = useMapStore()

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="terrain-layer">Terrain</Label>
        <Switch id="terrain-layer" checked={layers.terrain} onCheckedChange={() => toggleLayer("terrain")} />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="political-layer">Political</Label>
        <Switch id="political-layer" checked={layers.political} onCheckedChange={() => toggleLayer("political")} />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="grid-layer">Grid</Label>
        <Switch id="grid-layer" checked={layers.grid} onCheckedChange={() => toggleLayer("grid")} />
      </div>
    </div>
  )
}
