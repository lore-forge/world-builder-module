import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Sparkles, Map, Loader2, Wand2, Info } from 'lucide-react'
import { toast } from 'sonner'
import { useWorldBuilderAI } from '@/hooks/use-world-builder-ai'

interface AIMapGeneratorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onMapGenerated?: (mapData: any) => void
}

const mapStyles = [
  { value: 'realistic', label: 'Realistic', description: 'Natural terrain with realistic features' },
  { value: 'fantasy', label: 'Fantasy', description: 'Magical landscapes with mystical elements' },
  { value: 'ancient', label: 'Ancient', description: 'Old-world style with hand-drawn feel' },
  { value: 'modern', label: 'Modern', description: 'Clean, contemporary cartography' },
  { value: 'artistic', label: 'Artistic', description: 'Stylized with creative interpretation' }
]

const worldSizes = [
  { value: 'small', label: 'Small Region', description: '~100 km²' },
  { value: 'medium', label: 'Province', description: '~1,000 km²' },
  { value: 'large', label: 'Kingdom', description: '~10,000 km²' },
  { value: 'huge', label: 'Continent', description: '~100,000 km²' }
]

export function AIMapGeneratorDialog({ open, onOpenChange, onMapGenerated }: AIMapGeneratorDialogProps) {
  const [worldName, setWorldName] = useState('')
  const [description, setDescription] = useState('')
  const [mapStyle, setMapStyle] = useState('fantasy')
  const [worldSize, setWorldSize] = useState('medium')
  const [complexity, setComplexity] = useState([3])
  const [features, setFeatures] = useState({
    cities: true,
    rivers: true,
    mountains: true,
    forests: true,
    roads: false,
    borders: false
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const { generateCompleteMap } = useWorldBuilderAI()

  const handleGenerate = async () => {
    if (!worldName.trim()) {
      toast.error('Please provide a world name')
      return
    }

    setIsGenerating(true)
    try {
      // Mock generation for now
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const generatedMap = {
        name: worldName,
        style: mapStyle,
        size: worldSize,
        complexity: complexity[0],
        features: Object.entries(features)
          .filter(([_, enabled]) => enabled)
          .map(([feature]) => feature),
        description,
        imageData: 'generated-map-placeholder',
        metadata: {
          generatedAt: new Date().toISOString(),
          aiModel: 'WorldBuilder AI v1.0'
        }
      }

      toast.success('Map generated successfully!')
      if (onMapGenerated) {
        onMapGenerated(generatedMap)
      }
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to generate map:', error)
      toast.error('Failed to generate map')
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleFeature = (feature: keyof typeof features) => {
    setFeatures(prev => ({ ...prev, [feature]: !prev[feature] }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Map Generator
          </DialogTitle>
          <DialogDescription>
            Generate a complete map with AI-powered terrain, locations, and features
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* World Name */}
          <div className="space-y-2">
            <Label htmlFor="world-name">World Name *</Label>
            <Input
              id="world-name"
              placeholder="Enter your world name..."
              value={worldName}
              onChange={(e) => setWorldName(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">World Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your world's geography, climate, and key features..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Map Style */}
          <div className="space-y-2">
            <Label>Map Style</Label>
            <div className="grid grid-cols-2 gap-3">
              {mapStyles.map((style) => (
                <div
                  key={style.value}
                  className={`rounded-lg border p-3 cursor-pointer transition-all ${
                    mapStyle === style.value
                      ? 'border-primary bg-primary/10'
                      : 'hover:border-muted-foreground'
                  }`}
                  onClick={() => setMapStyle(style.value)}
                >
                  <div className="font-medium">{style.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {style.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* World Size */}
          <div className="space-y-2">
            <Label htmlFor="world-size">World Size</Label>
            <Select value={worldSize} onValueChange={setWorldSize}>
              <SelectTrigger id="world-size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {worldSizes.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{size.label}</span>
                      <span className="text-muted-foreground ml-2">
                        {size.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Complexity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Map Complexity</Label>
              <span className="text-sm text-muted-foreground">
                Level {complexity[0]}
              </span>
            </div>
            <Slider
              value={complexity}
              onValueChange={setComplexity}
              min={1}
              max={5}
              step={1}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Simple</span>
              <span>Detailed</span>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <Label>Map Features</Label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(features).map(([feature, enabled]) => (
                <Badge
                  key={feature}
                  variant={enabled ? 'default' : 'outline'}
                  className="cursor-pointer capitalize"
                  onClick={() => toggleFeature(feature as keyof typeof features)}
                >
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="rounded-lg bg-muted/50 p-4">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  The AI will generate a complete map based on your specifications,
                  including terrain, settlements, and natural features.
                </p>
                <p>
                  Higher complexity levels add more detail but take longer to generate.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Map...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Map
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
