'use client'

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  FileText, MessageSquare, Search, UserCircle, Mail, 
  Calendar, Github, Linkedin, Phone, Check, AlertCircle 
} from "lucide-react"
import { format, formatDistance } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface ProfileData {
  user: {
    id: string
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
    id: number
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

interface ProfileStats {
  resume: {
    total: number
    active: number
  }
  chat: {
    totalChats: number
    totalMessages: number
  }
  scraping: {
    totalSessions: number
    totalJobsScraped: number
    totalFailedJobs: number
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [stats, setStats] = useState<ProfileStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, statsRes] = await Promise.all([
          fetch('/api/dashboard/profile'),
          fetch('/api/dashboard/profile-stats')
        ])
        
        if (!profileRes.ok || !statsRes.ok) throw new Error('Failed to fetch data')
        
        const profileData = await profileRes.json()
        const statsData = await statsRes.json()
        
        setProfile(profileData)
        setStats(statsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="p-6">Loading profile...</div>
  }

  if (!profile || !stats) {
    return <div className="p-6">Failed to load profile data</div>
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Profile Header Card */}
      <Card className="border-border/50">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.user.image || ''} />
              <AvatarFallback>
                <UserCircle className="w-24 h-24" />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-3">
              <div>
                <h1 className="text-3xl font-bold">{profile.user.name}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <Mail className="h-4 w-4" />
                  <span>{profile.user.email}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  <Calendar className="h-3 w-3 mr-1" />
                  Joined {format(new Date(profile.user.createdAt), 'MMMM yyyy')}
                </Badge>
                <Badge variant="secondary">
                  <FileText className="h-3 w-3 mr-1" />
                  {stats.resume.total} Resume{stats.resume.total !== 1 ? 's' : ''}
                </Badge>
                <Badge variant="secondary">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  {stats.chat.totalChats} Chat{stats.chat.totalChats !== 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Resume Stats */}
        <StatCard
          title="Resume Statistics"
          icon={FileText}
          stats={[
            { label: "Total Resumes", value: stats.resume.total },
            { label: "Active Resumes", value: stats.resume.active },
          ]}
        />

        {/* Chat Stats */}
        <StatCard
          title="Chat Statistics"
          icon={MessageSquare}
          stats={[
            { label: "Total Chats", value: stats.chat.totalChats },
            { label: "Total Messages", value: stats.chat.totalMessages },
          ]}
        />

        {/* Scraping Stats */}
        <StatCard
          title="Scraping Statistics"
          icon={Search}
          stats={[
            { label: "Total Sessions", value: stats.scraping.totalSessions },
            { label: "Jobs Scraped", value: stats.scraping.totalJobsScraped },
            { label: "Failed Jobs", value: stats.scraping.totalFailedJobs },
          ]}
        />
      </div>

      {/* Latest Resume Card */}
      {profile.latestResume && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Latest Active Resume
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{profile.latestResume.title}</h3>
              <Badge variant="outline" className="capitalize">
                {profile.latestResume.status}
              </Badge>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <ContactItem
                  icon={UserCircle}
                  label="Full Name"
                  value={profile.latestResume.personal_info_name}
                />
                <ContactItem
                  icon={Mail}
                  label="Email"
                  value={profile.latestResume.personal_info_email}
                />
                <ContactItem
                  icon={Phone}
                  label="Phone"
                  value={profile.latestResume.personal_info_phone}
                />
              </div>
              <div className="space-y-4">
                {profile.latestResume.personal_info_github && (
                  <ContactItem
                    icon={Github}
                    label="GitHub"
                    value={profile.latestResume.personal_info_github}
                    isLink
                  />
                )}
                {profile.latestResume.personal_info_linkedin && (
                  <ContactItem
                    icon={Linkedin}
                    label="LinkedIn"
                    value={profile.latestResume.personal_info_linkedin}
                    isLink
                  />
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Updated {formatDistance(new Date(profile.latestResume.updated_at), new Date(), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Helper Components
type StatItem = {
  label: string
  value: number
}

function StatCard({ title, icon: Icon, stats }: { title: string, icon: React.ComponentType<{ className?: string }>, stats: StatItem[] }) {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            {stats.map((stat: StatItem, index: number) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <span className="font-medium">{stat.value}</span>
            </div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ContactItem({
  icon: Icon,
  label,
  value,
  isLink = false,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  isLink?: boolean
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="text-muted-foreground">{label}:</span>
      {isLink ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {value}
        </a>
      ) : (
        <span>{value}</span>
      )}
    </div>
  )
}
