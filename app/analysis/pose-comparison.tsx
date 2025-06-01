"use client"

import { useRef, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PosePoint {
  name: string
  x: number
  y: number
  confidence: number
}

interface ComparisonFrame {
  userFrame: HTMLCanvasElement
  professionalFrame: HTMLCanvasElement
  userPose: PosePoint[]
  professionalPose: PosePoint[]
  timestamp: number
}

interface PoseComparisonProps {
  userFrames: any[]
  professionalFrames: any[]
}

export default function PoseComparison({ userFrames, professionalFrames }: PoseComparisonProps) {
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedFrame, setSelectedFrame] = useState(0)
  const [comparisonMode, setComparisonMode] = useState<"overlay" | "sideBySide">("overlay")
  const [analysisResults, setAnalysisResults] = useState<any>(null)

  useEffect(() => {
    if (userFrames.length > 0 && professionalFrames.length > 0) {
      performPoseAnalysis()
    }
  }, [userFrames, professionalFrames])

  const performPoseAnalysis = () => {
    // Simplified pose analysis
    const results = {
      formScore: calculateFormScore(),
      powerScore: calculatePowerScore(),
      explosiveness: calculateExplosivenessScore(),
      keyDifferences: identifyKeyDifferences(),
    }
    setAnalysisResults(results)
  }

  const calculateFormScore = () => {
    // Mock calculation based on pose similarity
    const similarities = userFrames.map((userFrame, index) => {
      if (index < professionalFrames.length) {
        return calculatePoseSimilarity(userFrame.keyPoints, professionalFrames[index].keyPoints)
      }
      return 0
    })

    const avgSimilarity = similarities.reduce((a, b) => a + b, 0) / similarities.length
    return Math.round(avgSimilarity * 100)
  }

  const calculatePowerScore = () => {
    // Analyze hip rotation and power chain
    let powerScore = 75 // Base score

    // Check hip rotation (simplified)
    const hipRotation = analyzeHipRotation()
    if (hipRotation > 0.8) powerScore += 15
    else if (hipRotation > 0.6) powerScore += 10
    else powerScore -= 10

    return Math.min(100, Math.max(0, powerScore))
  }

  const calculateExplosivenessScore = () => {
    // Analyze movement speed between frames
    let explosiveness = 80 // Base score

    const movementSpeed = analyzeMovementSpeed()
    if (movementSpeed > 0.9) explosiveness += 15
    else if (movementSpeed > 0.7) explosiveness += 10
    else explosiveness -= 15

    return Math.min(100, Math.max(0, explosiveness))
  }

  const calculatePoseSimilarity = (userPose: PosePoint[], professionalPose: PosePoint[]) => {
    if (!userPose || !professionalPose) return 0

    let totalSimilarity = 0
    let validComparisons = 0

    userPose.forEach((userPoint) => {
      const professionalPoint = professionalPose.find((p) => p.name === userPoint.name)
      if (professionalPoint) {
        const distance = Math.sqrt(
          Math.pow(userPoint.x - professionalPoint.x, 2) + Math.pow(userPoint.y - professionalPoint.y, 2),
        )
        const similarity = Math.max(0, 1 - distance) // Simplified similarity
        totalSimilarity += similarity
        validComparisons++
      }
    })

    return validComparisons > 0 ? totalSimilarity / validComparisons : 0
  }

  const analyzeHipRotation = () => {
    // Simplified hip rotation analysis
    return Math.random() * 0.4 + 0.6 // Mock value between 0.6-1.0
  }

  const analyzeMovementSpeed = () => {
    // Simplified movement speed analysis
    return Math.random() * 0.3 + 0.7 // Mock value between 0.7-1.0
  }

  const identifyKeyDifferences = () => {
    return [
      { area: "Elbow Position", difference: "Elbows slightly high", severity: "minor" },
      { area: "Hip Rotation", difference: "Limited hip engagement", severity: "moderate" },
      { area: "Stance Width", difference: "Good stance balance", severity: "good" },
    ]
  }

  const drawOverlayComparison = () => {
    if (!overlayCanvasRef.current || userFrames.length === 0 || professionalFrames.length === 0) return

    const canvas = overlayCanvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const userFrame = userFrames[selectedFrame]
    const professionalFrame = professionalFrames[Math.min(selectedFrame, professionalFrames.length - 1)]

    if (!userFrame || !professionalFrame) return

    canvas.width = 800
    canvas.height = 600

    // Draw user frame with red tint
    ctx.globalAlpha = 0.7
    ctx.fillStyle = "rgba(255, 0, 0, 0.3)"
    ctx.drawImage(userFrame.canvas, 0, 0, 400, 300)
    ctx.fillRect(0, 0, 400, 300)

    // Draw professional frame with blue tint
    ctx.globalAlpha = 0.7
    ctx.fillStyle = "rgba(0, 0, 255, 0.3)"
    ctx.drawImage(professionalFrame.canvas, 400, 0, 400, 300)
    ctx.fillRect(400, 0, 400, 300)

    // Draw pose keypoints
    ctx.globalAlpha = 1.0
    drawPoseKeypoints(ctx, userFrame.keyPoints, 0, 0, 400, 300, "red")
    drawPoseKeypoints(ctx, professionalFrame.keyPoints, 400, 0, 400, 300, "blue")

    // Add labels
    ctx.fillStyle = "white"
    ctx.font = "16px Arial"
    ctx.fillText("Your Technique", 10, 25)
    ctx.fillText("Professional Reference", 410, 25)
  }

  const drawPoseKeypoints = (
    ctx: CanvasRenderingContext2D,
    keyPoints: PosePoint[],
    offsetX: number,
    offsetY: number,
    width: number,
    height: number,
    color: string,
  ) => {
    if (!keyPoints) return

    ctx.fillStyle = color
    ctx.strokeStyle = color
    ctx.lineWidth = 2

    keyPoints.forEach((point) => {
      if (point.confidence > 0.5) {
        const x = offsetX + point.x * width
        const y = offsetY + point.y * height

        // Draw point
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, 2 * Math.PI)
        ctx.fill()
      }
    })

    // Draw connections between key points
    const connections = [
      ["left_shoulder", "right_shoulder"],
      ["left_shoulder", "left_elbow"],
      ["left_elbow", "left_wrist"],
      ["right_shoulder", "right_elbow"],
      ["right_elbow", "right_wrist"],
    ]

    connections.forEach(([point1Name, point2Name]) => {
      const point1 = keyPoints.find((p) => p.name === point1Name)
      const point2 = keyPoints.find((p) => p.name === point2Name)

      if (point1 && point2 && point1.confidence > 0.5 && point2.confidence > 0.5) {
        ctx.beginPath()
        ctx.moveTo(offsetX + point1.x * width, offsetY + point1.y * height)
        ctx.lineTo(offsetX + point2.x * width, offsetY + point2.y * height)
        ctx.stroke()
      }
    })
  }

  useEffect(() => {
    if (comparisonMode === "overlay") {
      drawOverlayComparison()
    }
  }, [selectedFrame, comparisonMode, userFrames, professionalFrames])

  if (userFrames.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">Upload and process videos to see pose comparison</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Pose Comparison Analysis</CardTitle>
            <div className="flex space-x-2">
              <Button
                variant={comparisonMode === "overlay" ? "default" : "outline"}
                size="sm"
                onClick={() => setComparisonMode("overlay")}
              >
                Overlay
              </Button>
              <Button
                variant={comparisonMode === "sideBySide" ? "default" : "outline"}
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
            <div className="text-center">
              <canvas ref={overlayCanvasRef} className="border rounded-lg max-w-full" style={{ maxHeight: "400px" }} />
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  Frame {selectedFrame + 1} of {userFrames.length}
                </p>
                <input
                  type="range"
                  min="0"
                  max={userFrames.length - 1}
                  value={selectedFrame}
                  onChange={(e) => setSelectedFrame(Number.parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <h3 className="font-medium mb-2">Your Technique</h3>
                {userFrames[selectedFrame] && (
                  <canvas
                    ref={(el) => {
                      if (el && userFrames[selectedFrame]) {
                        const ctx = el.getContext("2d")
                        if (ctx) {
                          el.width = 300
                          el.height = 200
                          ctx.drawImage(userFrames[selectedFrame].canvas, 0, 0, 300, 200)
                          drawPoseKeypoints(ctx, userFrames[selectedFrame].keyPoints, 0, 0, 300, 200, "red")
                        }
                      }
                    }}
                    className="border rounded-lg w-full"
                  />
                )}
              </div>
              <div className="text-center">
                <h3 className="font-medium mb-2">Professional Reference</h3>
                {professionalFrames[Math.min(selectedFrame, professionalFrames.length - 1)] && (
                  <canvas
                    ref={(el) => {
                      if (el && professionalFrames[Math.min(selectedFrame, professionalFrames.length - 1)]) {
                        const ctx = el.getContext("2d")
                        if (ctx) {
                          el.width = 300
                          el.height = 200
                          const profFrame = professionalFrames[Math.min(selectedFrame, professionalFrames.length - 1)]
                          ctx.drawImage(profFrame.canvas, 0, 0, 300, 200)
                          drawPoseKeypoints(ctx, profFrame.keyPoints, 0, 0, 300, 200, "blue")
                        }
                      }
                    }}
                    className="border rounded-lg w-full"
                  />
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResults && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{analysisResults.formScore}</div>
                <div className="text-sm text-gray-600">Form Score</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{analysisResults.powerScore}</div>
                <div className="text-sm text-gray-600">Power Chain</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{analysisResults.explosiveness}</div>
                <div className="text-sm text-gray-600">Explosiveness</div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Key Differences Identified</h3>
              <div className="space-y-2">
                {analysisResults.keyDifferences.map((diff: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{diff.area}</div>
                      <div className="text-sm text-gray-600">{diff.difference}</div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded text-xs ${
                        diff.severity === "good"
                          ? "bg-green-100 text-green-800"
                          : diff.severity === "minor"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {diff.severity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
