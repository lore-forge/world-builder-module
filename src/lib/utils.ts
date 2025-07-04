import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date for display
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Debounce function for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function for performance
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Calculate map coordinates from pixel position
export function pixelToMapCoords(
  pixelX: number,
  pixelY: number,
  mapScale: number,
  mapCenter: { x: number; y: number },
  zoom: number
): { x: number; y: number } {
  return {
    x: (pixelX - mapCenter.x) / zoom / mapScale,
    y: (pixelY - mapCenter.y) / zoom / mapScale
  }
}

// Calculate pixel position from map coordinates
export function mapToPixelCoords(
  mapX: number,
  mapY: number,
  mapScale: number,
  mapCenter: { x: number; y: number },
  zoom: number
): { x: number; y: number } {
  return {
    x: mapX * mapScale * zoom + mapCenter.x,
    y: mapY * mapScale * zoom + mapCenter.y
  }
}

// Validate world name
export function isValidWorldName(name: string): boolean {
  return name.length >= 3 && name.length <= 50 && /^[a-zA-Z0-9\s'-]+$/.test(name)
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
