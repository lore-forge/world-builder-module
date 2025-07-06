"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sparkles, Globe, MapPin, Users, BookOpen, Scroll, Wand2, Zap, Loader2, Volume2 } from "lucide-react"
import { aiGenerators } from "@/src/lib/ai-generators"
import { aiServiceUtils, AIServicesError } from "@/src/lib/ai-services"
import { AIStatusIndicator } from "@/src/components/ai-status-indicator"
import type { CharacterData, GeneratedWorld, GeneratedLocation, GeneratedLore, GeneratedEncounter, GeneratedNames } from "@/src/lib/ai-generators"

const generators = [
  {
    id: "world",
    title: "World Generator",
    description: "Generate entire fantasy worlds with geography, climate, and cultures",
    icon: Globe,
    status: "Available",
    category: "World Building",
  },
  {
    id: "location",
    title: "Location Generator",
    description: "Create detailed locations like cities, dungeons, and landmarks",
    icon: MapPin,
    status: "Available",
    category: "Locations",
  },
  {
    id: "npc",
    title: "NPC Generator",
    description: "Generate unique NPCs with personalities, backgrounds, and motivations",
    icon: Users,
    status: "Available",
    category: "Characters",
  },
  {
    id: "campaign",
    title: "Campaign Generator",
    description: "Create campaign hooks, plot lines, and adventure scenarios",
    icon: BookOpen,
    status: "Coming Soon",
    category: "Campaigns",
  },
  {
    id: "lore",
    title: "Lore Generator",
    description: "Generate histories, legends, and cultural details for your world",
    icon: Scroll,
    status: "Available",
    category: "Lore",
  },
  {
    id: "magic",
    title: "Magic System Generator",
    description: "Create unique magic systems with rules and limitations",
    icon: Wand2,
    status: "Coming Soon",
    category: "Systems",
  },
  {
    id: "encounter",
    title: "Encounter Generator",
    description: "Generate balanced combat encounters and social situations",
    icon: Zap,
    status: "Available",
    category: "Gameplay",
  },
  {
    id: "name",
    title: "Name Generator",
    description: "Generate names for people, places, organizations, and more",
    icon: Sparkles,
    status: "Available",
    category: "Utility",
  },
]

