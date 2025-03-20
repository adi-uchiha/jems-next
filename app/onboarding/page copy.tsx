"use client"

import type React from "react"
import { useState, useRef } from "react"
import { FileIcon, CheckIcon, Loader2, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { UploadDropzone } from "@/utils/uploadthing"

interface UploadState {
  status: "idle" | "uploading" | "error" | "success"
  progress: number
  fileName?: string
  fileSize?: string
  fileUrl?: string
}

interface Step {
  id: number
  title: string
  subtitle: string
}

const steps: Step[] = [
  {
    id: 1,
    title: "Upload Resume",
    subtitle: "This may take a while",
  },
  {
    id: 2,
    title: "Parsing Resume",
    subtitle: "Using AI to extract text from your resume",
  },
  {
    id: 3,
    title: "Saving your resume",
    subtitle: "Saving your resume to our database",
  },
  {
    id: 4,
    title: "Finding Jobs",
    subtitle: "This may take a while",
  },
  {
    id: 5,
    title: "Matching your resume",
    subtitle: "Finding jobs that match your resume",
  },
]

export default function OnboardingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadState, setUploadState] = useState<UploadState>({
    status: "idle",
    progress: 0,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const completeStep = async (stepId: number) => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setCompletedSteps((prev) => [...prev, stepId])
    setCurrentStep(stepId + 1)
    setLoading(false)
  }

  const processSteps = async () => {
    setIsSubmitting(true)

    try {
      if (!uploadState.fileUrl) throw new Error('No file URL available')

      // Step 2: Parse Resume
      const parseResponse = await fetch("/api/parse-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl: uploadState.fileUrl }),
      })
      if (!parseResponse.ok) throw new Error('Failed to parse resume')
      const parsedData = await parseResponse.json()
      await completeStep(2)
      console.log("Parsed Data", parsedData)

      // Step 3: Save the parsed resume data
      const saveResponse = await fetch('/api/save-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData: parsedData.resumeData })
      })
      console.log("Save resume response:", saveResponse)
      if (!saveResponse.ok) throw new Error('Failed to save resume')
      await completeStep(3)

      // Step 4: Find Jobs
      const findJobsResponse = await fetch('/api/find-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!findJobsResponse.ok) throw new Error('Failed to find jobs')
      await completeStep(4)

      // Step 5: Match Jobs
      const matchJobsResponse = await fetch('/api/match-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!matchJobsResponse.ok) throw new Error('Failed to match jobs')
      await completeStep(5)

    } catch (error) {
      console.error('Error during processing:', error)
      // Handle error appropriately
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async () => {
    await processSteps()
  }

  const getStepStatus = (stepId: number) => {
    if (completedSteps.includes(stepId)) return "completed"
    if (stepId === currentStep && isSubmitting) return "current"
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
              <Button variant="outline" onClick={() => setUploadState({ status: "idle", progress: 0 })}>
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        )

      case "success":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileIcon className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">{uploadState.fileName}</p>
                </div>
              </div>
              <CheckIcon className="w-5 h-5 text-primary" />
            </div>
          </div>
        )

      default:
        return (
          <div className={cn("border-[1px] border-dashed rounded-lg p-6 text-center cursor-pointer")}>
            <FileIcon className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
            <p>
              <span className="text-primary">Click to upload</span>
              {" or drag and drop"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">PDF (max. 8mb)</p>
          </div>
        )
    }
  }

  return (
    <div className="container mx-auto py-6 md:py-12 px-4 space-y-8 md:space-y-12">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold">Welcome to JEMS</h1>
        <p className="mt-2 text-sm text-muted-foreground">Find better jobs easily by uploading your resume</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Upload Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div 
              className="min-h-[300px] flex flex-col"
              layout
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <motion.div 
                className="flex-1 flex flex-col justify-center"
                layout
              >
                {uploadState.status === "success" ? (
                  renderUploadContent()
                ) : (
                  <UploadDropzone
                    endpoint="uploadResume"
                    onClientUploadComplete={(res) => {
                      if (res && res.length > 0) {
                        setUploadState(prevState => ({
                          ...prevState,
                          status: "success",
                          fileName: res[0].name,
                          fileUrl: res[0].url,
                        }))
                      }
                    }}
                    onUploadError={(error) => {
                      console.error("Upload Error:", error)
                      setUploadState(prevState => ({
                        ...prevState,
                        status: "error",
                      }))
                    }}
                  />
                )}
              </motion.div>
              <AnimatePresence mode="popLayout">
                {uploadState.status === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-4"
                    layout
                  >
                    <Button 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        "Submit Resume"
                      )}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Processing Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <motion.div 
                className="absolute left-4 top-4 w-0.5 bg-muted"
                style={{ height: `${((steps.length) * 40) + 55}px` }}
              >
                <motion.div
                  className="absolute top-0 w-full bg-primary origin-top"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: Math.min((completedSteps.length / steps.length), 1) }}
                  transition={{ duration: 0.5 }}
                  style={{ height: "100%" }}
                />
              </motion.div>
              <div className="relative space-y-6">
                {steps.map((step) => {
                  const status = getStepStatus(step.id)
                  return (
                    <div
                      key={step.id}
                      className={cn(
                        "flex items-start gap-4 transition-opacity duration-300 h-10",
                        status === "pending" ? "opacity-50" : "opacity-100",
                      )}
                    >
                      <div
                        className={cn(
                          "relative flex items-center justify-center w-8 h-8 rounded-full border-2 bg-background",
                          status === "completed"
                            ? "border-primary bg-primary"
                            : status === "current" && isSubmitting
                              ? "border-primary"
                              : "border-muted",
                        )}
                      >
                        {status === "completed" ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <CheckIcon className="w-4 h-4 text-primary-foreground" />
                          </motion.div>
                        ) : status === "current" && isSubmitting ? (
                          <Loader2 className="w-4 h-4 text-primary animate-spin" />
                        ) : null}
                      </div>
                      <div className="pt-1">
                        <h3 className="text-sm font-medium">{step.title}</h3>
                        <p className="text-xs text-muted-foreground">{step.subtitle}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              <AnimatePresence mode="popLayout">
                {completedSteps.length === steps.length && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-8"
                  >
                    <Button 
                      onClick={() => router.push('/edit-resume')}
                      className="w-full group relative"
                      variant="secondary"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Continue to Edit Resume
                        <ArrowRight className="w-4 h-4 transform transition-transform duration-200 group-hover:translate-x-1" />
                      </span>
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      Review your parsed resume
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

