import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Map, Mountain, Trees, Building, Waves, Cloud, MapPin, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useWorldBuilderAI } from '@/hooks/use-world-builder-ai'

interface TerrainGeneratorProps {
  onTerrainGenerated?: (terrainData: any) => void
}

const terrainTypes = [
  { value: 'mountains', label: 'Mountains', icon: Mountain },
  { value: 'forest', label: 'Forest', icon: Trees },
  { value: 'coastal', label: 'Coastal', icon: Waves },
  { value: 'urban', label: 'Urban', icon: Building },
  { value: 'plains', label: 'Plains', icon: Cloud },
  { value: 'mixed', label: 'Mixed Terrain', icon: Map }
]

const climateOptions = [
  'Temperate', 'Tropical', 'Arctic', 'Desert', 'Mediterranean', 'Monsoon'
]

export function AITerrainGenerator({ onTerrainGenerated }: TerrainGeneratorProps) {
  const [terrainType, setTerrainType] = useState('mixed')
  const [climate, setClimate] = useState('Temperate')
  const [description, setDescription] = useState('')
  const [features, setFeatures] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const { generateTerrain } = useWorldBuilderAI()

  const handleGenerate = async () => {
    if (!description) {
      toast.error('Please provide a terrain description')
      return
    }

    setIsGenerating(true)
    try {
      // In a real implementation, this would call the AI service
      const terrainData = await generateTerrain({
        type: terrainType,
        climate,
        description,
        features: features.split(',').map(f => f.trim()).filter(Boolean)
      })

      toast.success('Terrain generated successfully!')
      if (onTerrainGenerated) {
        onTerrainGenerated(terrainData)
      }
    } catch (error) {
      console.error('Failed to generate terrain:', error)
      toast.error('Failed to generate terrain')
    } finally {
      setIsGenerating(false)
    }
  }

  const SelectedIcon = terrainTypes.find(t => t.value === terrainType)?.icon || Map

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Terrain Generator
        </CardTitle>
        <CardDescription>
          Generate realistic terrain features and landscapes with AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Terrain Type</Label>
          <div className="grid grid-cols-3 gap-2">
            {terrainTypes.map((type) => {
              const Icon = type.icon
              return (
                <Button
                  key={type.value}
                  variant={terrainType === type.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTerrainType(type.value)}
                  className="justify-start"
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {type.label}
                </Button>
              )
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="climate">Climate</Label>
          <Select value={climate} onValueChange={setClimate}>
            <SelectTrigger id="climate">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {climateOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Terrain Description</Label>
          <Textarea
            id="description"
            placeholder="Describe the terrain you want to generate..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="features">
            Special Features <span className="text-muted-foreground">(comma-separated)</span>
          </Label>
          <Input
            id="features"
            placeholder="Rivers, lakes, caves, ruins, villages..."
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
          />
        </div>

        <div className="pt-2">
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Terrain...
              </>
            ) : (
              <>
                <SelectedIcon className="mr-2 h-4 w-4" />
                Generate {terrainTypes.find(t => t.value === terrainType)?.label}
              </>
            )}
          </Button>
        </div>

        {/* Preview Section */}
        <div className="border rounded-lg p-4 bg-muted/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Generation Preview</span>
            <Badge variant="secondary">
              <SelectedIcon className="mr-1 h-3 w-3" />
              {terrainTypes.find(t => t.value === terrainType)?.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            A {climate.toLowerCase()} {terrainType} terrain with: {features || 'no special features'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
