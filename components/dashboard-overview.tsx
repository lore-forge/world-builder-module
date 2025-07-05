"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { Globe, Map, MapPin, Users, BookOpen, Plus, Activity, TrendingUp, Sparkles, Wand2 } from "lucide-react"
import { AIServiceStatus } from "@/components/ai/ai-service-status"
import { QuickAIGeneration } from "@/components/ai/quick-ai-generation"
import { RecentAIGenerations } from "@/components/ai/recent-ai-generations"
import { AIGenerationStats } from "@/components/ai/ai-generation-stats"

export function DashboardOverview() {
  const { setCurrentModule, worlds, campaigns, npcs } = useAppStore()

  const stats = [
    {
      title: "Active Worlds",
      value: worlds.length,
      icon: Globe,
      description: "Worlds created",
      trend: "+2 this week",
      gradient: "from-blue-500/10 to-cyan-500/10",
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Running Campaigns",
      value: campaigns.filter((c) => c.status === "active").length,
      icon: BookOpen,
      description: "Active campaigns",
      trend: "+1 this month",
      gradient: "from-purple-500/10 to-pink-500/10",
      iconColor: "text-purple-600 dark:text-purple-400"
    },
    {
      title: "Total NPCs",
      value: npcs.length,
      icon: Users,
      description: "Characters created",
      trend: "+12 this week",
      gradient: "from-green-500/10 to-emerald-500/10",
      iconColor: "text-green-600 dark:text-green-400"
    },
    {
      title: "Locations Mapped",
      value: 47,
      icon: MapPin,
      description: "Unique locations",
      trend: "+8 this week",
      gradient: "from-orange-500/10 to-red-500/10",
      iconColor: "text-orange-600 dark:text-orange-400"
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            Welcome back, Dungeon Master!
          </h2>
          <p className="text-muted-foreground mt-1">
            Ready to create amazing adventures? Here's what's happening in your worlds.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCurrentModule("ai-generators")}>
            <Wand2 className="mr-2 h-4 w-4" />
            AI Tools
          </Button>
          <Button onClick={() => setCurrentModule("worlds")}>
            <Plus className="mr-2 h-4 w-4" />
            Create World
          </Button>
        </div>
      </div>

      {/* AI Service Status */}
      <AIServiceStatus />

      {/* Stats Grid with enhanced styling */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient}`} />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm`}>
                <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <div className="flex items-center pt-1">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-500">{stat.trend}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Generation Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <QuickAIGeneration />
        <AIGenerationStats />
      </div>

      {/* Quick Actions with improved styling */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden" 
          onClick={() => setCurrentModule("worlds")}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Manage Worlds
            </CardTitle>
            <CardDescription>Create and organize your campaign worlds</CardDescription>
          </CardHeader>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden"
          onClick={() => setCurrentModule("map-editor")}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5 text-green-600 dark:text-green-400" />
              Map Editor
            </CardTitle>
            <CardDescription>Design detailed maps for your adventures</CardDescription>
          </CardHeader>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden"
          onClick={() => setCurrentModule("ai-generators")}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              AI Generators
            </CardTitle>
            <CardDescription>Generate content with AI assistance</CardDescription>
          </CardHeader>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden"
          onClick={() => setCurrentModule("campaigns")}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              Campaigns
            </CardTitle>
            <CardDescription>Manage your ongoing adventures</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Recent Activity & AI Generations */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentAIGenerations />
        
        <Card>
          <CardHeader>
            <CardTitle>Active Campaigns</CardTitle>
            <CardDescription>Your currently running adventures</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {campaigns.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No active campaigns yet</p>
                <Button variant="outline" size="sm" onClick={() => setCurrentModule("campaigns")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Campaign
                </Button>
              </div>
            ) : (
              campaigns.slice(0, 4).map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="text-sm font-medium">{campaign.name}</p>
                    <p className="text-xs text-muted-foreground">{campaign.world}</p>
                  </div>
                  <Badge variant={campaign.status === "active" ? "default" : "secondary"}>{campaign.status}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
