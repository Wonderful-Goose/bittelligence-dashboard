"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"

interface Alert {
  id: number
  priority: "critical" | "high" | "medium" | "low"
  category: string
  icon: string
  timestamp: string
  headline: string
  keyPoints: string[]
  tweet: string
  source: string
  tweeted: boolean
  dismissed: boolean
  savedForLater: boolean
}

const initialAlerts: Alert[] = [
  {
    id: 1,
    priority: "critical",
    category: "SEC",
    icon: "🏛️",
    timestamp: "2 min ago",
    headline: "SEC approves Bitcoin ETF application from BlackRock",
    keyPoints: ["$2.5B initial filing", "Trading starts Monday", "Ticker: IBIT"],
    tweet:
      "BREAKING: SEC approves BlackRock Bitcoin ETF (IBIT) - $2.5B initial filing, trading starts Monday. This changes everything. #Bitcoin #ETF",
    source: "sec.gov",
    tweeted: false,
    dismissed: false,
    savedForLater: false,
  },
  {
    id: 2,
    priority: "high",
    category: "Company",
    icon: "🏢",
    timestamp: "5 min ago",
    headline: "Marathon Digital increases hashrate by 15% in Q4",
    keyPoints: ["Now at 25.2 EH/s", "Added 5,000 miners", "Efficiency up 8%"],
    tweet:
      "Marathon Digital ($MARA) reports 15% hashrate increase to 25.2 EH/s in Q4. Added 5,000 miners with 8% efficiency gains. Strong operational execution. #Bitcoin #Mining",
    source: "marathondigital.com",
    tweeted: false,
    dismissed: false,
    savedForLater: false,
  },
  {
    id: 3,
    priority: "medium",
    category: "Hashrate",
    icon: "⛏️",
    timestamp: "12 min ago",
    headline: "Network hashrate hits new all-time high",
    keyPoints: ["550 EH/s peak", "Difficulty +3.2%", "Next adjustment in 5 days"],
    tweet:
      "Bitcoin network hashrate hits new ATH of 550 EH/s 🚀 Difficulty up 3.2%, next adjustment in 5 days. Network security stronger than ever. #Bitcoin",
    source: "blockchain.info",
    tweeted: true,
    dismissed: false,
    savedForLater: false,
  },
]

