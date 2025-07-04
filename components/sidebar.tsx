"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAppStore } from "@/lib/store"
import { Globe, Map, MapPin, Users, BookOpen, Scroll, Settings, Home, Sparkles } from "lucide-react"

interface SidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const navigation = [
  { name: "Dashboard", icon: Home, module: "dashboard" as const },
  { name: "Worlds", icon: Globe, module: "worlds" as const },
  { name: "Map Editor", icon: Map, module: "map-editor" as const },
  { name: "Locations", icon: MapPin, module: "locations" as const },
  { name: "Campaigns", icon: BookOpen, module: "campaigns" as const },
  { name: "NPCs", icon: Users, module: "npcs" as const },
  { name: "Lore", icon: Scroll, module: "lore" as const },
  { name: "AI Generators", icon: Sparkles, module: "ai-generators" as const },
  { name: "Settings", icon: Settings, module: "settings" as const },
]

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  const { currentModule, setCurrentModule } = useAppStore()

  return (
    <div className={cn("bg-card border-r transition-all duration-300 ease-in-out", open ? "w-64" : "w-16")}>
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b px-4">
          <div className={cn("flex items-center gap-2", !open && "justify-center")}>
            <Globe className="h-8 w-8 text-primary" />
            {open && (
              <div className="flex flex-col">
                <span className="text-sm font-semibold">World Builder</span>
                <span className="text-xs text-muted-foreground">Campaign Creator</span>
              </div>
            )}
          </div>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-2">
            {navigation.map((item) => (
              <Button
                key={item.name}
                variant={currentModule === item.module ? "secondary" : "ghost"}
                className={cn("w-full justify-start", !open && "px-2")}
                onClick={() => setCurrentModule(item.module)}
              >
                <item.icon className={cn("h-4 w-4", open && "mr-2")} />
                {open && item.name}
              </Button>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </div>
  )
}
