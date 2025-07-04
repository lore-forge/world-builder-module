"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSelector } from "@/components/language-selector"
import { Menu, User, LogOut, FileText } from "lucide-react"
import { useAppStore } from "@/lib/store"

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const currentModule = useAppStore((state) => state.currentModule)

  const getModuleTitle = () => {
    switch (currentModule) {
      case "dashboard":
        return "Dashboard"
      case "worlds":
        return "Worlds"
      case "map-editor":
        return "Map Editor"
      case "locations":
        return "Locations"
      case "campaigns":
        return "Campaigns"
      case "npcs":
        return "NPCs"
      case "lore":
        return "Lore"
      case "ai-generators":
        return "AI Generators"
      case "settings":
        return "Settings"
      default:
        return "Dashboard"
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onMenuClick}>
          <Menu className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-semibold">{getModuleTitle()}</h1>
      </div>

      <div className="flex items-center gap-4">
        <LanguageSelector />
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                <AvatarFallback>DM</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="mr-2 h-4 w-4" />
              <span>Documentation</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
