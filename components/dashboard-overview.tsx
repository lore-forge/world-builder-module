"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { Globe, Map, MapPin, Users, BookOpen, Plus, Activity, TrendingUp } from "lucide-react"

export function DashboardOverview() {
  const { setCurrentModule, worlds, campaigns, npcs } = useAppStore()

  const stats = [
    {
      title: "Active Worlds",
      value: worlds.length,
      icon: Globe,
      description: "Worlds created",
      trend: "+2 this week",
    },
    {
      title: "Running Campaigns",
      value: campaigns.filter((c) => c.status === "active").length,
      icon: BookOpen,
      description: "Active campaigns",
      trend: "+1 this month",
    },
    {
      title: "Total NPCs",
      value: npcs.length,
      icon: Users,
      description: "Characters created",
      trend: "+12 this week",
    },
    {
      title: "Locations Mapped",
      value: 47,
      icon: MapPin,
      description: "Unique locations",
      trend: "+8 this week",
    },
  ]

  const recentActivity = [
    { action: "Created new world", item: "Mystral Kingdoms", time: "2 hours ago" },
    { action: "Updated campaign", item: "The Dragon's Hoard", time: "5 hours ago" },
    { action: "Added NPC", item: "Elara the Wise", time: "1 day ago" },
    { action: "Generated location", item: "Whispering Woods", time: "2 days ago" },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, Dungeon Master!</h2>
          <p className="text-muted-foreground">
            Ready to create amazing adventures? Here's what's happening in your worlds.
          </p>
        </div>
        <Button onClick={() => setCurrentModule("worlds")}>
          <Plus className="mr-2 h-4 w-4" />
          Create New World
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
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

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentModule("worlds")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Manage Worlds
            </CardTitle>
            <CardDescription>Create and organize your campaign worlds</CardDescription>
          </CardHeader>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setCurrentModule("map-editor")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5" />
              Map Editor
            </CardTitle>
            <CardDescription>Design detailed maps for your adventures</CardDescription>
          </CardHeader>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setCurrentModule("ai-generators")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              AI Generators
            </CardTitle>
            <CardDescription>Generate content with AI assistance</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Recent Activity & Quick Access */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest world-building actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.item}</p>
                </div>
                <div className="text-xs text-muted-foreground">{activity.time}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Campaigns</CardTitle>
            <CardDescription>Your currently running adventures</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {campaigns.slice(0, 4).map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{campaign.name}</p>
                  <p className="text-xs text-muted-foreground">{campaign.world}</p>
                </div>
                <Badge variant={campaign.status === "active" ? "default" : "secondary"}>{campaign.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
