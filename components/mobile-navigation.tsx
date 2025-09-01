"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Filter, BarChart3, Bell } from "lucide-react"

interface MobileNavigationProps {
  activeTab: "feed" | "filters" | "stats"
  onTabChange: (tab: "feed" | "filters" | "stats") => void
}

export function MobileNavigation({ activeTab, onTabChange }: MobileNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex items-center justify-around px-4">
      <Button
        variant={activeTab === "filters" ? "default" : "ghost"}
        size="sm"
        className="flex flex-col items-center gap-1 h-12 px-3"
        onClick={() => onTabChange("filters")}
      >
        <Filter className="h-4 w-4" />
        <span className="text-xs">Filters</span>
      </Button>

      <Button
        variant={activeTab === "feed" ? "default" : "ghost"}
        size="sm"
        className="flex flex-col items-center gap-1 h-12 px-3 relative"
        onClick={() => onTabChange("feed")}
      >
        <Bell className="h-4 w-4" />
        <span className="text-xs">Alerts</span>
        <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500">21</Badge>
      </Button>

      <Button
        variant={activeTab === "stats" ? "default" : "ghost"}
        size="sm"
        className="flex flex-col items-center gap-1 h-12 px-3"
        onClick={() => onTabChange("stats")}
      >
        <BarChart3 className="h-4 w-4" />
        <span className="text-xs">Stats</span>
      </Button>
    </div>
  )
}