export function AIGeneratorsModule() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<any>(null)
  const [currentGenerator, setCurrentGenerator] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

  const handleGenerate = async (generatorId: string, customPrompt?: string) => {
    if (!customPrompt && !prompt.trim()) {
      setError('Please enter a prompt for generation')
      return
    }

    setIsGenerating(true)
    setError(null)
    setGeneratedContent(null)
    setAudioUrl(null)
    
    const finalPrompt = customPrompt || prompt

    try {
      let result: any
      
      switch (generatorId) {
        case 'world':
          result = await aiGenerators.generateWorld(finalPrompt)
          break
        case 'location':
          result = await aiGenerators.generateLocation(finalPrompt)
          break
        case 'npc':
          result = await aiGenerators.generateNPC(finalPrompt)
          break
        case 'lore':
          result = await aiGenerators.generateLore(finalPrompt)
          break
        case 'encounter':
          result = await aiGenerators.generateEncounter(finalPrompt)
          break
        case 'name':
          result = await aiGenerators.generateNames(finalPrompt)
          break
        default:
          throw new Error(`Generator ${generatorId} not implemented`)
      }
      
      setGeneratedContent(result)
      setCurrentGenerator(generatorId)
      
      // Generate voice narration for the content
      if (result && typeof result === 'object') {
        const textToNarrate = getTextForNarration(result, generatorId)
        if (textToNarrate) {
          try {
            const audioDataUrl = await aiGenerators.generateVoiceNarration(textToNarrate, 'narrator')
            setAudioUrl(audioDataUrl)
          } catch (voiceError) {
            console.warn('Voice generation failed:', voiceError)
          }
        }
      }
      
    } catch (err) {
      const errorMessage = err instanceof AIServicesError 
        ? err.message 
        : 'Generation failed. Please try again.'
      setError(errorMessage)
      console.error('Generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const getTextForNarration = (content: any, generatorId: string): string => {
    switch (generatorId) {
      case 'world':
        return content.description || ''
      case 'location':
        return content.description || ''
      case 'npc':
        return content.personaje_creado?.descripcion_fisica || content.personaje_creado?.trasfondo?.historia_personal || ''
      case 'lore':
        return content.content || ''
      case 'encounter':
        return content.description || ''
      case 'name':
        return `Generated names: ${content.names?.slice(0, 5).join(', ') || ''}` 
      default:
        return ''
    }
  }

  const playAudio = async () => {
    if (!audioUrl) return
    
    setIsPlayingAudio(true)
    try {
      await aiServiceUtils.playAudioFromDataUrl(audioUrl)
    } catch (err) {
      console.error('Audio playback failed:', err)
    } finally {
      setIsPlayingAudio(false)
    }
  }

  const renderGeneratedContent = () => {
    if (!generatedContent || !currentGenerator) return null

    switch (currentGenerator) {
      case 'world':
        const world = generatedContent as GeneratedWorld
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{world.name}</h3>
            <p className="text-muted-foreground">{world.description}</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold">Geography</h4>
                <p className="text-sm">{world.geography}</p>
              </div>
              <div>
                <h4 className="font-semibold">Climate</h4>
                <p className="text-sm">{world.climate}</p>
              </div>
              <div>
                <h4 className="font-semibold">Cultures</h4>
                <ul className="text-sm list-disc list-inside">
                  {world.cultures.map((culture, i) => <li key={i}>{culture}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold">Conflicts</h4>
                <ul className="text-sm list-disc list-inside">
                  {world.conflicts.map((conflict, i) => <li key={i}>{conflict}</li>)}
                </ul>
              </div>
            </div>
          </div>
        )
      
      case 'location':
        const location = generatedContent as GeneratedLocation
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{location.name}</h3>
            <Badge variant="outline">{location.type}</Badge>
            <p className="text-muted-foreground">{location.description}</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold">Inhabitants</h4>
                <p className="text-sm">{location.inhabitants}</p>
              </div>
              <div>
                <h4 className="font-semibold">Atmosphere</h4>
                <p className="text-sm">{location.atmosphere}</p>
              </div>
              <div>
                <h4 className="font-semibold">Features</h4>
                <ul className="text-sm list-disc list-inside">
                  {location.features.map((feature, i) => <li key={i}>{feature}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold">Adventure Hooks</h4>
                <ul className="text-sm list-disc list-inside">
                  {location.hooks.map((hook, i) => <li key={i}>{hook}</li>)}
                </ul>
              </div>
            </div>
          </div>
        )
      
      case 'npc':
        const npc = generatedContent as CharacterData
        const char = npc.personaje_creado
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">{char.informacion_basica.nombre_sugerido}</h3>
              <Badge variant="outline">{char.informacion_basica.titulo_o_apodo}</Badge>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold">Basic Info</h4>
                <p className="text-sm">Age: {char.informacion_basica.edad}</p>
                <p className="text-sm">Race: {char.informacion_basica.raza_sugerida}</p>
                <p className="text-sm">Origin: {char.informacion_basica.origen_geografico}</p>
              </div>
              <div>
                <h4 className="font-semibold">Archetype</h4>
                <p className="text-sm">{char.arquetipo}</p>
              </div>
              <div>
                <h4 className="font-semibold">Personality</h4>
                <p className="text-sm">{char.personalidad.motivaciones}</p>
              </div>
              <div>
                <h4 className="font-semibold">Background</h4>
                <p className="text-sm">{char.trasfondo.historia_personal}</p>
              </div>
            </div>
          </div>
        )
      
      case 'lore':
        const lore = generatedContent as GeneratedLore
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">{lore.title}</h3>
              <Badge variant="outline">{lore.type}</Badge>
            </div>
            <p className="text-muted-foreground">{lore.content}</p>
            <div>
              <h4 className="font-semibold">Significance</h4>
              <p className="text-sm">{lore.significance}</p>
            </div>
            <div>
              <h4 className="font-semibold">Connections</h4>
              <ul className="text-sm list-disc list-inside">
                {lore.connections.map((connection, i) => <li key={i}>{connection}</li>)}
              </ul>
            </div>
          </div>
        )
      
      case 'encounter':
        const encounter = generatedContent as GeneratedEncounter
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">Encounter</h3>
              <Badge variant="outline">{encounter.type}</Badge>
            </div>
            <p className="text-muted-foreground">{encounter.description}</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold">Participants</h4>
                <ul className="text-sm list-disc list-inside">
                  {encounter.participants.map((participant, i) => <li key={i}>{participant}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold">Objectives</h4>
                <ul className="text-sm list-disc list-inside">
                  {encounter.objectives.map((objective, i) => <li key={i}>{objective}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold">Challenges</h4>
                <ul className="text-sm list-disc list-inside">
                  {encounter.challenges.map((challenge, i) => <li key={i}>{challenge}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold">Rewards</h4>
                <ul className="text-sm list-disc list-inside">
                  {encounter.rewards.map((reward, i) => <li key={i}>{reward}</li>)}
                </ul>
              </div>
            </div>
          </div>
        )
      
      case 'name':
        const names = generatedContent as GeneratedNames
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{names.category}</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {names.names.map((name, i) => (
                <div key={i} className="p-2 border rounded">
                  <p className="font-medium">{name}</p>
                  <p className="text-xs text-muted-foreground">{names.origins[0] || 'Fantasy'}</p>
                </div>
              ))}
            </div>
          </div>
        )
      
      default:
        return <p>Generated content will appear here</p>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Generators</h2>
          <p className="text-muted-foreground">Use AI to generate content for your campaigns and worlds</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Powered by AI
          </Badge>
          <AIStatusIndicator showDetails />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {generators.map((generator) => (
          <Dialog key={generator.id}>
            <DialogTrigger asChild>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <generator.icon className="h-5 w-5" />
                      {generator.title}
                    </CardTitle>
                    <Badge variant={generator.status === "Available" ? "default" : "secondary"}>{generator.status}</Badge>
                  </div>
                  <CardDescription>{generator.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Badge variant="outline">{generator.category}</Badge>
                    <Button
                      className="w-full"
                      disabled={generator.status !== "Available"}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      {generator.status === "Available" ? "Generate" : "Coming Soon"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            
            {generator.status === "Available" && (
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <generator.icon className="h-5 w-5" />
                    {generator.title}
                  </DialogTitle>
                  <DialogDescription>{generator.description}</DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Prompt</label>
                    <Textarea
                      placeholder={`Describe what you want to generate for ${generator.title.toLowerCase()}...`}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleGenerate(generator.id)}
                      disabled={isGenerating || !prompt.trim()}
                      className="flex-1"
                    >
                      {isGenerating ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                      )}
                      {isGenerating ? 'Generating...' : 'Generate'}
                    </Button>
                    
                    {audioUrl && (
                      <Button
                        variant="outline"
                        onClick={playAudio}
                        disabled={isPlayingAudio}
                      >
                        {isPlayingAudio ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                  
                  {error && (
                    <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}
                  
                  {generatedContent && (
                    <div className="p-4 border rounded-lg bg-muted/50">
                      {renderGeneratedContent()}
                    </div>
                  )}
                </div>
              </DialogContent>
            )}
          </Dialog>
        ))}
      </div>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            AI Generation Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">• Be specific in your prompts for better results</p>
          <p className="text-sm text-muted-foreground">
            • Use generated content as inspiration and customize as needed
          </p>
          <p className="text-sm text-muted-foreground">
            • Combine multiple generators for comprehensive world building
          </p>
          <p className="text-sm text-muted-foreground">• Save your favorite generations for future reference</p>
        </CardContent>
      </Card>
    </div>
  )
}
