"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Globe, MapPin, Users, BookOpen, Scroll, Wand2, Zap } from "lucide-react"

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
  const handleGenerate = (generatorId: string) => {
    // Placeholder for AI generation logic
    console.log(`Generating with ${generatorId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Generators</h2>
          <p className="text-muted-foreground">Use AI to generate content for your campaigns and worlds</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Powered by AI
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {generators.map((generator) => (
          <Card key={generator.id} className="hover:shadow-md transition-shadow">
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
                  onClick={() => handleGenerate(generator.id)}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {generator.status === "Available" ? "Generate" : "Coming Soon"}
                </Button>
              </div>
            </CardContent>
          </Card>
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
