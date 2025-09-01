"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { usePerformanceTracking } from "@/hooks/use-performance-tracking"
import { useMobile } from "@/hooks/use-mobile"
import { Menu, X } from "lucide-react"

export function DashboardHeader() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showUnseen, setShowUnseen] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const { performanceData } = usePerformanceTracking()
  const isMobile = useMobile()

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date, timezone: string) => {
    return date.toLocaleTimeString("en-US", {
      timeZone: timezone,
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isMobile) {
    return (
      <>
        <header className="h-16 border-b border-border bg-card px-4 flex items-center justify-between">
          {/* Mobile Header - Simplified */}
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div className="text-sm font-semibold">Mining Intel</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-center">
              <div className="font-mono">{formatTime(currentTime, "America/New_York")}</div>
              <div className="text-muted-foreground">NY</div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-2">
              {showMobileMenu ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {showMobileMenu && (
          <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Dashboard Stats</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowMobileMenu(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card p-4 rounded-lg border">
                  <div className="text-2xl font-bold">{performanceData.todayStats.alerts}</div>
                  <div className="text-sm text-muted-foreground">Alerts Today</div>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <div className="text-2xl font-bold">{performanceData.todayStats.tweets}</div>
                  <div className="text-sm text-muted-foreground">Tweets Sent</div>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <div className="text-2xl font-bold">{performanceData.currentFollowers.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">
                    Followers <span className="text-green-400">+{performanceData.followerGrowth.today}</span>
                  </div>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <div className="text-2xl font-bold">{performanceData.todayStats.avgEngagement}%</div>
                  <div className="text-sm text-muted-foreground">Engagement</div>
                </div>
              </div>

              {/* Time Zones */}
              <div className="bg-card p-4 rounded-lg border">
                <h3 className="font-medium mb-3">Global Times</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="font-mono text-lg">{formatTime(currentTime, "America/New_York")}</div>
                    <div className="text-sm text-muted-foreground">New York</div>
                  </div>
                  <div>
                    <div className="font-mono text-lg">{formatTime(currentTime, "Europe/London")}</div>
                    <div className="text-sm text-muted-foreground">London</div>
                  </div>
                  <div>
                    <div className="font-mono text-lg">{formatTime(currentTime, "Asia/Hong_Kong")}</div>
                    <div className="text-sm text-muted-foreground">Hong Kong</div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="bg-card p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Show unseen only</span>
                  <Switch checked={showUnseen} onCheckedChange={setShowUnseen} />
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      {/* Left - Time Zones */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-muted-foreground">NY:</span>
            <span className="ml-1 font-mono">{formatTime(currentTime, "America/New_York")}</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">LON:</span>
            <span className="ml-1 font-mono">{formatTime(currentTime, "Europe/London")}</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">HK:</span>
            <span className="ml-1 font-mono">{formatTime(currentTime, "Asia/Hong_Kong")}</span>
          </div>
        </div>

        {/* System Status */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">All monitors running</span>
        </div>
      </div>

      {/* Center - Live Performance Stats */}
      <div className="flex items-center gap-6">
        <div className="text-sm">
          <span className="text-muted-foreground">Alerts today:</span>
          <span className="ml-1 font-semibold">{performanceData.todayStats.alerts}</span>
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Tweets sent:</span>
          <span className="ml-1 font-semibold">{performanceData.todayStats.tweets}</span>
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Followers:</span>
          <span className="ml-1 font-semibold">{performanceData.currentFollowers.toLocaleString()}</span>
          {performanceData.followerGrowth.today > 0 && (
            <span className="ml-1 text-xs text-green-400">+{performanceData.followerGrowth.today}</span>
          )}
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Engagement:</span>
          <span className="ml-1 font-semibold">{performanceData.todayStats.avgEngagement}%</span>
        </div>
      </div>

      {/* Right - Controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Show unseen only</span>
          <Switch checked={showUnseen} onCheckedChange={setShowUnseen} />
        </div>
        <Badge variant="outline" className="bg-primary/10 animate-pulse">
          Live
        </Badge>
      </div>
    </header>
  )
}
