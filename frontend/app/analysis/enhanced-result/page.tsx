"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Share2, CheckCircle, Loader2 } from "lucide-react"
import VideoProcessor from "../video-processor"
import PoseComparison from "../pose-comparison"

export default function EnhancedAnalysisPage() {
  const [userVideo, setUserVideo] = useState<File | null>(null)
  const [professionalVideo, setProfessionalVideo] = useState<File | null>(null)
  const [userFrames, setUserFrames] = useState<any[]>([])
  const [professionalFrames, setProfessionalFrames] = useState<any[]>([])
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [selectedTechnique, setSelectedTechnique] = useState("")
  const [experienceLevel, setExperienceLevel] = useState("")
  const [isLoadingVideos, setIsLoadingVideos] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load videos from sessionStorage
  useEffect(() => {
    const loadVideosFromStorage = async () => {
      try {
        const userUrl = sessionStorage.getItem("userVideoUrl")
        const professionalUrl = sessionStorage.getItem("professionalVideoUrl")
        const technique = sessionStorage.getItem("selectedTechnique") || ""
        const level = sessionStorage.getItem("experienceLevel") || ""

        setSelectedTechnique(technique)
        setExperienceLevel(level)

        if (userUrl && professionalUrl) {
          // Convert blob URLs back to File objects
          const userFile = await createFileFromBlobUrl(userUrl, "user-video.mp4")
          const professionalFile = await createFileFromBlobUrl(professionalUrl, "professional-video.mp4")

          setUserVideo(userFile)
          setProfessionalVideo(professionalFile)
        } else {
          setError("Video data not found. Please upload videos again.")
        }
      } catch (err) {
        console.error("Error loading videos:", err)
        setError("Failed to load videos. Please upload again.")
      } finally {
        setIsLoadingVideos(false)
      }
    }

    loadVideosFromStorage()
  }, [])

  const createFileFromBlobUrl = async (blobUrl: string, filename: string): Promise<File> => {
    try {
      const response = await fetch(blobUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch blob: ${response.statusText}`)
      }
      const blob = await response.blob()
      return new File([blob], filename, { type: blob.type || "video/mp4" })
    } catch (error) {
      console.error("Error creating file from blob URL:", error)
      throw error
    }
  }

  const handleUserFramesExtracted = (frames: any[]) => {
    setUserFrames(frames)
    checkAnalysisComplete(frames, professionalFrames)
  }

  const handleProfessionalFramesExtracted = (frames: any[]) => {
    setProfessionalFrames(frames)
    checkAnalysisComplete(userFrames, frames)
  }

  const checkAnalysisComplete = (userF: any[], profF: any[]) => {
    if (userF.length > 0 && profF.length > 0) {
      setAnalysisComplete(true)
    }
  }

  if (isLoadingVideos) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Loading Videos...</h1>
          <p className="text-gray-600">Please wait while we prepare your videos for analysis.</p>
        </div>
      </div>
    )
  }

  if (error || !userVideo || !professionalVideo) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Videos Not Found</h1>
          <p className="text-gray-600 mb-8">{error || "Please upload your videos first to proceed with analysis."}</p>
          <Button asChild className="bg-red-600 hover:bg-red-700">
            <Link href="/upload">Go to Upload</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/upload">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Upload
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Enhanced Video Analysis</h1>
      </div>

      {/* Video Information Summary */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Analysis Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <div className="font-medium">Your Video</div>
                <div className="text-sm text-gray-500">
                  {userVideo.name} ({Math.round((userVideo.size / 1024 / 1024) * 10) / 10} MB)
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <div className="font-medium">Professional Reference</div>
                <div className="text-sm text-gray-500">
                  {professionalVideo.name} ({Math.round((professionalVideo.size / 1024 / 1024) * 10) / 10} MB)
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="h-5 w-5 rounded-full border-2 border-red-600 flex items-center justify-center mr-2">
                <div className="h-2 w-2 rounded-full bg-red-600"></div>
              </div>
              <div>
                <div className="font-medium">Technique: {selectedTechnique || "Not specified"}</div>
                <div className="text-sm text-gray-500">Level: {experienceLevel || "Not specified"}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* User Video Processing */}
        <Card>
          <CardHeader>
            <CardTitle>Your Technique Video</CardTitle>
          </CardHeader>
          <CardContent>
            <VideoProcessor videoFile={userVideo} onFramesExtracted={handleUserFramesExtracted} />
          </CardContent>
        </Card>

        {/* Professional Video Processing */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Reference Video</CardTitle>
          </CardHeader>
          <CardContent>
            <VideoProcessor videoFile={professionalVideo} onFramesExtracted={handleProfessionalFramesExtracted} />
          </CardContent>
        </Card>
      </div>

      {/* Pose Comparison Analysis */}
      {analysisComplete && <PoseComparison userFrames={userFrames} professionalFrames={professionalFrames} />}

      {/* Action Buttons */}
      {analysisComplete && (
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="flex justify-center space-x-4">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Analysis
              </Button>
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share Results
              </Button>
              <Button asChild className="bg-red-600 hover:bg-red-700">
                <Link href="/journey">Save to Journey</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      {!analysisComplete && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Processing Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Click "Extract Key Frames for Analysis" on your technique video</li>
              <li>Click "Extract Key Frames for Analysis" on the professional reference video</li>
              <li>Wait for both videos to be processed</li>
              <li>View the detailed pose comparison analysis</li>
              <li>Review scoring and feedback based on the comparison</li>
            </ol>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> The analysis will automatically begin once both videos have been processed. This
                may take a few moments depending on video length and quality.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
