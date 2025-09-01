"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { ControlPanel } from "@/components/control-panel"
import { AlertFeed } from "@/components/alert-feed"
import { ContextSidebar } from "@/components/context-sidebar"
import { MobileNavigation } from "@/components/mobile-navigation"
import { useMobile } from "@/hooks/use-mobile"

export default function MiningDashboard() {
  const [activeTab, setActiveTab] = useState<"feed" | "filters" | "stats">("feed")
  const isMobile = useMobile()

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background text-foreground dark">
        <DashboardHeader />
        <div className="h-[calc(100vh-8rem)] overflow-hidden">
          {/* Mobile Single Panel View */}
          <div className="h-full">
            {activeTab === "filters" && <ControlPanel />}
            {activeTab === "feed" && <AlertFeed />}
            {activeTab === "stats" && <ContextSidebar />}
          </div>
        </div>
        <MobileNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      <DashboardHeader />
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar - Control Panel */}
        <div className="w-80 border-r border-border bg-card">
          <ControlPanel />
        </div>

        {/* Center - Alert Feed */}
        <div className="flex-1 bg-background">
          <AlertFeed />
        </div>

        {/* Right Sidebar - Context */}
        <div className="w-80 border-l border-border bg-card">
          <ContextSidebar />
        </div>
      </div>
    </div>
  )
}
