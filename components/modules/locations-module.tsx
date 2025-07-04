"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, MapPin, Mountain, Castle, Trees } from "lucide-react"

const mockLocations = [
  {
    id: "1",
    name: "Whispering Woods",
    type: "Forest",
    world: "Mystral Kingdoms",
    description: "Ancient forest filled with magical creatures",
    icon: Trees,
    color: "bg-green-500",
  },
  {
    id: "2",
    name: "Ironhold Fortress",
    type: "Fortress",
    world: "Mystral Kingdoms",
    description: "Massive stone fortress guarding the mountain pass",
    icon: Castle,
    color: "bg-gray-500",
  },
  {
    id: "3",
    name: "Dragon's Peak",
    type: "Mountain",
    world: "Mystral Kingdoms",
    description: "Towering mountain where ancient dragons once nested",
    icon: Mountain,
    color: "bg-stone-500",
  },
]

export function LocationsModule() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredLocations = mockLocations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Locations</h2>
          <p className="text-muted-foreground">Manage places of interest in your worlds</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Location
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredLocations.map((location) => (
          <Card key={location.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${location.color}`}>
                    <location.icon className="h-4 w-4 text-white" />
                  </div>
                  {location.name}
                </CardTitle>
                <Badge variant="outline">{location.type}</Badge>
              </div>
              <CardDescription>{location.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{location.world}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  View on Map
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
