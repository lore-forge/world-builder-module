import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Dashboard - World Builder',
  description: 'Manage your worlds and campaigns',
}

// Temporary redirect while we implement the full dashboard
export default function DashboardPage() {
  // In production, this would check authentication first
  // For now, we'll build the dashboard UI
  
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">World Builder Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage your immersive worlds, campaigns, and educational content
          </p>
        </div>
        <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
          Create New World
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Total Worlds</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="text-muted-foreground">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Active Campaigns</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="text-muted-foreground">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Total NPCs</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="text-muted-foreground">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Shared Worlds</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="text-muted-foreground">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.632 4.926c.202-.404.316-.86.316-1.342 0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684M15 9a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Worlds */}
      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <h2 className="text-2xl font-semibold tracking-tight">Recent Worlds</h2>
          <p className="text-sm text-muted-foreground mt-1">Your recently accessed worlds and campaigns</p>
        </div>
        <div className="p-6 pt-0">
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <p>No worlds created yet. Start by creating your first world!</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <button className="rounded-lg border bg-card p-6 text-left hover:bg-accent transition-colors">
          <h3 className="font-semibold mb-2">🗺️ Create New World</h3>
          <p className="text-sm text-muted-foreground">Design a new world with AI-powered terrain generation</p>
        </button>
        
        <button className="rounded-lg border bg-card p-6 text-left hover:bg-accent transition-colors">
          <h3 className="font-semibold mb-2">📚 Browse Templates</h3>
          <p className="text-sm text-muted-foreground">Start from pre-built educational world templates</p>
        </button>
        
        <button className="rounded-lg border bg-card p-6 text-left hover:bg-accent transition-colors">
          <h3 className="font-semibold mb-2">🎲 Import from RPG</h3>
          <p className="text-sm text-muted-foreground">Convert an RPG adventure into a full world</p>
        </button>
      </div>
    </div>
  )
}
