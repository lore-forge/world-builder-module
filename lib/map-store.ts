"use client"

import { create } from "zustand"

export type MapTool = "select" | "pan" | "brush" | "eraser" | "location" | "selection"

interface MapLayers {
  terrain: boolean
  political: boolean
  grid: boolean
}

interface Location {
  id: string
  x: number
  y: number
  name: string
  type: string
  description: string
}

interface DrawPath {
  id: string
  points: number[]
  color: string
  width: number
  tool: "brush" | "eraser"
}

interface MapState {
  selectedTool: MapTool
  isDrawing: boolean
  layers: MapLayers
  locations: Location[]
  paths: DrawPath[]

  setSelectedTool: (tool: MapTool) => void
  setIsDrawing: (drawing: boolean) => void
  toggleLayer: (layer: keyof MapLayers) => void
  addLocation: (location: Location) => void
  updateLocation: (id: string, updates: Partial<Location>) => void
  addPath: (path: DrawPath) => void
}

export const useMapStore = create<MapState>((set) => ({
  selectedTool: "select",
  isDrawing: false,
  layers: {
    terrain: true,
    political: false,
    grid: true,
  },
  locations: [
    {
      id: "1",
      x: 200,
      y: 150,
      name: "Capital City",
      type: "settlement",
      description: "The grand capital of the kingdom",
    },
    {
      id: "2",
      x: 400,
      y: 300,
      name: "Ancient Ruins",
      type: "dungeon",
      description: "Mysterious ruins from a forgotten age",
    },
  ],
  paths: [],

  setSelectedTool: (tool) => set({ selectedTool: tool }),
  setIsDrawing: (drawing) => set({ isDrawing: drawing }),
  toggleLayer: (layer) =>
    set((state) => ({
      layers: { ...state.layers, [layer]: !state.layers[layer] },
    })),
  addLocation: (location) =>
    set((state) => ({
      locations: [...state.locations, location],
    })),
  updateLocation: (id, updates) =>
    set((state) => ({
      locations: state.locations.map((loc) => (loc.id === id ? { ...loc, ...updates } : loc)),
    })),
  addPath: (path) =>
    set((state) => ({
      paths: [...state.paths, path],
    })),
}))
