"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAppStore } from "@/lib/store"
import { NPCDialog } from "@/components/dialogs/npc-dialog"
import { Plus, Search, Users, Crown, Sword, Wand2 } from "lucide-react"

export function NPCsModule() {
  const { npcs } = useAppStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const filteredNPCs = npcs.filter(
    (npc) =>
      npc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      npc.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "noble":
        return Crown
      case "warrior":
        return Sword
      case "mage":
        return Wand2
      default:
        return Users
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">NPCs</h2>
          <p className="text-muted-foreground">Manage non-player characters in your campaigns</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create NPC
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search NPCs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredNPCs.map((npc) => {
          const RoleIcon = getRoleIcon(npc.role)
          return (
            <Card key={npc.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                    <AvatarFallback>
                      {npc.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {npc.name}
                      <RoleIcon className="h-4 w-4 text-muted-foreground" />
                    </CardTitle>
                    <CardDescription>{npc.role}</CardDescription>
                  </div>
                  <Badge variant="outline">{npc.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{npc.description}</p>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Location:</span> {npc.location}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Campaign:</span> {npc.campaign}
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <NPCDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </div>
  )
}
