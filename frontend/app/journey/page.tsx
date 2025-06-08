"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Filter, ChevronDown, ArrowUpRight, TrendingUp, Award } from "lucide-react"

export default function JourneyPage() {
  const [timeframe, setTimeframe] = useState("all")

  // Mock journey data
  const journeyData = {
    entries: [
      {
        id: 1,
        date: "May 26, 2025",
        technique: "Roundhouse Kick",
        score: 84,
        improvement: "+5",
        thumbnail: "/placeholder.svg?height=120&width=200",
      },
      {
        id: 2,
        date: "May 24, 2025",
        technique: "Jab-Cross Combo",
        score: 79,
        improvement: "+3",
        thumbnail: "/placeholder.svg?height=120&width=200",
      },
      {
        id: 3,
        date: "May 20, 2025",
        technique: "Teep (Push Kick)",
        score: 88,
        improvement: "+7",
        thumbnail: "/placeholder.svg?height=120&width=200",
      },
      {
        id: 4,
        date: "May 15, 2025",
        technique: "Elbow Strike",
        score: 76,
        improvement: "+2",
        thumbnail: "/placeholder.svg?height=120&width=200",
      },
      {
        id: 5,
        date: "May 10, 2025",
        technique: "Roundhouse Kick",
        score: 79,
        improvement: "+4",
        thumbnail: "/placeholder.svg?height=120&width=200",
      },
      {
        id: 6,
        date: "May 5, 2025",
        technique: "Knee Strike",
        score: 82,
        improvement: "+6",
        thumbnail: "/placeholder.svg?height=120&width=200",
      },
    ],
    milestones: [
      {
        id: 1,
        title: "First Analysis",
        date: "April 15, 2025",
        description: "You completed your first technique analysis!",
      },
      {
        id: 2,
        title: "10% Form Improvement",
        date: "April 30, 2025",
        description: "Your form score has improved by 10% since you started.",
      },
      {
        id: 3,
        title: "5 Techniques Analyzed",
        date: "May 10, 2025",
        description: "You've analyzed 5 different Muay Thai techniques.",
      },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Learning Journey</h1>
          <p className="text-gray-600 mt-1">Track your progress and improvement over time</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild className="bg-red-600 hover:bg-red-700">
            <Link href="/upload">Upload New Video</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - Journey entries */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <CardTitle>Your Technique Analyses</CardTitle>
                <div className="flex space-x-2 mt-4 md:mt-0">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <div className="relative">
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      {timeframe === "all"
                        ? "All Time"
                        : timeframe === "month"
                          ? "This Month"
                          : timeframe === "week"
                            ? "This Week"
                            : "All Time"}
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {journeyData.entries.map((entry) => (
                  <Link href="/analysis/result" key={entry.id}>
                    <div className="flex flex-col md:flex-row items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="md:w-1/4 mb-4 md:mb-0">
                        <img
                          src={entry.thumbnail || "/placeholder.svg"}
                          alt={entry.technique}
                          className="rounded-md w-full"
                        />
                      </div>
                      <div className="md:w-2/4 md:px-4 text-center md:text-left">
                        <h3 className="font-medium">{entry.technique}</h3>
                        <p className="text-sm text-gray-500">{entry.date}</p>
                      </div>
                      <div className="md:w-1/4 flex flex-col items-center mt-4 md:mt-0">
                        <div className="text-2xl font-bold">{entry.score}</div>
                        <div className="text-sm text-green-600 flex items-center">
                          {entry.improvement}
                          <TrendingUp className="h-3 w-3 ml-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-6 text-center">
                <Button variant="outline">Load More</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Stats and milestones */}
        <div>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-500 mb-1">ANALYSES</div>
                  <div className="text-3xl font-bold">12</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-500 mb-1">AVG SCORE</div>
                  <div className="text-3xl font-bold">81</div>
                </div>
              </div>

              <h3 className="font-medium mb-4">Performance Trends</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-sm">Form</div>
                    <div className="text-sm text-green-600 flex items-center">
                      +12%
                      <TrendingUp className="h-3 w-3 ml-1" />
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-sm">Chain of Power</div>
                    <div className="text-sm text-green-600 flex items-center">
                      +8%
                      <TrendingUp className="h-3 w-3 ml-1" />
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: "68%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-sm">Explosiveness</div>
                    <div className="text-sm text-green-600 flex items-center">
                      +15%
                      <TrendingUp className="h-3 w-3 ml-1" />
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: "82%" }}></div>
                  </div>
                </div>
              </div>

              <Button asChild className="w-full mt-6">
                <Link href="/reports">
                  View Detailed Reports
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {journeyData.milestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-start">
                    <div className="mr-3 mt-1">
                      <Award className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">{milestone.title}</h4>
                      <p className="text-xs text-gray-500 mb-1">{milestone.date}</p>
                      <p className="text-sm text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
