import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sparkles, MapPin, Plus, Loader2, RefreshCw, Info } from 'lucide-react'
import { toast } from 'sonner'
import { useWorldBuilderAI } from '@/hooks/use-world-builder-ai'

interface Location {
  id: string
  name: string
  type: 'city' | 'town' | 'village' | 'landmark' | 'dungeon' | 'poi'
  description: string
  coordinates?: { x: number; y: number }
  significance: 'major' | 'minor' | 'hidden'
}

interface AILocationSuggesterProps {
  mapContext?: {
    terrain: string
    climate: string
    region?: string
  }
  onLocationAdd?: (location: Location) => void
}

const locationTypeColors = {
  city: 'bg-blue-500',
  town: 'bg-green-500',
  village: 'bg-yellow-500',
  landmark: 'bg-purple-500',
  dungeon: 'bg-red-500',
  poi: 'bg-gray-500'
}

const locationTypeIcons = {
  city: '🏰',
  town: '🏘️',
  village: '🏚️',
  landmark: '⛰️',
  dungeon: '🗝️',
  poi: '📍'
}

export function AILocationSuggester({ mapContext, onLocationAdd }: AILocationSuggesterProps) {
  const [suggestions, setSuggestions] = useState<Location[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set(['city', 'landmark']))
  const { generateLocationSuggestions } = useWorldBuilderAI()

  const generateSuggestions = async () => {
    setIsGenerating(true)
    try {
      // Mock AI suggestions for now
      const mockSuggestions: Location[] = [
        {
          id: '1',
          name: 'Crystalhaven',
          type: 'city',
          description: 'A magnificent port city built around ancient crystal formations',
          significance: 'major'
        },
        {
          id: '2',
          name: 'Whispering Woods',
          type: 'landmark',
          description: 'An ancient forest where the trees seem to speak in hushed tones',
          significance: 'minor'
        },
        {
          id: '3',
          name: 'Shadowkeep Ruins',
          type: 'dungeon',
          description: 'Abandoned fortress rumored to hold untold treasures and dangers',
          significance: 'hidden'
        },
        {
          id: '4',
          name: 'Riverside Market',
          type: 'town',
          description: 'A bustling trade hub where merchants from all lands converge',
          significance: 'major'
        },
        {
          id: '5',
          name: 'Elder\'s Rest',
          type: 'village',
          description: 'A peaceful settlement known for its wise council of elders',
          significance: 'minor'
        }
      ]

      // Filter based on selected types
      const filtered = mockSuggestions.filter(loc => selectedTypes.has(loc.type))
      setSuggestions(filtered)
      
      toast.success(`Generated ${filtered.length} location suggestions!`)
    } catch (error) {
      console.error('Failed to generate suggestions:', error)
      toast.error('Failed to generate location suggestions')
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    // Auto-generate on mount
    generateSuggestions()
  }, [])

  const toggleLocationType = (type: string) => {
    const newTypes = new Set(selectedTypes)
    if (newTypes.has(type)) {
      newTypes.delete(type)
    } else {
      newTypes.add(type)
    }
    setSelectedTypes(newTypes)
  }

  const addLocation = (location: Location) => {
    if (onLocationAdd) {
      // Generate random coordinates if not provided
      const coords = location.coordinates || {
        x: Math.random() * 800,
        y: Math.random() * 600
      }
      onLocationAdd({ ...location, coordinates: coords })
      toast.success(`Added ${location.name} to the map!`)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Location Suggestions
        </CardTitle>
        <CardDescription>
          Smart suggestions for interesting locations based on your map
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Location Type Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Location Types</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={generateSuggestions}
              disabled={isGenerating}
            >
              <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.keys(locationTypeColors).map((type) => (
              <Badge
                key={type}
                variant={selectedTypes.has(type) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => toggleLocationType(type)}
              >
                {locationTypeIcons[type as keyof typeof locationTypeIcons]} {type}
              </Badge>
            ))}
          </div>
        </div>

        {/* Context Info */}
        {mapContext && (
          <div className="rounded-lg bg-muted/50 p-3">
            <div className="flex items-center gap-2 text-sm">
              <Info className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Generating for: {mapContext.terrain} terrain, {mapContext.climate} climate
              </span>
            </div>
          </div>
        )}

        {/* Suggestions List */}
        <ScrollArea className="h-[300px] pr-4">
          {isGenerating ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : suggestions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No suggestions for selected types. Try selecting different location types.
            </div>
          ) : (
            <div className="space-y-3">
              {suggestions.map((location) => (
                <div
                  key={location.id}
                  className="group relative rounded-lg border p-3 transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {locationTypeIcons[location.type]}
                        </span>
                        <h4 className="font-semibold">{location.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {location.significance}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {location.description}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => addLocation(location)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Generate More Button */}
        <Button
          variant="outline"
          className="w-full"
          onClick={generateSuggestions}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <MapPin className="mr-2 h-4 w-4" />
              Generate More Suggestions
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
