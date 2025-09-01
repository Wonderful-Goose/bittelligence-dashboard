"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { usePerformanceTracking } from "@/hooks/use-performance-tracking"

const miningStocks = [
  { symbol: "MARA", price: 18.45, change: 2.3, premarket: true },
  { symbol: "RIOT", price: 12.67, change: -1.2, premarket: true },
  { symbol: "CLSK", price: 8.92, change: 4.1, premarket: false },
  { symbol: "BITF", price: 3.21, change: -0.8, premarket: false },
]

export function ContextSidebar() {
  const { performanceData, getEngagementTrend, getOptimalPostingTimes } = usePerformanceTracking()
  const engagementTrend = getEngagementTrend()
  const optimalTimes = getOptimalPostingTimes()

  return (
    <div className="p-4 space-y-6 h-full overflow-y-auto">
      {/* Market Snapshot */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Market Snapshot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Bitcoin */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Bitcoin</span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50">+2.4%</Badge>
            </div>
            <div className="text-lg font-mono">$43,250</div>
            <div className="text-xs text-muted-foreground">24h: $42,180 - $43,890</div>
          </div>

          {/* Mining Stocks */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Mining Stocks</h4>
            {miningStocks.map((stock) => (
              <div key={stock.symbol} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">{stock.symbol}</span>
                  {stock.premarket && (
                    <Badge variant="outline" className="text-xs">
                      PM
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono">${stock.price}</div>
                  <div className={`text-xs ${stock.change > 0 ? "text-green-400" : "text-red-400"}`}>
                    {stock.change > 0 ? "+" : ""}
                    {stock.change}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Network Stats */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Network</h4>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Hashrate:</span>
                <span className="font-mono">550 EH/s</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Difficulty:</span>
                <span className="font-mono">+3.2%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Next adj:</span>
                <span className="font-mono">5 days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Mempool:</span>
                <span className="font-mono">12 sat/vB</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Performance Metrics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Performance Analytics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Follower Growth */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Followers</span>
              <div className="text-right">
                <div className="text-sm font-semibold">{performanceData.currentFollowers.toLocaleString()}</div>
                <div className="text-xs text-green-400">+{performanceData.followerGrowth.today} today</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Week: +{performanceData.followerGrowth.week}</span>
                <span>Month: +{performanceData.followerGrowth.month}</span>
              </div>
              <Progress value={75} className="h-1" />
            </div>
          </div>

          {/* Best Tweet Performance */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Best tweet (24h)</span>
              <div className="text-right">
                <div className="text-sm font-semibold">
                  {performanceData.bestTweet24h?.likes.toLocaleString()} likes
                </div>
                <div className="text-xs text-muted-foreground">
                  {performanceData.bestTweet24h?.engagementRate}% engagement
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {performanceData.bestTweet24h?.content.slice(0, 50)}...
            </div>
          </div>

          {/* Engagement Trend */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Engagement trend</span>
              <div className={`text-sm font-semibold ${engagementTrend > 0 ? "text-green-400" : "text-red-400"}`}>
                {engagementTrend > 0 ? "+" : ""}
                {engagementTrend.toFixed(1)}%
              </div>
            </div>
            <div className="text-xs text-muted-foreground">vs previous 5 tweets</div>
          </div>

          {/* Today's Performance */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
            <div className="text-center">
              <div className="text-lg font-semibold">{performanceData.todayStats.tweets}</div>
              <div className="text-xs text-muted-foreground">Tweets</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{performanceData.todayStats.avgEngagement}%</div>
              <div className="text-xs text-muted-foreground">Avg Engagement</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimal Posting Times */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Optimal Posting Times</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {optimalTimes.map((time) => (
            <div key={time.time} className="flex justify-between items-center">
              <div>
                <div className="text-sm font-mono">{time.time}</div>
                <div className="text-xs text-muted-foreground">{time.label}</div>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={time.score * 10} className="w-12 h-2" />
                <span className="text-xs font-medium">{time.score}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Tools */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Analytics Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
            Tweet Scheduler
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
            Performance Report
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
            Competitor Analysis
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
            Hashtag Optimizer
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
