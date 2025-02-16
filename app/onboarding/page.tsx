"use client"

import type React from "react"
import { useState, useRef } from "react"
import { FileIcon, CheckIcon, TrashIcon, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

interface UploadState {
  status: "idle" | "uploading" | "error" | "success"
  progress: number
  fileName?: string
  fileSize?: string
}

interface Step {
  id: number
  title: string
  subtitle: string
}

const steps: Step[] = [
  {
    id: 1,
    title: "Uploading File",
    subtitle: "Please wait while we upload your file",
  },
  {
    id: 2,
    title: "Parsing Resume",
    subtitle: "Using AI to analyze your resume",
  },
  {
    id: 3,
    title: "Generating Job titles",
    subtitle: "This may take a while",
  },
  {
    id: 4,
    title: "Scraping Jobs for you",
    subtitle: "This may take a while",
  },
  {
    id: 5,
    title: "Matching your resume",
    subtitle: "This may take a while",
  },
]

export default function OnboardingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadState, setUploadState] = useState<UploadState>({
    status: "idle",
    progress: 0,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [loading, setLoading] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const formatFileSize = (bytes: number) => {
    return `${Math.round(bytes / 1024)} KB`
  }

  const completeStep = async (stepId: number) => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setCompletedSteps((prev) => [...prev, stepId])
    setCurrentStep(stepId + 1)
    setLoading(false)
  }

  const handleFile = async (file: File) => {
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ["application/pdf"]

    if (file.size > maxSize || !allowedTypes.includes(file.type)) {
      setUploadState({
        status: "error",
        progress: 0,
        fileName: file.name,
        fileSize: formatFileSize(file.size),
      })
      return
    }

    // Start upload
    setUploadState({
      status: "uploading",
      progress: 0,
      fileName: file.name,
      fileSize: formatFileSize(file.size),
    })

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      setUploadState((prev) => ({ ...prev, status: "success", progress: 100 }))
      completeStep(1)
      completeStep(2)
    } catch (error) {
      console.error("Error uploading file:", error)
      setUploadState({
        status: "error",
        progress: 0,
        fileName: file.name,
        fileSize: formatFileSize(file.size),
      })
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleReset = () => {
    setUploadState({
      status: "idle",
      progress: 0,
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setCurrentStep(1)
    setCompletedSteps([])
  }

  const getStepStatus = (stepId: number) => {
    if (completedSteps.includes(stepId)) return "completed"
    if (stepId === currentStep) return "current"
    return "pending"
  }

  const renderUploadContent = () => {
    switch (uploadState.status) {
      case "error":
        return (
          <Alert variant="destructive">
            <AlertTitle>Upload failed</AlertTitle>
            <AlertDescription>
              <div className="flex items-center gap-2 mb-2">
                <FileIcon className="w-5 h-5" />
                <span>{uploadState.fileName}</span>
              </div>
              <p className="mb-3">Please try again</p>
              <Button variant="outline" onClick={handleReset}>
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        )

      case "uploading":
      case "success":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileIcon className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">{uploadState.fileName}</p>
                  <p className="text-sm text-muted-foreground">{uploadState.fileSize}</p>
                </div>
              </div>
              {uploadState.status === "success" ? (
                <CheckIcon className="w-5 h-5 text-primary" />
              ) : (
                <Button variant="ghost" size="icon" onClick={handleReset}>
                  <TrashIcon className="w-5 h-5" />
                </Button>
              )}
            </div>
            <Progress value={uploadState.progress} className="w-full" />
            <div className="text-right text-sm text-muted-foreground">{Math.round(uploadState.progress)}%</div>
          </div>
        )

      default:
        return (
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer",
              isDragging ? "border-primary" : "border-muted",
              "hover:border-primary transition-colors",
            )}
            onClick={() => fileInputRef.current?.click()}
          >
            <FileIcon className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
            <p>
              <span className="text-primary">Click to upload</span>
              {" or drag and drop"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">PNG, SVG, PDF, GIF or JPG (max. 25mb)</p>
          </div>
        )
    }
  }

    const progressHeight = `${((completedSteps.length) / (steps.length - 1)) * 100}%`

  return (
    <div className="container mx-auto py-12 space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Welcome to JEMS</h1>
        <p className="mt-2 text-sm text-muted-foreground">Find better jobs easily by uploading your resume</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Upload Resume</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileInput}
                accept=".pdf"
              />
              {renderUploadContent()}
            </div>
            {uploadState.status === "success" && (
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Processing..." : "Submit Resume"}
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Processing Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-muted" style={{ height: "calc(100% - 4rem)" }}>
                <div
                  className="absolute top-0 w-full bg-primary transition-all duration-500 ease-in-out"
                  style={{
                    height: progressHeight,
                  }}
                />
              </div>
              <div className="relative space-y-8">
                {steps.map((step) => {
                  const status = getStepStatus(step.id)
                  return (
                    <div
                      key={step.id}
                      className={cn(
                        "flex items-start gap-4 transition-opacity duration-300",
                        status === "pending" ? "opacity-50" : "opacity-100",
                      )}
                    >
                      <div
                        className={cn(
                          "relative flex items-center justify-center w-12 h-12 rounded-full border-2 bg-background",
                          status === "completed"
                            ? "border-primary bg-primary"
                            : status === "current"
                              ? "border-primary animate-pulse"
                              : "border-muted",
                        )}
                      >
                        {status === "completed" && <Check className="w-6 h-6 text-primary-foreground" />}
                        {status === "current" && <div className="w-3 h-3 bg-primary rounded-full" />}
                      </div>
                      <div className="pt-2">
                        <h3 className="font-medium">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.subtitle}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

