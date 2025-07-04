"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Module =
  | "dashboard"
  | "worlds"
  | "map-editor"
  | "locations"
  | "campaigns"
  | "npcs"
  | "lore"
  | "ai-generators"
  | "settings"

interface World {
  id: string
  name: string
  description: string
  genre?: string
  setting?: string
  status: "active" | "archived"
  campaigns: number
  locations: number
  createdAt: string
}

interface Campaign {
  id: string
  name: string
  description: string
  world: string
  players: number
  status: "planning" | "active" | "completed" | "paused"
  startDate: string
}

interface NPC {
  id: string
  name: string
  description: string
  role: string
  location: string
  campaign: string
  status: "alive" | "dead" | "missing"
}

interface AppState {
  currentModule: Module
  language: "en" | "es"
  worlds: World[]
  campaigns: Campaign[]
  npcs: NPC[]

  setCurrentModule: (module: Module) => void
  setLanguage: (language: "en" | "es") => void
  addWorld: (world: World) => void
  addCampaign: (campaign: Campaign) => void
  addNPC: (npc: NPC) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentModule: "dashboard",
      language: "en",
      worlds: [
        {
          id: "1",
          name: "Mystral Kingdoms",
          description: "A high fantasy realm filled with magic and ancient mysteries",
          genre: "fantasy",
          setting: "medieval",
          status: "active",
          campaigns: 2,
          locations: 15,
          createdAt: "2024-01-15",
        },
        {
          id: "2",
          name: "Neon Shadows",
          description: "A cyberpunk dystopia where technology and humanity collide",
          genre: "sci-fi",
          setting: "futuristic",
          status: "active",
          campaigns: 1,
          locations: 8,
          createdAt: "2024-02-03",
        },
      ],
      campaigns: [
        {
          id: "1",
          name: "The Dragon's Hoard",
          description: "Ancient dragons have returned to reclaim their treasure",
          world: "Mystral Kingdoms",
          players: 4,
          status: "active",
          startDate: "2024-01-20",
        },
        {
          id: "2",
          name: "Shadows of the Past",
          description: "Uncover the secrets of a forgotten civilization",
          world: "Mystral Kingdoms",
          players: 5,
          status: "planning",
          startDate: "2024-03-01",
        },
        {
          id: "3",
          name: "Corporate Espionage",
          description: "Navigate the dangerous world of mega-corporations",
          world: "Neon Shadows",
          players: 3,
          status: "active",
          startDate: "2024-02-10",
        },
      ],
      npcs: [
        {
          id: "1",
          name: "Elara the Wise",
          description: "An ancient elven sage with knowledge of forgotten magics",
          role: "Sage",
          location: "Crystal Tower",
          campaign: "The Dragon's Hoard",
          status: "alive",
        },
        {
          id: "2",
          name: "Marcus Ironforge",
          description: "A dwarven blacksmith known for crafting legendary weapons",
          role: "Blacksmith",
          location: "Ironhold Fortress",
          campaign: "The Dragon's Hoard",
          status: "alive",
        },
        {
          id: "3",
          name: "Zara Chrome",
          description: "A skilled netrunner with connections in the underground",
          role: "Hacker",
          location: "The Undercity",
          campaign: "Corporate Espionage",
          status: "alive",
        },
      ],

      setCurrentModule: (module) => set({ currentModule: module }),
      setLanguage: (language) => set({ language }),
      addWorld: (world) => set((state) => ({ worlds: [...state.worlds, world] })),
      addCampaign: (campaign) => set((state) => ({ campaigns: [...state.campaigns, campaign] })),
      addNPC: (npc) => set((state) => ({ npcs: [...state.npcs, npc] })),
    }),
    {
      name: "rpg-world-builder-storage",
    },
  ),
)
