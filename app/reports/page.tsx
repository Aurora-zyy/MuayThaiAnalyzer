"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, ArrowLeft, TrendingUp } from "lucide-react"

export default function ReportsPage() {
  const [timeframe, setTimeframe] = useState("3months")

  // Mock chart data - in a real app, you would use a charting library like Chart.js
  const chartData = {
    form: [65, 68, 72, 75, 78, 80, 85],
    chainOfPower: [60, 62, 65, 70, 72, 75, 78],
    explosiveness: [75, 78, 80, 82, 85, 88, 90],
    dates: ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  }

  // Mock technique data
  const techniqueData = [
    { name: "Roundhouse Kick", count: 8, avgScore: 84, change: "+7%" },
    { name: "Jab", count: 6, avgScore: 79, change: "+5%" },
    { name: "Cross", count: 5, avgScore: 82, change: "+4%" },
    { name: "Teep", count: 4, avgScore: 88, change: "+9%" },
    { name: "Elbow Strike", count: 3, avgScore: 76, change: "+3%" },
  ]

  // Mock recommendations
  const recommendations = [
    "Focus on hip rotation to improve your Chain of Power score.",
    "Your Form has improved significantly. Keep practicing your stance and guard position.",
    "Try incorporating more speed drills to further enhance your already strong Explosiveness score.",
    "Consider working with a partner to practice timing and distance management.",
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/journey">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Journey
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Progress Reports</h1>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <p className="text-gray-600">Track your improvement over time across all dimensions</p>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Tabs value={timeframe} onValueChange={setTimeframe} className="w-[400px]">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="1month">1M</TabsTrigger>
              <TabsTrigger value="3months">3M</TabsTrigger>
              <TabsTrigger value="6months">6M</TabsTrigger>
              <TabsTrigger value="1year">1Y</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - Charts */}
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="mb-6">
                  <TabsTrigger value="all">All Metrics</TabsTrigger>
                  <TabsTrigger value="form">Form</TabsTrigger>
                  <TabsTrigger value="power">Chain of Power</TabsTrigger>
                  <TabsTrigger value="explosiveness">Explosiveness</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <div className="h-[300px] relative">
                    {/* This would be a real chart in production */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full">
                        <div className="flex justify-between mb-2">
                          {chartData.dates.map((date, i) => (
                            <div key={i} className="text-xs text-gray-500">
                              {date}
                            </div>
                          ))}
                        </div>

                        <div className="space-y-6">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <div className="text-sm font-medium">Form</div>
                              <div className="text-sm text-green-600">+20%</div>
                            </div>
                            <div className="h-8 bg-blue-100 rounded-md relative">
                              <div
                                className="absolute inset-y-0 left-0 bg-blue-500 rounded-md"
                                style={{ width: "85%" }}
                              ></div>
                              {chartData.form.map((value, i) => (
                                <div
                                  key={i}
                                  className="absolute bottom-0 h-2 w-2 bg-blue-700 rounded-full transform -translate-x-1/2"
                                  style={{
                                    left: `${(i / (chartData.form.length - 1)) * 100}%`,
                                    bottom: `${(value / 100) * 32}px`,
                                  }}
                                ></div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <div className="text-sm font-medium">Chain of Power</div>
                              <div className="text-sm text-green-600">+18%</div>
                            </div>
                            <div className="h-8 bg-purple-100 rounded-md relative">
                              <div
                                className="absolute inset-y-0 left-0 bg-purple-500 rounded-md"
                                style={{ width: "78%" }}
                              ></div>
                              {chartData.chainOfPower.map((value, i) => (
                                <div
                                  key={i}
                                  className="absolute bottom-0 h-2 w-2 bg-purple-700 rounded-full transform -translate-x-1/2"
                                  style={{
                                    left: `${(i / (chartData.chainOfPower.length - 1)) * 100}%`,
                                    bottom: `${(value / 100) * 32}px`,
                                  }}
                                ></div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <div className="text-sm font-medium">Explosiveness</div>
                              <div className="text-sm text-green-600">+15%</div>
                            </div>
                            <div className="h-8 bg-red-100 rounded-md relative">
                              <div
                                className="absolute inset-y-0 left-0 bg-red-500 rounded-md"
                                style={{ width: "90%" }}
                              ></div>
                              {chartData.explosiveness.map((value, i) => (
                                <div
                                  key={i}
                                  className="absolute bottom-0 h-2 w-2 bg-red-700 rounded-full transform -translate-x-1/2"
                                  style={{
                                    left: `${(i / (chartData.explosiveness.length - 1)) * 100}%`,
                                    bottom: `${(value / 100) * 32}px`,
                                  }}
                                ></div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="form">
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-gray-500">Form metrics chart would be displayed here</p>
                  </div>
                </TabsContent>

                <TabsContent value="power">
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-gray-500">Chain of Power metrics chart would be displayed here</p>
                  </div>
                </TabsContent>

                <TabsContent value="explosiveness">
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-gray-500">Explosiveness metrics chart would be displayed here</p>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-medium mb-4">Key Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <div className="text-sm text-gray-600 mb-1">BIGGEST IMPROVEMENT</div>
                    <div className="text-xl font-bold">Form</div>
                    <div className="text-sm text-green-600 flex items-center mt-1">
                      +20% in 3 months
                      <TrendingUp className="h-4 w-4 ml-1" />
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="text-sm text-gray-600 mb-1">HIGHEST SCORE</div>
                    <div className="text-xl font-bold">Explosiveness</div>
                    <div className="text-sm text-blue-600 flex items-center mt-1">90 points</div>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                    <div className="text-sm text-gray-600 mb-1">FOCUS AREA</div>
                    <div className="text-xl font-bold">Chain of Power</div>
                    <div className="text-sm text-amber-600 flex items-center mt-1">78 points</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technique Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Technique</th>
                      <th className="text-center py-3 px-4">Count</th>
                      <th className="text-center py-3 px-4">Avg. Score</th>
                      <th className="text-right py-3 px-4">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {techniqueData.map((technique, i) => (
                      <tr key={i} className="border-b">
                        <td className="py-3 px-4">{technique.name}</td>
                        <td className="text-center py-3 px-4">{technique.count}</td>
                        <td className="text-center py-3 px-4">{technique.avgScore}</td>
                        <td className="text-right py-3 px-4 text-green-600">{technique.change}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Stats and recommendations */}
        <div>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">OVERALL IMPROVEMENT</div>
                  <div className="text-5xl font-bold text-green-600">+18%</div>
                  <div className="text-sm text-gray-500 mt-1">in the last 3 months</div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Activity</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <div className="text-sm text-gray-500 mb-1">VIDEOS</div>
                      <div className="text-2xl font-bold">26</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <div className="text-sm text-gray-500 mb-1">TECHNIQUES</div>
                      <div className="text-2xl font-bold">8</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Consistency</h3>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 28 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-6 rounded-sm ${
                          [2, 5, 9, 12, 15, 19, 22, 26].includes(i) ? "bg-red-500" : "bg-gray-200"
                        }`}
                      ></div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 mt-2 text-center">Last 4 weeks - 8 training sessions</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((recommendation, i) => (
                  <div key={i} className="p-4 border border-gray-200 rounded-lg">
                    <p className="text-sm">{recommendation}</p>
                  </div>
                ))}
              </div>

              <Button className="w-full mt-6 bg-red-600 hover:bg-red-700">Generate Training Plan</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
