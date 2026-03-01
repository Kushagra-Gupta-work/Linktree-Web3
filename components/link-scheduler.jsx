"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Plus, Trash2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function LinkScheduler({ walletAddress, profile, onProfileUpdate }) {
  const [scheduledLinks, setScheduledLinks] = useState([])
  const [newSchedule, setNewSchedule] = useState({
    title: "",
    url: "",
    description: "",
    startDate: "",
    endDate: "",
    active: false,
  })

  useEffect(() => {
    loadScheduledLinks()
  }, [walletAddress])

  const loadScheduledLinks = async () => {
    try {
      const response = await fetch(`/api/scheduler/${walletAddress}`)
      if (response.ok) {
        const data = await response.json()
        setScheduledLinks(data)
      }
    } catch (error) {
      console.error("Error loading scheduled links:", error)
    }
  }

  const addScheduledLink = async () => {
    if (!newSchedule.title || !newSchedule.url || !newSchedule.startDate) {
      toast({
        title: "Missing information",
        description: "Please fill in title, URL, and start date.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/scheduler/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress,
          schedule: newSchedule,
        }),
      })

      if (response.ok) {
        loadScheduledLinks()
        setNewSchedule({
          title: "",
          url: "",
          description: "",
          startDate: "",
          endDate: "",
          active: false,
        })

        toast({
          title: "Link scheduled!",
          description: "Your link has been scheduled successfully.",
        })
      } else {
        throw new Error("Failed to schedule link")
      }
    } catch (error) {
      toast({
        title: "Error scheduling link",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const removeScheduledLink = async (index) => {
    try {
      const response = await fetch("/api/scheduler/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress,
          index,
        }),
      })

      if (response.ok) {
        loadScheduledLinks()
        toast({
          title: "Link removed",
          description: "Scheduled link has been removed.",
        })
      } else {
        throw new Error("Failed to remove link")
      }
    } catch (error) {
      toast({
        title: "Error removing link",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (schedule) => {
    const now = new Date()
    const start = new Date(schedule.startDate)
    const end = schedule.endDate ? new Date(schedule.endDate) : null

    if (now < start) {
      return <Badge variant="secondary">Scheduled</Badge>
    } else if (end && now > end) {
      return <Badge variant="outline">Expired</Badge>
    } else {
      return <Badge variant="default">Active</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Schedule New Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Link Title</Label>
              <Input
                id="title"
                value={newSchedule.title}
                onChange={(e) => setNewSchedule((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Event Registration"
              />
            </div>
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={newSchedule.url}
                onChange={(e) => setNewSchedule((prev) => ({ ...prev, url: e.target.value }))}
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              value={newSchedule.description}
              onChange={(e) => setNewSchedule((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Join our upcoming webinar"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-date">Start Date & Time</Label>
              <Input
                id="start-date"
                type="datetime-local"
                value={newSchedule.startDate}
                onChange={(e) => setNewSchedule((prev) => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="end-date">End Date & Time (optional)</Label>
              <Input
                id="end-date"
                type="datetime-local"
                value={newSchedule.endDate}
                onChange={(e) => setNewSchedule((prev) => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>

          <Button onClick={addScheduledLink} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Schedule Link
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scheduled Links</CardTitle>
        </CardHeader>
        <CardContent>
          {scheduledLinks.length > 0 ? (
            <div className="space-y-4">
              {scheduledLinks.map((schedule, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold">{schedule.title}</h3>
                      <p className="text-sm text-muted-foreground">{schedule.url}</p>
                      {schedule.description && (
                        <p className="text-sm text-muted-foreground mt-1">{schedule.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(schedule)}
                      <Button
                        onClick={() => removeScheduledLink(index)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Start: {new Date(schedule.startDate).toLocaleString()}
                    </div>
                    {schedule.endDate && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        End: {new Date(schedule.endDate).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No scheduled links yet. Create your first scheduled link above.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How Link Scheduling Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <strong>Automatic Activation:</strong> Links automatically appear on your profile when the start time is
                reached
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <strong>Time-Limited:</strong> Set an end date to automatically remove links after events or promotions
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <strong>Perfect For:</strong> Product launches, event registrations, limited-time offers, and seasonal
                content
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
