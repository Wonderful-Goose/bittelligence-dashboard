"use client"

import { useState, useEffect } from "react"

interface TweetPerformance {
  id: string
  content: string
  timestamp: Date
  likes: number
  retweets: number
  replies: number
  impressions: number
  engagementRate: number
}

interface DailyStats {
  date: string
  tweets: number
  totalLikes: number
  totalRetweets: number
  followerGrowth: number
  topTweet: TweetPerformance | null
}

interface PerformanceData {
  currentFollowers: number
  followerGrowth: {
    today: number
    week: number
    month: number
  }
  todayStats: {
    tweets: number
    alerts: number
    avgEngagement: number
  }
  bestTweet24h: TweetPerformance | null
  recentTweets: TweetPerformance[]
  dailyHistory: DailyStats[]
  followerHistory: { date: string; count: number }[]
}

// Mock data generator for realistic performance tracking
const generateMockPerformance = (): PerformanceData => {
  const now = new Date()
  const mockTweets: TweetPerformance[] = [
    {
      id: "1",
      content: "BREAKING: SEC approves BlackRock Bitcoin ETF...",
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      likes: 2134,
      retweets: 456,
      replies: 89,
      impressions: 45600,
      engagementRate: 5.9,
    },
    {
      id: "2",
      content: "Marathon Digital reports 15% hashrate increase...",
      timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000),
      likes: 892,
      retweets: 234,
      replies: 45,
      impressions: 23400,
      engagementRate: 5.0,
    },
    {
      id: "3",
      content: "Bitcoin network hashrate hits new ATH...",
      timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000),
      likes: 1456,
      retweets: 312,
      replies: 67,
      impressions: 34200,
      engagementRate: 5.4,
    },
  ]

  const followerHistory = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    count: 12437 - i * Math.floor(Math.random() * 10) + Math.floor(Math.random() * 25),
  })).reverse()

  return {
    currentFollowers: 12437,
    followerGrowth: {
      today: 23,
      week: 156,
      month: 634,
    },
    todayStats: {
      tweets: 23,
      alerts: 47,
      avgEngagement: 4.2,
    },
    bestTweet24h: mockTweets[0],
    recentTweets: mockTweets,
    dailyHistory: [],
    followerHistory,
  }
}

export function usePerformanceTracking() {
  const [performanceData, setPerformanceData] = useState<PerformanceData>(generateMockPerformance())
  const [isLoading, setIsLoading] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPerformanceData((prev) => ({
        ...prev,
        currentFollowers: prev.currentFollowers + Math.floor(Math.random() * 3),
        followerGrowth: {
          ...prev.followerGrowth,
          today: prev.followerGrowth.today + Math.floor(Math.random() * 2),
        },
      }))
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const trackTweet = (tweetContent: string) => {
    const newTweet: TweetPerformance = {
      id: Date.now().toString(),
      content: tweetContent,
      timestamp: new Date(),
      likes: 0,
      retweets: 0,
      replies: 0,
      impressions: 0,
      engagementRate: 0,
    }

    setPerformanceData((prev) => ({
      ...prev,
      recentTweets: [newTweet, ...prev.recentTweets.slice(0, 9)],
      todayStats: {
        ...prev.todayStats,
        tweets: prev.todayStats.tweets + 1,
      },
    }))
  }

  const getEngagementTrend = () => {
    const recent = performanceData.recentTweets.slice(0, 5)
    const older = performanceData.recentTweets.slice(5, 10)

    if (recent.length === 0 || older.length === 0) return 0

    const recentAvg = recent.reduce((sum, tweet) => sum + tweet.engagementRate, 0) / recent.length
    const olderAvg = older.reduce((sum, tweet) => sum + tweet.engagementRate, 0) / older.length

    return ((recentAvg - olderAvg) / olderAvg) * 100
  }

  const getOptimalPostingTimes = () => {
    // Mock optimal times based on historical performance
    return [
      { time: "09:00", score: 8.5, label: "Market Open" },
      { time: "13:30", score: 7.2, label: "Lunch Break" },
      { time: "16:00", score: 9.1, label: "Market Close" },
      { time: "20:00", score: 6.8, label: "Evening" },
    ]
  }

  return {
    performanceData,
    isLoading,
    trackTweet,
    getEngagementTrend,
    getOptimalPostingTimes,
  }
}
