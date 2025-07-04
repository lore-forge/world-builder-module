"use client"

// This component is no longer needed with the Canvas implementation
// Location rendering is now handled directly in the map-editor component

export interface LocationMarkerProps {
  location: {
    id: string
    x: number
    y: number
    name: string
    type: string
    description: string
  }
}

// Utility function for location colors
export const getLocationColor = (type: string) => {
  switch (type) {
    case "settlement":
      return "#3b82f6"
    case "dungeon":
      return "#dc2626"
    case "landmark":
      return "#059669"
    default:
      return "#6b7280"
  }
}

// Placeholder component for compatibility
export function LocationMarker({ location }: LocationMarkerProps) {
  return null
}
