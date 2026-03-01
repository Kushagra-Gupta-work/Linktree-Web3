"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QrCode, Download, Copy, Check } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function QRGenerator({ walletAddress }) {
  const [profileUrl, setProfileUrl] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/profile/${walletAddress}`
      setProfileUrl(url)
      generateQRCode(url)
    }
  }, [walletAddress])

  const generateQRCode = async (url) => {
    try {
      // Using QR Server API for simplicity
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`
      setQrCodeUrl(qrUrl)
    } catch (error) {
      console.error("Error generating QR code:", error)
    }
  }

  const copyUrl = async () => {
    if (typeof window !== "undefined") {
      await navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "URL copied!",
        description: "Profile URL has been copied to clipboard.",
      })
    }
  }

  const downloadQR = () => {
    const link = document.createElement("a")
    link.href = qrCodeUrl
    link.download = `web3-linktree-${walletAddress.slice(0, 8)}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            QR Code Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="profile-url">Your Profile URL</Label>
            <div className="flex gap-2 mt-1">
              <Input id="profile-url" value={profileUrl} readOnly className="flex-1" />
              <Button onClick={copyUrl} variant="outline" size="icon">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="text-center">
            {qrCodeUrl && (
              <div className="inline-block p-4 bg-white rounded-lg shadow-sm border">
                <img src={qrCodeUrl || "/placeholder.svg"} alt="Profile QR Code" className="w-64 h-64 mx-auto" />
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4">
            <Button onClick={downloadQR} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download QR Code
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Share this QR code to let people quickly access your Web3 Linktree profile</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage Ideas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Business Cards</h3>
              <p className="text-sm text-muted-foreground">
                Add the QR code to your business cards for easy networking
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Social Media</h3>
              <p className="text-sm text-muted-foreground">Share on Instagram stories, Twitter posts, or LinkedIn</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Events</h3>
              <p className="text-sm text-muted-foreground">Display at conferences, meetups, or presentations</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Email Signature</h3>
              <p className="text-sm text-muted-foreground">Include in your email signature for professional contacts</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
