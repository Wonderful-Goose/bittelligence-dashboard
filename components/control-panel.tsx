"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const categories = [
  { id: "sec", label: "SEC Filings", count: 3, icon: "🏛️" },
  { id: "sovereign", label: "Sovereign/Treasury", count: 1, icon: "🏦" },
  { id: "company", label: "Company News", count: 5, icon: "🏢" },
  { id: "hashrate", label: "Hashrate Changes", count: 2, icon: "⛏️" },
  { id: "onchain", label: "On-chain Movements", count: 4, icon: "🔗" },
  { id: "market", label: "Market Data", count: 6, icon: "📊" },
  { id: "regulatory", label: "Regulatory", count: 0, icon: "⚖️" },
]

const savedFilters = ["Morning Review", "Market Hours", "Weekend Watch"]

export function ControlPanel() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categories.map((c) => c.id))
  const [priority, setPriority] = useState("all")
  const [timeFilter, setTimeFilter] = useState("24h")

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  return (
    <div className="p-4 space-y-6">
      {/* Alert Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Alert Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => toggleCategory(category.id)}
                />
                <Label htmlFor={category.id} className="text-sm flex items-center gap-2 cursor-pointer">
                  <span>{category.icon}</span>
                  {category.label}
                </Label>
              </div>
              {category.count > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {category.count} new
                </Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Priority Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Priority Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={priority} onValueChange={setPriority}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="text-sm">
                All Priorities
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="critical" id="critical" />
              <Label htmlFor="critical" className="text-sm">
                Critical Only
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="high" />
              <Label htmlFor="high" className="text-sm">
                High & Above
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="custom" />
              <Label htmlFor="custom" className="text-sm">
                Custom threshold
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Time Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Time Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {["1h", "4h", "today", "24h"].map((time) => (
            <Button
              key={time}
              variant={timeFilter === time ? "default" : "ghost"}
              size="sm"
              className="w-full justify-start"
              onClick={() => setTimeFilter(time)}
            >
              {time === "1h"
                ? "Last Hour"
                : time === "4h"
                  ? "Last 4 Hours"
                  : time === "today"
                    ? "Today"
                    : "Last 24 Hours"}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Saved Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Saved Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {savedFilters.map((filter) => (
            <Button key={filter} variant="ghost" size="sm" className="w-full justify-start">
              {filter}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
