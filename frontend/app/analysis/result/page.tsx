"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Download,
  Share2,
  Info,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function AnalysisResultPage() {
  const [comparisonMode, setComparisonMode] = useState<
    "overlay" | "sideBySide"
  >("overlay");

  // Get analysis data from sessionStorage or use mock data
  const [analysisData, setAnalysisData] = useState(() => {
    // Try to get real analysis data from backend
    if (typeof window !== "undefined") {
      const storedResult = sessionStorage.getItem("analysisResult");
      if (storedResult) {
        try {
          const realData = JSON.parse(storedResult);
          return {
            date: new Date().toLocaleDateString(),
            technique: realData.technique?.name || "Unknown Technique",
            scores: realData.scores || {
              form: 85,
              chainOfPower: 78,
              explosiveness: 90,
              overall: 84,
            },
            feedback: realData.feedback || {
              form: "Good stance, but elbows slightly high",
              chainOfPower: "Improve hip rotation for power",
              explosiveness: "Excellent speed, maintain aggression",
            },
            keyFrames: realData.key_frames?.map(
              (frame: any, index: number) => ({
                id: index + 1,
                time: `${Math.floor(frame.timestamp)}:${String(
                  Math.floor((frame.timestamp % 1) * 60)
                ).padStart(2, "0")}`,
                label: `Frame ${index + 1}`,
              })
            ) || [
              { id: 1, time: "0:02", label: "Starting Position" },
              { id: 2, time: "0:04", label: "Hip Rotation" },
              { id: 3, time: "0:05", label: "Impact Point" },
              { id: 4, time: "0:07", label: "Recovery" },
            ],
          };
        } catch (error) {
          console.error("Failed to parse stored analysis data:", error);
        }
      }
    }

    // Fallback to mock data
    return {
      date: "May 26, 2025",
      technique: "Roundhouse Kick",
      scores: {
        form: 85,
        chainOfPower: 78,
        explosiveness: 90,
        overall: 84,
      },
      feedback: {
        form: "Good stance, but elbows slightly high",
        chainOfPower: "Improve hip rotation for power",
        explosiveness: "Excellent speed, maintain aggression",
      },
      keyFrames: [
        { id: 1, time: "0:02", label: "Starting Position" },
        { id: 2, time: "0:04", label: "Hip Rotation" },
        { id: 3, time: "0:05", label: "Impact Point" },
        { id: 4, time: "0:07", label: "Recovery" },
      ],
    };
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/upload">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Analysis Results</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - Video comparison */}
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Technique Comparison</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant={
                      comparisonMode === "overlay" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setComparisonMode("overlay")}
                  >
                    Overlay
                  </Button>
                  <Button
                    variant={
                      comparisonMode === "sideBySide" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setComparisonMode("sideBySide")}
                  >
                    Side by Side
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {comparisonMode === "overlay" ? (
                <div className="relative">
                  <img
                    src="/placeholder.svg?height=500&width=800"
                    alt="Technique comparison overlay"
                    className="w-full rounded-lg"
                  />
                  <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-md text-sm">
                    Your form (red) vs Professional (blue)
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <img
                      src="/placeholder.svg?height=400&width=400"
                      alt="Your technique"
                      className="w-full rounded-lg"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs">
                      Your Form
                    </div>
                  </div>
                  <div className="relative">
                    <img
                      src="/placeholder.svg?height=400&width=400"
                      alt="Professional technique"
                      className="w-full rounded-lg"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs">
                      Professional
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Key Frames</h3>
                <div className="grid grid-cols-4 gap-4">
                  {analysisData.keyFrames.map((frame) => (
                    <div key={frame.id} className="text-center">
                      <div className="relative">
                        <img
                          src={`/placeholder.svg?height=150&width=150&text=${frame.label}`}
                          alt={frame.label}
                          className="w-full rounded-lg mb-2"
                        />
                        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs">
                          {frame.time}
                        </div>
                      </div>
                      <p className="text-sm">{frame.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="form">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="form">Form</TabsTrigger>
                  <TabsTrigger value="power">Chain of Power</TabsTrigger>
                  <TabsTrigger value="explosiveness">Explosiveness</TabsTrigger>
                </TabsList>

                <TabsContent value="form" className="pt-4">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Good stance and balance</h4>
                        <p className="text-gray-600">
                          Your base is solid, providing a good foundation for
                          the kick.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium">
                          Elbow position needs adjustment
                        </h4>
                        <p className="text-gray-600">
                          Keep your guard up with elbows closer to your body for
                          better protection.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium">
                          Good pivot on supporting foot
                        </h4>
                        <p className="text-gray-600">
                          Your pivot technique is excellent, allowing for proper
                          rotation.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="power" className="pt-4">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Limited hip rotation</h4>
                        <p className="text-gray-600">
                          Increase your hip rotation to generate more power
                          through the kinetic chain.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium">
                          Good shoulder engagement
                        </h4>
                        <p className="text-gray-600">
                          Your upper body mechanics are contributing well to the
                          power generation.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium">
                          Core engagement could improve
                        </h4>
                        <p className="text-gray-600">
                          Tighten your core throughout the movement to transfer
                          power more efficiently.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="explosiveness" className="pt-4">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Excellent speed</h4>
                        <p className="text-gray-600">
                          Your kick execution is fast and decisive.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Good aggression</h4>
                        <p className="text-gray-600">
                          Your commitment to the technique shows good intent and
                          aggression.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Smooth transitions</h4>
                        <p className="text-gray-600">
                          Your movement flows naturally from setup to execution
                          to recovery.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Scores and actions */}
        <div>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Performance Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg mb-6">
                  <div className="text-sm text-gray-500 mb-1">
                    OVERALL SCORE
                  </div>
                  <div className="text-5xl font-bold text-red-600">
                    {analysisData.scores.overall}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {analysisData.technique}
                  </div>
                </div>

                <ScoreBar
                  label="Form"
                  score={analysisData.scores.form}
                  feedback={analysisData.feedback.form}
                  color="bg-blue-500"
                />

                <ScoreBar
                  label="Chain of Power"
                  score={analysisData.scores.chainOfPower}
                  feedback={analysisData.feedback.chainOfPower}
                  color="bg-purple-500"
                />

                <ScoreBar
                  label="Explosiveness"
                  score={analysisData.scores.explosiveness}
                  feedback={analysisData.feedback.explosiveness}
                  color="bg-red-500"
                />
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-500 mb-2">
                  Analyzed on {analysisData.date}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommended Drills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium mb-1">Hip Rotation Drill</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Improve your power generation with this focused drill.
                  </p>
                  <Button variant="link" size="sm" className="px-0">
                    View Drill
                  </Button>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium mb-1">Guard Position Practice</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Work on keeping your elbows in the correct defensive
                    position.
                  </p>
                  <Button variant="link" size="sm" className="px-0">
                    View Drill
                  </Button>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium mb-1">
                    Core Engagement Exercises
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Strengthen your core to improve power transfer in kicks.
                  </p>
                  <Button variant="link" size="sm" className="px-0">
                    View Drill
                  </Button>
                </div>
              </div>

              <Button className="w-full mt-6 bg-red-600 hover:bg-red-700">
                Add to Training Plan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ScoreBar({ label, score, feedback, color }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <div className="font-medium">{label}</div>
        <div className="font-bold">{score}</div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
        <div
          className={`${color} h-2.5 rounded-full`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
      <div className="flex items-start mt-1">
        <Info className="h-4 w-4 text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-gray-500">{feedback}</p>
      </div>
    </div>
  );
}