export function AlertFeed() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts)
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null)
  const [speedMode, setSpeedMode] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()
  const isMobile = useMobile()

  const handleTweet = async (alertId: number) => {
    const alert = alerts.find((a) => a.id === alertId)
    if (!alert) return

    if (speedMode && !countdown) {
      // Start countdown in speed mode
      setCountdown(10)
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer)
            executeTweet(alertId)
            return null
          }
          return prev ? prev - 1 : null
        })
      }, 1000)
      return
    }

    executeTweet(alertId)
  }

  const executeTweet = (alertId: number) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, tweeted: true } : alert)))
    toast({
      title: "Tweet sent!",
      description: "Your tweet has been posted successfully.",
    })
  }

  const handleEdit = (alert: Alert) => {
    setEditingAlert({ ...alert })
  }

  const handleSaveEdit = () => {
    if (!editingAlert) return
    setAlerts((prev) => prev.map((alert) => (alert.id === editingAlert.id ? editingAlert : alert)))
    setEditingAlert(null)
    toast({
      title: "Tweet updated",
      description: "Your changes have been saved.",
    })
  }

  const handleSaveForLater = (alertId: number) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, savedForLater: true } : alert)))
    toast({
      title: "Saved for later",
      description: "Alert added to your queue.",
    })
  }

  const handleDismiss = (alertId: number) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, dismissed: true } : alert)))
  }

  const cancelCountdown = () => {
    setCountdown(null)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "border-red-500"
      case "high":
        return "border-orange-500"
      case "medium":
        return "border-blue-500"
      default:
        return "border-gray-500"
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/50">Critical</Badge>
      case "high":
        return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50">High</Badge>
      case "medium":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">Medium</Badge>
      default:
        return <Badge variant="outline">Low</Badge>
    }
  }

  const handlePullToRefresh = async () => {
    if (!isMobile) return
    setRefreshing(true)
    // Simulate refresh delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setRefreshing(false)
    toast({
      title: "Refreshed",
      description: "Alert feed updated with latest data.",
    })
  }

  useEffect(() => {
    if (!isMobile) return

    let startY = 0
    let currentY = 0
    let isPulling = false

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      currentY = e.touches[0].clientY
      const diff = currentY - startY

      if (diff > 0 && window.scrollY === 0) {
        isPulling = true
        e.preventDefault()
      }
    }

    const handleTouchEnd = () => {
      if (isPulling && currentY - startY > 100) {
        handlePullToRefresh()
      }
      isPulling = false
    }

    document.addEventListener("touchstart", handleTouchStart)
    document.addEventListener("touchmove", handleTouchMove, { passive: false })
    document.addEventListener("touchend", handleTouchEnd)

    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isMobile])

  const visibleAlerts = alerts.filter((alert) => !alert.dismissed)
  const newAlertsCount = visibleAlerts.filter((alert) => !alert.tweeted && !alert.savedForLater).length

  return (
    <div className={`p-4 space-y-4 h-full overflow-y-auto ${isMobile ? "pb-20" : ""}`}>
      {refreshing && isMobile && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-lg font-semibold ${isMobile ? "text-base" : ""}`}>Live Alert Feed</h2>
        <div className="flex items-center gap-3">
          {!isMobile && (
            <Button variant={speedMode ? "default" : "outline"} size="sm" onClick={() => setSpeedMode(!speedMode)}>
              Speed Mode {speedMode ? "ON" : "OFF"}
            </Button>
          )}
          <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/50">
            {newAlertsCount} new alerts
          </Badge>
        </div>
      </div>

      {isMobile && <div className="text-center text-xs text-muted-foreground mb-4">Pull down to refresh</div>}

      {visibleAlerts.map((alert) => (
        <Card
          key={alert.id}
          className={`border-l-4 ${getPriorityColor(alert.priority)} ${
            alert.tweeted ? "opacity-50" : ""
          } transition-opacity relative ${isMobile ? "touch-manipulation" : ""}`}
        >
          {countdown && alerts.find((a) => a.id === alert.id && !a.tweeted) && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10 rounded-lg">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{countdown}</div>
                <div className="text-sm text-muted-foreground mb-4">Auto-tweeting in...</div>
                <Button variant="outline" size="sm" onClick={cancelCountdown}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <CardContent className={`${isMobile ? "p-3" : "p-4"}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`${isMobile ? "text-base" : "text-lg"}`}>{alert.icon}</span>
                <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                {getPriorityBadge(alert.priority)}
                {alert.savedForLater && (
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">Queued</Badge>
                )}
              </div>
              <Badge variant="outline" className="text-xs">
                {alert.category}
              </Badge>
            </div>

            <h3 className={`font-semibold mb-2 text-balance ${isMobile ? "text-sm" : ""}`}>{alert.headline}</h3>

            <ul className="text-sm text-muted-foreground mb-3 space-y-1">
              {alert.keyPoints.map((point, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                  {point}
                </li>
              ))}
            </ul>

            <div className="mb-3">
              <Textarea value={alert.tweet} className="text-sm resize-none" rows={3} readOnly />
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-muted-foreground">{alert.tweet.length}/280 characters</span>
                <a
                  href={`https://${alert.source}`}
                  className="text-xs text-blue-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {alert.source}
                </a>
              </div>
            </div>

            <div className={`flex gap-2 flex-wrap ${isMobile ? "gap-3" : ""}`}>
              {!alert.tweeted ? (
                <>
                  <Button
                    size={isMobile ? "default" : "sm"}
                    className={`${
                      speedMode ? "bg-red-600 hover:bg-red-700 animate-pulse" : "bg-blue-600 hover:bg-blue-700"
                    } ${isMobile ? "min-h-[44px] px-4" : ""}`}
                    onClick={() => handleTweet(alert.id)}
                  >
                    {speedMode ? "SPEED TWEET" : "Tweet Now"}
                  </Button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size={isMobile ? "default" : "sm"}
                        variant="outline"
                        onClick={() => handleEdit(alert)}
                        className={isMobile ? "min-h-[44px] px-4" : ""}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className={isMobile ? "max-w-[90vw] max-h-[80vh]" : "max-w-md"}>
                      <DialogHeader>
                        <DialogTitle>Edit Tweet</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Textarea
                          value={editingAlert?.tweet || ""}
                          onChange={(e) =>
                            setEditingAlert((prev) => (prev ? { ...prev, tweet: e.target.value } : null))
                          }
                          rows={4}
                          className="resize-none"
                        />
                        <div className="text-xs text-muted-foreground">
                          {editingAlert?.tweet.length || 0}/280 characters
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleSaveEdit} size={isMobile ? "default" : "sm"}>
                            Save Changes
                          </Button>
                          <Button
                            variant="outline"
                            size={isMobile ? "default" : "sm"}
                            onClick={() => setEditingAlert(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    size={isMobile ? "default" : "sm"}
                    variant="outline"
                    onClick={() => handleSaveForLater(alert.id)}
                    disabled={alert.savedForLater}
                    className={isMobile ? "min-h-[44px] px-4" : ""}
                  >
                    {alert.savedForLater ? "Queued" : "Save for Later"}
                  </Button>
                  <Button
                    size={isMobile ? "default" : "sm"}
                    variant="ghost"
                    onClick={() => handleDismiss(alert.id)}
                    className={isMobile ? "min-h-[44px] px-4" : ""}
                  >
                    Dismiss
                  </Button>
                </>
              ) : (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Tweeted</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {speedMode && !isMobile && (
        <div className="fixed bottom-4 right-4 bg-card border rounded-lg p-3 text-xs text-muted-foreground">
          <div className="font-medium mb-1">Speed Mode Active</div>
          <div>Space = Tweet | X = Dismiss</div>
        </div>
      )}
    </div>
  )
}
