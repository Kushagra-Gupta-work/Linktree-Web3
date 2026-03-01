"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ExternalLink, Twitter, Instagram, Linkedin, Github, Copy, Check } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function ProfileViewer({ profile, walletAddress, isPreview = false }) {
  const [copied, setCopied] = useState(false)

  const copyProfileUrl = async () => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/profile/${walletAddress}`
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Profile URL copied!",
        description: "Share this link with others to show your profile.",
      })
    }
  }

  const getSocialIcon = (platform) => {
    const icons = {
      twitter: Twitter,
      instagram: Instagram,
      linkedin: Linkedin,
      github: Github,
    }
    const Icon = icons[platform]
    return Icon ? <Icon className="w-5 h-5" /> : null
  }

  const handleLinkClick = async (link) => {
    if (!isPreview) {
      try {
        await fetch("/api/analytics/click", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            walletAddress,
            linkTitle: link.title,
            linkUrl: link.url,
          }),
        })
      } catch (error) {
        console.error("Error tracking click:", error)
      }
    }
    window.open(link.url, "_blank")
  }

  if (!profile) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">No profile data found</p>
          <p className="text-sm text-muted-foreground mt-2">Create your profile in the Profile tab</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      {isPreview && (
        <div className="flex justify-center">
          <Button onClick={copyProfileUrl} variant="outline" size="sm">
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? "Copied!" : "Copy Profile URL"}
          </Button>
        </div>
      )}

      <Card className="text-center">
        <CardContent className="pt-6">
          <Avatar className="w-24 h-24 mx-auto mb-4">
            <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
            <AvatarFallback className="text-2xl">{profile.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>

          <h1 className="text-2xl font-bold mb-2">{profile.name || "Anonymous"}</h1>

          {profile.bio && <p className="text-muted-foreground mb-4">{profile.bio}</p>}

          <div className="text-xs text-muted-foreground">
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </div>
        </CardContent>
      </Card>

      {profile.links && profile.links.length > 0 && (
        <div className="space-y-3">
          {profile.links.map((link, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <a
                  onClick={() => handleLinkClick(link)}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{link.title}</h3>
                    {link.description && <p className="text-sm text-muted-foreground">{link.description}</p>}
                  </div>
                  <ExternalLink className="w-5 h-5 text-muted-foreground" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {profile.socialMedia && Object.values(profile.socialMedia).some((value) => value) && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 text-center">Connect with me</h3>
            <div className="flex justify-center space-x-4">
              {Object.entries(profile.socialMedia).map(([platform, username]) => {
                if (!username) return null

                const Icon = getSocialIcon(platform)
                const getUrl = (platform, username) => {
                  const urls = {
                    twitter: `https://twitter.com/${username.replace("@", "")}`,
                    instagram: `https://instagram.com/${username.replace("@", "")}`,
                    linkedin: username.startsWith("http") ? username : `https://linkedin.com/in/${username}`,
                    github: username.startsWith("http") ? username : `https://github.com/${username}`,
                  }
                  return urls[platform]
                }

                return (
                  <a
                    key={platform}
                    href={getUrl(platform, username)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full hover:bg-muted transition-colors"
                  >
                    {Icon}
                  </a>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
