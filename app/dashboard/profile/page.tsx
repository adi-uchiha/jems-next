'use client'

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatDistance } from "date-fns"
import {
  User,
  Mail,
  Calendar,
  FileText,
  MessageSquare,
  Github,
  Linkedin,
  Phone,
} from "lucide-react"

interface ProfileData {
  user: {
    name: string
    email: string
    image: string | null
    createdAt: string
  }
  stats: {
    resumeCount: number
    chatCount: number
  }
  latestResume: {
    title: string
    status: string
    personal_info_name: string
    personal_info_email: string
    personal_info_phone: string
    personal_info_linkedin: string | null
    personal_info_github: string | null
    updated_at: string
  } | null
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/dashboard/profile')
        if (!response.ok) throw new Error('Failed to fetch profile')
        const data = await response.json()
        setProfile(data)
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return <div className="p-6">Loading profile...</div>
  }

  if (!profile) {
    return <div className="p-6">Failed to load profile</div>
  }

  return (
    <div className="p-6 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.user.image || ''} />
              <AvatarFallback>{profile.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{profile.user.name}</h1>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{profile.user.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground mt-1">
                <Calendar className="h-4 w-4" />
                <span>Joined {formatDistance(new Date(profile.user.createdAt), new Date(), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Resume Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{profile.stats.resumeCount}</div>
                <p className="text-xs text-muted-foreground">Total Resumes Created</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Chat Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <MessageSquare className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{profile.stats.chatCount}</div>
                <p className="text-xs text-muted-foreground">Total Chat Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Latest Resume */}
      {profile.latestResume && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Latest Active Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{profile.latestResume.title}</h3>
                <Badge variant="outline">{profile.latestResume.status}</Badge>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.latestResume.personal_info_name}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.latestResume.personal_info_email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.latestResume.personal_info_phone}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {profile.latestResume.personal_info_github && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Github className="h-4 w-4 text-muted-foreground" />
                      <a href={profile.latestResume.personal_info_github} target="_blank" rel="noopener noreferrer" 
                         className="text-primary hover:underline">
                        GitHub Profile
                      </a>
                    </div>
                  )}
                  {profile.latestResume.personal_info_linkedin && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Linkedin className="h-4 w-4 text-muted-foreground" />
                      <a href={profile.latestResume.personal_info_linkedin} target="_blank" rel="noopener noreferrer"
                         className="text-primary hover:underline">
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Updated {formatDistance(new Date(profile.latestResume.updated_at), new Date(), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
