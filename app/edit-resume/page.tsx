"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ArrowRight, Loader2, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import { Resume } from "@/lib/database/types"

// Create form schema
const formSchema = z.object({
  personalInfo: z.object({
    name: z.string().min(1, "Name is required"),
    phone: z.string().min(1, "Phone is required"),
    email: z.string().email("Invalid email"),
    linkedin: z.string().optional(),
    github: z.string().optional(),
  }),
  education: z.array(z.object({
    institution: z.string(),
    degree: z.string(),
    location: z.string(),
    duration: z.string(),
  })),
  experience: z.array(z.object({
    title: z.string(),
    company: z.string(),
    location: z.string(),
    duration: z.string(),
    responsibilities: z.array(z.string()),
    technologies: z.array(z.string()),
  })),
  projects: z.array(z.object({
    name: z.string(),
    duration: z.string(),
    responsibilities: z.array(z.string()),
    technologies: z.array(z.string()),
  })),
  technicalSkills: z.array(z.string()),
  certificationsAchievements: z.array(z.string()),
})

// First, create a type from your schema
type FormValues = z.infer<typeof formSchema>;

export default function EditResumePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [resumeData, setResumeData] = useState<Resume | null>(null)
  const router = useRouter()

  // Then update the useForm hook
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personalInfo: {
        name: "",
        phone: "",
        email: "",
        linkedin: "",
        github: "",
      },
      education: [],
      experience: [],
      projects: [],
      technicalSkills: [],
      certificationsAchievements: [],
    },
  })

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await fetch("/api/get-resume")
        if (!response.ok) throw new Error("Failed to fetch resume")
        const data = await response.json()
        
        // Parse JSON strings back to objects
        const parsedData = {
          ...data,
          education: JSON.parse(data.education),
          experience: JSON.parse(data.experience),
          projects: JSON.parse(data.projects),
          technicalSkills: JSON.parse(data.technicalSkills),
          certificationsAchievements: JSON.parse(data.certificationsAchievements),
        }
        
        setResumeData(parsedData)
        form.reset({
          personalInfo: {
            name: parsedData.personalInfoName,
            phone: parsedData.personalInfoPhone,
            email: parsedData.personalInfoEmail,
            linkedin: parsedData.personalInfoLinkedIn || "",
            github: parsedData.personalInfoGithub || "",
          },
          education: parsedData.education,
          experience: parsedData.experience,
          projects: parsedData.projects,
          technicalSkills: parsedData.technicalSkills,
          certificationsAchievements: parsedData.certificationsAchievements,
        })
      } catch (error) {
        console.error("Error fetching resume:", error)
        toast.error("Failed to load resume data")
      }
    }
    fetchResume()
  }, [])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/update-resume", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!response.ok) throw new Error("Failed to update resume")
      
      toast.success("Resume updated successfully")
      router.push("/dashboard")
    } catch (error) {
      console.error("Error updating resume:", error)
      toast.error("Failed to update resume")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6 md:py-12 px-4 space-y-8">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold">Edit Your Resume</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Fine-tune your parsed resume information
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="personalInfo.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" className="bg-background text-foreground" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Add other personal info fields similarly */}
            </CardContent>
          </Card>

          {/* Education Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {form.watch("education")?.map((_, index) => (
                <div key={index} className="relative space-y-4 p-4 border rounded-lg">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => {
                      const current = form.getValues("education");
                      form.setValue("education", current.filter((_, i) => i !== index));
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <FormField
                    control={form.control}
                    name={`education.${index}.institution`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institution</FormLabel>
                        <FormControl>
                          <Input placeholder="University name" className="bg-background text-foreground" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`education.${index}.degree`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Degree</FormLabel>
                        <FormControl>
                          <Input placeholder="Bachelor of Science" className="bg-background text-foreground" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`education.${index}.location`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="City, Country" className="bg-background text-foreground" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`education.${index}.duration`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration</FormLabel>
                          <FormControl>
                            <Input placeholder="2020 - 2024" className="bg-background text-foreground" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-foreground hover:text-foreground bg-background"
                onClick={() => {
                  const current = form.getValues("education");
                  form.setValue("education", [
                    ...current,
                    {
                      institution: "",
                      degree: "",
                      location: "",
                      duration: "",
                    } as FormValues["education"][number] // Type assertion to match the array element type
                  ]);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Education
              </Button>
            </CardContent>
          </Card>

          {/* Experience Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {form.watch("experience")?.map((_, index) => (
                <div key={index} className="relative space-y-4 p-4 border rounded-lg">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => {
                      const current = form.getValues("experience");
                      form.setValue("experience", current.filter((_, i) => i !== index));
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`experience.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Software Engineer" className="bg-background text-foreground" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`experience.${index}.company`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <FormControl>
                            <Input placeholder="Company Name" className="bg-background text-foreground" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`experience.${index}.location`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="City, Country" className="bg-background text-foreground" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`experience.${index}.duration`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration</FormLabel>
                          <FormControl>
                            <Input placeholder="Jan 2023 - Present" className="bg-background text-foreground" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Responsibilities */}
                  <div className="space-y-2">
                    <Label>Responsibilities</Label>
                    {form.watch(`experience.${index}.responsibilities`)?.map((_, respIndex) => (
                      <div key={respIndex} className="flex gap-2">
                        <FormField
                          control={form.control}
                          name={`experience.${index}.responsibilities.${respIndex}`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder="Responsibility" className="bg-background text-foreground" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const current = form.getValues(`experience.${index}.responsibilities`);
                            form.setValue(
                              `experience.${index}.responsibilities`,
                              current.filter((_, i) => i !== respIndex)
                            );
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-foreground hover:text-foreground bg-background"
                      onClick={() => {
                        const current = form.getValues(`experience.${index}.responsibilities`) || [];
                        form.setValue(`experience.${index}.responsibilities`, [...current, ""]);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Responsibility
                    </Button>
                  </div>

                  {/* Technologies */}
                  <div className="space-y-2">
                    <Label>Technologies</Label>
                    {form.watch(`experience.${index}.technologies`)?.map((_, techIndex) => (
                      <div key={techIndex} className="flex gap-2">
                        <FormField
                          control={form.control}
                          name={`experience.${index}.technologies.${techIndex}`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder="Technology" className="bg-background text-foreground" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const current = form.getValues(`experience.${index}.technologies`);
                            form.setValue(
                              `experience.${index}.technologies`,
                              current.filter((_, i) => i !== techIndex)
                            );
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-foreground hover:text-foreground bg-background"
                      onClick={() => {
                        const current = form.getValues(`experience.${index}.technologies`) || [];
                        form.setValue(`experience.${index}.technologies`, [...current, ""]);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Technology
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-foreground hover:text-foreground bg-background"
                onClick={() => {
                  const current = form.getValues("experience");
                  form.setValue("experience", [
                    ...current,
                    {
                      title: "",
                      company: "",
                      location: "",
                      duration: "",
                      responsibilities: [],
                      technologies: []
                    }
                  ]);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </CardContent>
          </Card>

          {/* Projects Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Projects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {form.watch("projects")?.map((_, index) => (
                <div key={index} className="relative space-y-4 p-4 border rounded-lg bg-card">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => {
                      const current = form.getValues("projects");
                      form.setValue("projects", current.filter((_, i) => i !== index));
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`projects.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Project Name" className="bg-background text-foreground" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`projects.${index}.duration`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration</FormLabel>
                          <FormControl>
                            <Input placeholder="MM/YYYY - MM/YYYY" className="bg-background text-foreground" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Project Responsibilities */}
                  <div className="space-y-2">
                    <Label>Responsibilities</Label>
                    {form.watch(`projects.${index}.responsibilities`)?.map((_, respIndex) => (
                      <div key={respIndex} className="flex gap-2">
                        <FormField
                          control={form.control}
                          name={`projects.${index}.responsibilities.${respIndex}`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Textarea placeholder="Project responsibility" className="bg-background text-foreground" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const current = form.getValues(`projects.${index}.responsibilities`);
                            form.setValue(
                              `projects.${index}.responsibilities`,
                              current.filter((_, i) => i !== respIndex)
                            );
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-foreground hover:text-foreground bg-background"
                      onClick={() => {
                        const current = form.getValues(`projects.${index}.responsibilities`) || [];
                        form.setValue(`projects.${index}.responsibilities`, [...current, ""]);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Responsibility
                    </Button>
                  </div>

                  {/* Project Technologies */}
                  <div className="space-y-2">
                    <Label>Technologies</Label>
                    {form.watch(`projects.${index}.technologies`)?.map((_, techIndex) => (
                      <div key={techIndex} className="flex gap-2">
                        <FormField
                          control={form.control}
                          name={`projects.${index}.technologies.${techIndex}`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder="Technology" className="bg-background text-foreground" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const current = form.getValues(`projects.${index}.technologies`);
                            form.setValue(
                              `projects.${index}.technologies`,
                              current.filter((_, i) => i !== techIndex)
                            );
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-foreground hover:text-foreground bg-background"
                      onClick={() => {
                        const current = form.getValues(`projects.${index}.technologies`) || [];
                        form.setValue(`projects.${index}.technologies`, [...current, ""]);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Technology
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-foreground hover:text-foreground bg-background"
                onClick={() => {
                  const current = form.getValues("projects");
                  form.setValue("projects", [
                    ...current,
                    {
                      name: "",
                      duration: "",
                      responsibilities: [],
                      technologies: []
                    }
                  ]);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </CardContent>
          </Card>

          {/* Technical Skills Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Technical Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {form.watch("technicalSkills")?.map((_, index) => (
                  <div key={index} className="flex items-center gap-2 bg-card p-2 rounded-md border">
                    <FormField
                      control={form.control}
                      name={`technicalSkills.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              className="border-none p-0 h-auto w-auto focus-visible:ring-0 text-foreground bg-background"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4"
                      onClick={() => {
                        const current = form.getValues("technicalSkills");
                        form.setValue("technicalSkills", current.filter((_, i) => i !== index));
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-foreground hover:text-foreground bg-background"
                onClick={() => {
                  const current = form.getValues("technicalSkills") || [];
                  form.setValue("technicalSkills", [...current, ""]);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </Button>
            </CardContent>
          </Card>

          {/* Certifications & Achievements Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Certifications & Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.watch("certificationsAchievements")?.map((_, index) => (
                <div key={index} className="flex items-center gap-2 bg-card p-2 rounded-md border">
                  <FormField
                    control={form.control}
                    name={`certificationsAchievements.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Textarea placeholder="Achievement or certification" className="text-foreground bg-background" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const current = form.getValues("certificationsAchievements");
                      form.setValue("certificationsAchievements", current.filter((_, i) => i !== index));
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-foreground hover:text-foreground bg-background"
                onClick={() => {
                  const current = form.getValues("certificationsAchievements") || [];
                  form.setValue("certificationsAchievements", [...current, ""]);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Achievement
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="group relative"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Save Changes
                  <ArrowRight className="w-4 h-4 transform transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}