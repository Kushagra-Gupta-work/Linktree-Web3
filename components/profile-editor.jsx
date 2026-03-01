"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Save } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function ProfileEditor({ walletAddress, profile, onProfileUpdate }) {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    avatar: "",
    links: [],
    socialMedia: {
      twitter: "",
      instagram: "",
      linkedin: "",
      github: "",
    },
  })
  const [isSaving, setSaving] = useState(false)

  useEffect(() => {
    if (profile) {
      setFormData(profile)
    }
  }, [profile])

  const addLink = () => {
    setFormData((prev) => ({
      ...prev,
      links: [...prev.links, { title: "", url: "", description: "", active: true }],
    }))
  }

  const updateLink = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.map((link, i) => (i === index ? { ...link, [field]: value } : link)),
    }))
  }

  const removeLink = (index) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }))
  }

  const updateSocialMedia = (platform, value) => {
    setFormData((prev) => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [platform]: value },
    }))
  }

  const saveProfile = async () => {
    setSaving(true)

    try {
      const response = await fetch("/api/profile/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress,
          profile: formData,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        onProfileUpdate(formData)
        toast({
          title: "Profile saved to IPFS!",
          description: `IPFS Hash: ${result.ipfsHash.slice(0, 20)}...`,
        })
      } else {
        throw new Error(result.error || "Failed to save profile")
      }
    } catch (error) {
      toast({
        title: "Error saving profile",
        description: error.message,
        variant: "destructive",
      })
      console.error("Save error:", error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Your display name"
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell people about yourself"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="avatar">Avatar URL</Label>
            <Input
              id="avatar"
              value={formData.avatar}
              onChange={(e) => setFormData((prev) => ({ ...prev, avatar: e.target.value }))}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Links</CardTitle>
            <Button onClick={addLink} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Link
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.links.map((link, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <Badge variant="outline">Link {index + 1}</Badge>
                <Button
                  onClick={() => removeLink(index)}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={link.title}
                    onChange={(e) => updateLink(index, "title", e.target.value)}
                    placeholder="Link title"
                  />
                </div>
                <div>
                  <Label>URL</Label>
                  <Input
                    value={link.url}
                    onChange={(e) => updateLink(index, "url", e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div>
                <Label>Description (optional)</Label>
                <Input
                  value={link.description}
                  onChange={(e) => updateLink(index, "description", e.target.value)}
                  placeholder="Brief description"
                />
              </div>
            </div>
          ))}

          {formData.links.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No links added yet. Click "Add Link" to get started.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Twitter</Label>
              <Input
                value={formData.socialMedia.twitter}
                onChange={(e) => updateSocialMedia("twitter", e.target.value)}
                placeholder="@username"
              />
            </div>
            <div>
              <Label>Instagram</Label>
              <Input
                value={formData.socialMedia.instagram}
                onChange={(e) => updateSocialMedia("instagram", e.target.value)}
                placeholder="@username"
              />
            </div>
            <div>
              <Label>LinkedIn</Label>
              <Input
                value={formData.socialMedia.linkedin}
                onChange={(e) => updateSocialMedia("linkedin", e.target.value)}
                placeholder="linkedin.com/in/username"
              />
            </div>
            <div>
              <Label>GitHub</Label>
              <Input
                value={formData.socialMedia.github}
                onChange={(e) => updateSocialMedia("github", e.target.value)}
                placeholder="github.com/username"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={saveProfile} disabled={isSaving} size="lg">
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </div>
  )
}
