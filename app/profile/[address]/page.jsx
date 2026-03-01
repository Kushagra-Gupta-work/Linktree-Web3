"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Twitter, Github, Instagram, Linkedin } from "lucide-react"

const themes = [
  { id: "default", name: "Default", bg: "bg-gradient-to-br from-purple-50 to-blue-50", card: "bg-white" },
  { id: "dark", name: "Dark", bg: "bg-gradient-to-br from-gray-900 to-black", card: "bg-gray-800" },
  { id: "ocean", name: "Ocean", bg: "bg-gradient-to-br from-blue-100 to-cyan-100", card: "bg-white" },
  { id: "sunset", name: "Sunset", bg: "bg-gradient-to-br from-orange-100 to-pink-100", card: "bg-white" },
  { id: "forest", name: "Forest", bg: "bg-gradient-to-br from-green-100 to-emerald-100", card: "bg-white" },
  { id: "neon", name: "Neon", bg: "bg-gradient-to-br from-purple-900 to-pink-900", card: "bg-black border-purple-500" },
]

export default function PublicProfile() {
  const params = useParams()
  const address = params.address
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true)

      try {
        const response = await fetch(`/api/profile/${address}`)
        if (response.ok) {
          const profileData = await response.json()
          setProfile(profileData)
        } else if (response.status === 404) {
          setProfile(null)
        } else {
          throw new Error("Failed to load profile")
        }
      } catch (error) {
        console.error("Error loading profile:", error)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    if (address) {
      loadProfile()
    }
  }, [address])

  const handleLinkClick = (link) => {
    // Track click analytics
    window.open(link.url, "_blank")
  }

  const getSocialIcon = (platform) => {
    const icons = {
      twitter: Twitter,
      instagram: Instagram,
      linkedin: Linkedin,
      github: Github,
    }
    return icons[platform]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
            <p className="text-muted-foreground">No Web3 Linktree profile found for this address.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentTheme = themes.find((t) => t.id === profile.theme) || themes[0]

  return (
    <div className={`min-h-screen ${currentTheme.bg} p-4`}>
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className={`${currentTheme.card} border-0 shadow-lg`}>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Avatar className="h-24 w-24 mx-auto">
                <AvatarImage src={profile.avatar || "/placeholder.svg"} />
                <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-muted-foreground mt-2">{profile.bio}</p>
                <Badge variant="secondary" className="mt-2">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </Badge>
              </div>

              <div className="flex justify-center gap-3">
                {Object.entries(profile.socialMedia).map(([platform, username]) => {
                  if (!username) return null
                  const Icon = getSocialIcon(platform)
                  if (!Icon) return null

                  const getUrl = (platform, username) => {
                    const urls = {
                      twitter: `https://twitter.com/${username}`,
                      github: `https://github.com/${username}`,
                      linkedin: `https://linkedin.com/in/${username}`,
                      instagram: `https://instagram.com/${username}`,
                    }
                    return urls[platform]
                  }

                  return (
                    <Button key={platform} variant="ghost" size="sm" asChild>
                      <a href={getUrl(platform, username)} target="_blank" rel="noreferrer">
                        <Icon className="h-4 w-4" />
                      </a>
                    </Button>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {profile.links
            .filter((link) => link.active)
            .map((link, index) => (
              <Card
                key={index}
                className={`${currentTheme.card} border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer`}
                onClick={() => handleLinkClick(link)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{link.title}</h3>
                      {link.description && <p className="text-sm text-muted-foreground mt-1">{link.description}</p>}
                    </div>
                    <ExternalLink className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Powered by Web3 Linktree • Stored on IPFS</p>
        </div>
      </div>
    </div>
  )
}
