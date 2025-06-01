"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, Camera, Loader2, CheckCircle, ArrowRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type UploadStep = "user-video" | "professional-video" | "ready-to-analyze"

export default function UploadPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<UploadStep>("user-video")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Separate state for user and professional videos
  const [userVideo, setUserVideo] = useState<File | null>(null)
  const [userVideoPreview, setUserVideoPreview] = useState<string | null>(null)
  const [professionalVideo, setProfessionalVideo] = useState<File | null>(null)
  const [professionalVideoPreview, setProfessionalVideoPreview] = useState<string | null>(null)

  // Technique information
  const [selectedTechnique, setSelectedTechnique] = useState("")
  const [experienceLevel, setExperienceLevel] = useState("")

  const handleUserVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUserVideo(file)
      const url = URL.createObjectURL(file)
      setUserVideoPreview(url)
    }
  }

  const handleProfessionalVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfessionalVideo(file)
      const url = URL.createObjectURL(file)
      setProfessionalVideoPreview(url)
    }
  }

  const proceedToNextStep = () => {
    if (currentStep === "user-video" && userVideo) {
      setCurrentStep("professional-video")
    } else if (currentStep === "professional-video" && professionalVideo) {
      setCurrentStep("ready-to-analyze")
    }
  }

  const simulateQuickAnalysis = () => {
    setIsUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + 5
        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsUploading(false)
            router.push("/analysis/result")
          }, 500)
          return 100
        }
        return newProgress
      })
    }, 200)
  }

  const goToEnhancedAnalysis = () => {
    // Store videos in sessionStorage for the enhanced analysis page
    if (userVideo && professionalVideo) {
      const userVideoUrl = URL.createObjectURL(userVideo)
      const professionalVideoUrl = URL.createObjectURL(professionalVideo)

      sessionStorage.setItem("userVideoUrl", userVideoUrl)
      sessionStorage.setItem("professionalVideoUrl", professionalVideoUrl)
      sessionStorage.setItem("selectedTechnique", selectedTechnique)
      sessionStorage.setItem("experienceLevel", experienceLevel)

      router.push("/analysis/enhanced-result")
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Upload Your Technique</h1>

      {/* Progress Indicator */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div className={`flex items-center ${currentStep === "user-video" ? "text-red-600" : "text-green-600"}`}>
            {currentStep !== "user-video" ? (
              <CheckCircle className="h-6 w-6 mr-2" />
            ) : (
              <div className="h-6 w-6 mr-2 rounded-full border-2 border-current flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-current"></div>
              </div>
            )}
            <span className="font-medium">1. Upload Your Video</span>
          </div>

          <ArrowRight className="h-5 w-5 text-gray-400" />

          <div
            className={`flex items-center ${
              currentStep === "professional-video"
                ? "text-red-600"
                : currentStep === "ready-to-analyze"
                  ? "text-green-600"
                  : "text-gray-400"
            }`}
          >
            {currentStep === "ready-to-analyze" ? (
              <CheckCircle className="h-6 w-6 mr-2" />
            ) : currentStep === "professional-video" ? (
              <div className="h-6 w-6 mr-2 rounded-full border-2 border-current flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-current"></div>
              </div>
            ) : (
              <div className="h-6 w-6 mr-2 rounded-full border-2 border-gray-300"></div>
            )}
            <span className="font-medium">2. Upload Reference</span>
          </div>

          <ArrowRight className="h-5 w-5 text-gray-400" />

          <div className={`flex items-center ${currentStep === "ready-to-analyze" ? "text-red-600" : "text-gray-400"}`}>
            <div
              className={`h-6 w-6 mr-2 rounded-full border-2 ${
                currentStep === "ready-to-analyze" ? "border-red-600" : "border-gray-300"
              } flex items-center justify-center`}
            >
              {currentStep === "ready-to-analyze" && <div className="h-3 w-3 rounded-full bg-red-600"></div>}
            </div>
            <span className="font-medium">3. Analyze</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Step 1: Upload User Video */}
        {currentStep === "user-video" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-red-600 text-white flex items-center justify-center mr-3 text-sm font-bold">
                  1
                </div>
                Upload Your Practice Video
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="upload">Upload Video</TabsTrigger>
                  <TabsTrigger value="record">Record Video</TabsTrigger>
                </TabsList>

                <TabsContent value="upload">
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                    {userVideoPreview ? (
                      <div className="w-full">
                        <video src={userVideoPreview} controls className="w-full max-h-[400px] rounded-lg mb-4" />
                        <p className="text-sm text-gray-500 mb-4">
                          {userVideo?.name} ({Math.round((userVideo?.size / 1024 / 1024) * 10) / 10} MB)
                        </p>
                        <div className="flex items-center justify-center text-green-600 mb-4">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          <span>Video uploaded successfully!</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium mb-2">Drag and drop your video here</h3>
                        <p className="text-sm text-gray-500 mb-4">Or click to browse (MP4, MOV, up to 60 seconds)</p>
                      </>
                    )}

                    <div className="mt-4">
                      <input
                        type="file"
                        id="user-video-upload"
                        accept="video/*"
                        className="hidden"
                        onChange={handleUserVideoChange}
                      />
                      <label htmlFor="user-video-upload">
                        <Button variant={userVideoPreview ? "outline" : "default"} className="cursor-pointer" asChild>
                          <span>{userVideoPreview ? "Choose Different Video" : "Select Video"}</span>
                        </Button>
                      </label>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="record">
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <Camera className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Record your technique</h3>
                    <p className="text-sm text-gray-500 mb-4">Use your device camera to record up to 60 seconds</p>
                    <Button className="mt-4">Start Recording</Button>
                  </div>
                </TabsContent>
              </Tabs>

              {userVideo && (
                <div className="mt-6 flex justify-center">
                  <Button onClick={proceedToNextStep} className="bg-red-600 hover:bg-red-700">
                    Continue to Reference Video
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Upload Professional Video */}
        {currentStep === "professional-video" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-red-600 text-white flex items-center justify-center mr-3 text-sm font-bold">
                  2
                </div>
                Upload Professional Reference Video
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-blue-900 mb-2">Professional Reference</h3>
                <p className="text-sm text-blue-700">
                  Upload a video of a professional Muay Thai fighter performing the same technique. This will be used as
                  the reference standard for comparison analysis.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-lg p-12 text-center">
                {professionalVideoPreview ? (
                  <div className="w-full">
                    <video src={professionalVideoPreview} controls className="w-full max-h-[400px] rounded-lg mb-4" />
                    <p className="text-sm text-gray-500 mb-4">
                      {professionalVideo?.name} ({Math.round((professionalVideo?.size / 1024 / 1024) * 10) / 10} MB)
                    </p>
                    <div className="flex items-center justify-center text-green-600 mb-4">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span>Professional reference uploaded successfully!</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-blue-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Upload Professional Reference Video</h3>
                    <p className="text-sm text-gray-500 mb-4">MP4, MOV, up to 60 seconds</p>
                  </>
                )}

                <div className="mt-4">
                  <input
                    type="file"
                    id="professional-video-upload"
                    accept="video/*"
                    className="hidden"
                    onChange={handleProfessionalVideoChange}
                  />
                  <label htmlFor="professional-video-upload">
                    <Button
                      variant="outline"
                      className="cursor-pointer border-blue-300 text-blue-600 hover:bg-blue-50"
                      asChild
                    >
                      <span>{professionalVideoPreview ? "Choose Different Video" : "Select Professional Video"}</span>
                    </Button>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep("user-video")}>
                  Back to Your Video
                </Button>
                {professionalVideo && (
                  <Button onClick={proceedToNextStep} className="bg-red-600 hover:bg-red-700">
                    Continue to Analysis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Ready to Analyze */}
        {currentStep === "ready-to-analyze" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-red-600 text-white flex items-center justify-center mr-3 text-sm font-bold">
                  3
                </div>
                Ready to Analyze
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Video Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    Your Video
                  </h3>
                  {userVideoPreview && <video src={userVideoPreview} className="w-full h-32 object-cover rounded" />}
                  <p className="text-sm text-gray-500 mt-2">{userVideo?.name}</p>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    Professional Reference
                  </h3>
                  {professionalVideoPreview && (
                    <video src={professionalVideoPreview} className="w-full h-32 object-cover rounded" />
                  )}
                  <p className="text-sm text-gray-500 mt-2">{professionalVideo?.name}</p>
                </div>
              </div>

              {/* Technique Information */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Technique Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Technique Type</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={selectedTechnique}
                      onChange={(e) => setSelectedTechnique(e.target.value)}
                    >
                      <option value="">Select technique</option>
                      <option value="jab">Jab</option>
                      <option value="cross">Cross</option>
                      <option value="hook">Hook</option>
                      <option value="uppercut">Uppercut</option>
                      <option value="teep">Teep (Push Kick)</option>
                      <option value="roundhouse">Roundhouse Kick</option>
                      <option value="elbow">Elbow Strike</option>
                      <option value="knee">Knee Strike</option>
                      <option value="combo">Combination</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value)}
                    >
                      <option value="">Select level</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Analysis Options */}
              {isUploading ? (
                <div className="text-center">
                  <p className="mb-2">Processing your analysis...</p>
                  <Progress value={uploadProgress} className="h-2 mb-2" />
                  <p className="text-sm text-gray-500">{uploadProgress}%</p>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <Button size="lg" onClick={simulateQuickAnalysis} className="bg-red-600 hover:bg-red-700">
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing
                      </>
                    ) : (
                      "Quick Analysis"
                    )}
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    onClick={goToEnhancedAnalysis}
                    className="border-red-600 text-red-600 hover:bg-red-50"
                  >
                    Enhanced Analysis & Compare
                  </Button>
                </div>
              )}

              <div className="mt-6 flex justify-center">
                <Button variant="ghost" onClick={() => setCurrentStep("professional-video")}>
                  Back to Edit Videos
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
