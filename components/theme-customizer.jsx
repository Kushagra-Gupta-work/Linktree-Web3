"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Palette, Check } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function ThemeCustomizer({ currentTheme, onThemeChange, walletAddress }) {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme)

  const themes = [
    {
      id: "default",
      name: "Default",
      description: "Clean and minimal",
      colors: ["#6366f1", "#8b5cf6", "#06b6d4"],
      preview: "bg-gradient-to-r from-indigo-500 to-purple-500",
    },
    {
      id: "dark",
      name: "Dark Mode",
      description: "Easy on the eyes",
      colors: ["#1f2937", "#374151", "#6b7280"],
      preview: "bg-gradient-to-r from-gray-800 to-gray-600",
    },
    {
      id: "ocean",
      name: "Ocean",
      description: "Blue and teal vibes",
      colors: ["#0ea5e9", "#06b6d4", "#0891b2"],
      preview: "bg-gradient-to-r from-sky-500 to-cyan-500",
    },
    {
      id: "sunset",
      name: "Sunset",
      description: "Warm orange and pink",
      colors: ["#f97316", "#ec4899", "#ef4444"],
      preview: "bg-gradient-to-r from-orange-500 to-pink-500",
    },
    {
      id: "forest",
      name: "Forest",
      description: "Natural green tones",
      colors: ["#059669", "#10b981", "#34d399"],
      preview: "bg-gradient-to-r from-emerald-600 to-emerald-400",
    },
    {
      id: "neon",
      name: "Neon",
      description: "Bright and electric",
      colors: ["#a855f7", "#ec4899", "#06b6d4"],
      preview: "bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500",
    },
  ]

  const applyTheme = async (themeId) => {
    setSelectedTheme(themeId)
    onThemeChange(themeId)

    toast({
      title: "Theme applied!",
      description: `Switched to ${themes.find((t) => t.id === themeId)?.name} theme.`,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Choose Your Theme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((theme) => (
              <Card
                key={theme.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTheme === theme.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => applyTheme(theme.id)}
              >
                <CardContent className="p-4">
                  <div className={`h-20 rounded-lg mb-3 ${theme.preview}`}></div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{theme.name}</h3>
                    {selectedTheme === theme.id && <Check className="w-4 h-4 text-green-500" />}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{theme.description}</p>
                  <div className="flex gap-1">
                    {theme.colors.map((color, index) => (
                      <div key={index} className="w-4 h-4 rounded-full border" style={{ backgroundColor: color }}></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custom CSS</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Advanced users can add custom CSS to further personalize their profile
          </p>
          <textarea
            className="w-full h-32 p-3 border rounded-lg font-mono text-sm"
            placeholder="/* Add your custom CSS here */
.profile-card {
  border-radius: 20px;
}

.link-button {
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
}"
          />
          <div className="flex justify-end mt-4">
            <Button variant="outline">Save Custom CSS</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
