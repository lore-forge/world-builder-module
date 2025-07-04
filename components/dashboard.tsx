"use client"

import { useAppStore } from "@/lib/store"
import { WorldsModule } from "@/components/modules/worlds-module"
import { MapEditorModule } from "@/components/modules/map-editor-module"
import { LocationsModule } from "@/components/modules/locations-module"
import { CampaignsModule } from "@/components/modules/campaigns-module"
import { NPCsModule } from "@/components/modules/npcs-module"
import { LoreModule } from "@/components/modules/lore-module"
import { AIGeneratorsModule } from "@/components/modules/ai-generators-module"
import { SettingsModule } from "@/components/modules/settings-module"
import { DashboardOverview } from "@/components/dashboard-overview"

export function Dashboard() {
  const currentModule = useAppStore((state) => state.currentModule)

  switch (currentModule) {
    case "worlds":
      return <WorldsModule />
    case "map-editor":
      return <MapEditorModule />
    case "locations":
      return <LocationsModule />
    case "campaigns":
      return <CampaignsModule />
    case "npcs":
      return <NPCsModule />
    case "lore":
      return <LoreModule />
    case "ai-generators":
      return <AIGeneratorsModule />
    case "settings":
      return <SettingsModule />
    default:
      return <DashboardOverview />
  }
}
