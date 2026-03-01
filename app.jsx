"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletConnect } from "./components/wallet-connect"
import { ProfileEditor } from "./components/profile-editor"
import { ProfileViewer } from "./components/profile-viewer"
import { Analytics } from "./components/analytics"
import { ThemeCustomizer } from "./components/theme-customizer"
import { QRGenerator } from "./components/qr-generator"
import { LinkScheduler } from "./components/link-scheduler"
import { Wallet, User, BarChart3, Palette, QrCode, Calendar } from "lucide-react"

export default function Web3Linktree() {
  const [walletAddress, setWalletAddress] = useState("")
  const [profile, setProfile] = useState(null)
  const [activeTab, setActiveTab] = useState("profile")
  const [theme, setTheme] = useState("default")

  useEffect(() => {
    // Check if wallet was previously connected
    const savedAddress = localStorage.getItem("walletAddress")
    if (savedAddress) {
      setWalletAddress(savedAddress)
      loadProfile(savedAddress)
    }
  }, [])

  const loadProfile = async (address) => {
    try {
      // Load profile from IPFS via Pinata
      const response = await fetch(`/api/profile/${address}`)
      if (response.ok) {
        const profileData = await response.json()
        setProfile(profileData)
      }
    } catch (error) {
      console.error("Error loading profile:", error)
    }
  }

  const handleWalletConnect = (address) => {
    setWalletAddress(address)
    localStorage.setItem("walletAddress", address)
    loadProfile(address)
  }

  const handleWalletDisconnect = () => {
    setWalletAddress("")
    setProfile(null)
    localStorage.removeItem("walletAddress")
  }

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile)
  }

  if (!walletAddress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Web3 Linktree
            </CardTitle>
            <p className="text-muted-foreground">Connect your wallet to create your decentralized link profile</p>
          </CardHeader>
          <CardContent>
            <WalletConnect onConnect={handleWalletConnect} />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 ${theme}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Web3 Linktree Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </span>
            <Button variant="outline" onClick={handleWalletDisconnect}>
              Disconnect
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="themes" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Themes
            </TabsTrigger>
            <TabsTrigger value="qr" className="flex items-center gap-2">
              <QrCode className="w-4 h-4" />
              QR Code
            </TabsTrigger>
            <TabsTrigger value="scheduler" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Scheduler
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileEditor walletAddress={walletAddress} profile={profile} onProfileUpdate={handleProfileUpdate} />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics walletAddress={walletAddress} />
          </TabsContent>

          <TabsContent value="themes">
            <ThemeCustomizer currentTheme={theme} onThemeChange={setTheme} walletAddress={walletAddress} />
          </TabsContent>

          <TabsContent value="qr">
            <QRGenerator walletAddress={walletAddress} />
          </TabsContent>

          <TabsContent value="scheduler">
            <LinkScheduler walletAddress={walletAddress} profile={profile} onProfileUpdate={handleProfileUpdate} />
          </TabsContent>

          <TabsContent value="preview">
            <ProfileViewer profile={profile} walletAddress={walletAddress} isPreview={true} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
