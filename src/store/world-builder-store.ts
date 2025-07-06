import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { World, Map, Location, NPC, Campaign } from '@/types'

interface WorldBuilderState {
  // Current selections
  currentWorld: World | null
  currentMap: Map | null
  selectedLocation: Location | null
  selectedNPC: NPC | null
  
  // Editing state
  editorMode: 'view' | 'edit' | 'play'
  tool: 'select' | 'terrain' | 'location' | 'path' | 'erase'
  brushSize: number
  
  // UI state
  sidebarOpen: boolean
  mapZoom: number
  mapCenter: { x: number; y: number }
  
  // Actions
  setCurrentWorld: (world: World | null) => void
  setCurrentMap: (map: Map | null) => void
  selectLocation: (location: Location | null) => void
  selectNPC: (npc: NPC | null) => void
  setEditorMode: (mode: 'view' | 'edit' | 'play') => void
  setTool: (tool: string) => void
  setBrushSize: (size: number) => void
  toggleSidebar: () => void
  setMapView: (zoom: number, center: { x: number; y: number }) => void
}

export const useWorldBuilderStore = create<WorldBuilderState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        currentWorld: null,
        currentMap: null,
        selectedLocation: null,
        selectedNPC: null,
        editorMode: 'view',
        tool: 'select',
        brushSize: 10,
        sidebarOpen: true,
        mapZoom: 1,
        mapCenter: { x: 0, y: 0 },
        
        // Actions
        setCurrentWorld: (world) => set({ currentWorld: world }),
        setCurrentMap: (map) => set({ currentMap: map }),
        selectLocation: (location) => set({ selectedLocation: location }),
        selectNPC: (npc) => set({ selectedNPC: npc }),
        setEditorMode: (mode) => set({ editorMode: mode }),
        setTool: (tool) => set({ tool: tool as any }),
        setBrushSize: (size) => set({ brushSize: size }),
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        setMapView: (zoom, center) => set({ mapZoom: zoom, mapCenter: center }),
      }),
      {
        name: 'world-builder-storage',
        partialize: (state) => ({
          editorMode: state.editorMode,
          tool: state.tool,
          brushSize: state.brushSize,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    )
  )
)
