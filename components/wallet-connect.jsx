"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, AlertCircle } from "lucide-react"

export function WalletConnect({ onConnect }) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState("")

  const connectMetaMask = async () => {
    if (typeof window === "undefined" || typeof window.ethereum === "undefined") {
      setError("MetaMask is not installed. Please install MetaMask to continue.")
      return
    }

    setIsConnecting(true)
    setError("")

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length > 0) {
        onConnect(accounts[0])
      }
    } catch (error) {
      setError("Failed to connect wallet. Please try again.")
      console.error("Wallet connection error:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const connectWalletConnect = async () => {
    // Placeholder for WalletConnect integration
    setError("WalletConnect integration coming soon!")
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        <Button onClick={connectMetaMask} disabled={isConnecting} className="w-full flex items-center gap-2" size="lg">
          <Wallet className="w-5 h-5" />
          {isConnecting ? "Connecting..." : "Connect MetaMask"}
        </Button>

        <Button onClick={connectWalletConnect} variant="outline" className="w-full flex items-center gap-2" size="lg">
          <Wallet className="w-5 h-5" />
          Connect WalletConnect
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Your wallet address will be used to store and retrieve your profile data on IPFS
      </p>
    </div>
  )
}
