class PinataService {
  constructor() {
    this.apiKey = process.env.PINATA_API_KEY
    this.secretKey = process.env.PINATA_SECRET_KEY
    this.baseUrl = "https://api.pinata.cloud"
    this.gatewayUrl = "https://gateway.pinata.cloud/ipfs"
  }

  async pinJSONToIPFS(data, name) {
    try {
      const url = `${this.baseUrl}/pinning/pinJSONToIPFS`

      const body = {
        pinataContent: data,
        pinataMetadata: {
          name: name || "Web3 Linktree Data",
          keyvalues: {
            walletAddress: data.walletAddress || "unknown",
            type: "profile",
          },
        },
        pinataOptions: {
          cidVersion: 0,
        },
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Pinata API error: ${response.status} - ${errorData}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Error pinning to IPFS:", error)
      throw error
    }
  }

  async getFromIPFS(hash) {
    try {
      const url = `${this.gatewayUrl}/${hash}`

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch from IPFS: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching from IPFS:", error)
      throw error
    }
  }

  async unpinFromIPFS(hash) {
    try {
      const url = `${this.baseUrl}/pinning/unpin/${hash}`

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
      })

      return response.ok
    } catch (error) {
      console.error("Error unpinning from IPFS:", error)
      return false
    }
  }

  async listPinsByMetadata(walletAddress) {
    try {
      const url = `${this.baseUrl}/data/pinList?status=pinned&metadata[keyvalues][walletAddress]=${walletAddress}`

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to list pins: ${response.status}`)
      }

      const result = await response.json()
      return result.rows || []
    } catch (error) {
      console.error("Error listing pins:", error)
      return []
    }
  }
}

export const pinataService = new PinataService()
