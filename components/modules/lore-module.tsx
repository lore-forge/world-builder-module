"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Scroll, Crown, Zap } from "lucide-react"

const mockLore = [
  {
    id: "1",
    title: "The Great Dragon War",
    type: "Historical Event",
    world: "Mystral Kingdoms",
    description: "A legendary conflict between dragons and mortals that shaped the realm",
    icon: Zap,
    tags: ["war", "dragons", "history"],
  },
  {
    id: "2",
    title: "Order of the Silver Dawn",
    type: "Organization",
    world: "Mystral Kingdoms",
    description: "Elite order of paladins dedicated to protecting the innocent",
    icon: Crown,
    tags: ["organization", "paladins", "order"],
  },
  {
    id: "3",
    title: "The Whispering Prophecy",
    type: "Prophecy",
    world: "Mystral Kingdoms",
    description: "Ancient prophecy foretelling the return of magic to the world",
    icon: Scroll,
    tags: ["prophecy", "magic", "ancient"],
  },
]

export function LoreModule() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredLore = mockLore.filter(
    (lore) =>
      lore.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lore.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lore.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Lore</h2>
          <p className="text-muted-foreground">Document the history, legends, and knowledge of your worlds</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Lore Entry
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search lore..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredLore.map((lore) => (
          <Card key={lore.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <lore.icon className="h-5 w-5" />
                  {lore.title}
                </CardTitle>
                <Badge variant="outline">{lore.type}</Badge>
              </div>
              <CardDescription>{lore.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">World:</span> {lore.world}
                </div>
                <div className="flex flex-wrap gap-1">
                  {lore.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Read More
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
