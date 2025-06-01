"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Pause, RotateCcw } from "lucide-react"

interface VideoFrame {
  timestamp: number
  canvas: HTMLCanvasElement
  keyPoints?: any[]
}

interface VideoProcessorProps {
  videoFile: File | null
  onFramesExtracted: (frames: VideoFrame[]) => void
}

export default function VideoProcessor({ videoFile, onFramesExtracted }: VideoProcessorProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [extractedFrames, setExtractedFrames] = useState<VideoFrame[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  useEffect(() => {
    if (videoFile && videoRef.current) {
      // Clean up previous URL
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl)
      }

      // Create new URL for the video file
      const url = URL.createObjectURL(videoFile)
      setVideoUrl(url)
      videoRef.current.src = url

      // Cleanup function
      return () => {
        if (url) {
          URL.revokeObjectURL(url)
        }
      }
    }
  }, [videoFile])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl)
      }
    }
  }, [])

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const extractKeyFrames = async () => {
    if (!videoRef.current || !canvasRef.current || !duration) return

    setIsProcessing(true)
    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      setIsProcessing(false)
      return
    }

    // Set canvas size to match video
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480

    const frames: VideoFrame[] = []
    const frameCount = 5 // Extract 5 key frames

    try {
      for (let i = 0; i < frameCount; i++) {
        const timestamp = (duration / frameCount) * i

        // Seek to specific time
        video.currentTime = timestamp

        // Wait for seek to complete
        await new Promise<void>((resolve) => {
          const handleSeeked = () => {
            video.removeEventListener("seeked", handleSeeked)
            resolve()
          }
          video.addEventListener("seeked", handleSeeked)

          // Fallback timeout
          setTimeout(resolve, 1000)
        })

        // Small delay to ensure frame is ready
        await new Promise((resolve) => setTimeout(resolve, 100))

        // Draw current frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Create a copy of the canvas for this frame
        const frameCanvas = document.createElement("canvas")
        frameCanvas.width = canvas.width
        frameCanvas.height = canvas.height
        const frameCtx = frameCanvas.getContext("2d")

        if (frameCtx) {
          frameCtx.drawImage(canvas, 0, 0)

          frames.push({
            timestamp,
            canvas: frameCanvas,
            keyPoints: await detectPoseKeyPoints(frameCanvas), // Simplified pose detection
          })
        }
      }

      setExtractedFrames(frames)
      onFramesExtracted(frames)
    } catch (error) {
      console.error("Error extracting frames:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  // Simplified pose detection (in real implementation, this would use MediaPipe)
  const detectPoseKeyPoints = async (canvas: HTMLCanvasElement) => {
    // Mock pose detection - in real implementation, use MediaPipe or similar
    return [
      { name: "left_shoulder", x: 0.3, y: 0.4, confidence: 0.9 },
      { name: "right_shoulder", x: 0.7, y: 0.4, confidence: 0.9 },
      { name: "left_elbow", x: 0.2, y: 0.6, confidence: 0.8 },
      { name: "right_elbow", x: 0.8, y: 0.6, confidence: 0.8 },
      { name: "left_wrist", x: 0.1, y: 0.8, confidence: 0.7 },
      { name: "right_wrist", x: 0.9, y: 0.8, confidence: 0.7 },
    ]
  }

  const resetVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      setCurrentTime(0)
      setIsPlaying(false)
    }
  }

  if (!videoFile) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">No video selected for processing</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Video Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Video Player */}
          <div className="relative">
            <video
              ref={videoRef}
              className="w-full rounded-lg"
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              preload="metadata"
            />

            {/* Video Controls */}
            <div className="flex items-center justify-center space-x-4 mt-4">
              <Button variant="outline" size="sm" onClick={resetVideo}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={togglePlayPause}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <div className="text-sm text-gray-500">
                {Math.round(currentTime)}s / {Math.round(duration)}s
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-red-600 h-2 rounded-full transition-all duration-100"
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Frame Extraction */}
          <div className="border-t pt-4">
            <Button
              onClick={extractKeyFrames}
              disabled={isProcessing || !duration}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? "Extracting Key Frames..." : "Extract Key Frames for Analysis"}
            </Button>
          </div>

          {/* Extracted Frames Preview */}
          {extractedFrames.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Extracted Key Frames</h3>
              <div className="grid grid-cols-5 gap-2">
                {extractedFrames.map((frame, index) => (
                  <div key={index} className="relative">
                    <canvas
                      ref={(el) => {
                        if (el && frame.canvas) {
                          const ctx = el.getContext("2d")
                          if (ctx) {
                            el.width = 150
                            el.height = 100
                            ctx.drawImage(frame.canvas, 0, 0, 150, 100)
                          }
                        }
                      }}
                      className="w-full rounded border"
                    />
                    <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
                      {Math.round(frame.timestamp)}s
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hidden canvas for processing */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </CardContent>
    </Card>
  )
}
