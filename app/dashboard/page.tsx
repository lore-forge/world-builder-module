"use client"

import { Metadata } from 'next'
import { DashboardOverview } from '@/components/dashboard-overview'
import { AppLayout } from '@/components/app-layout'

// Client components can't have metadata, so we'll handle the title differently
// export const metadata: Metadata = {
//   title: 'Dashboard - World Builder',
//   description: 'Manage your worlds and campaigns',
// }

export default function DashboardPage() {
  return (
    <AppLayout>
      <DashboardOverview />
    </AppLayout>
  )
}
