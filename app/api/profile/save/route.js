import { pinataService } from "../../../../lib/pinata"
import { db } from "../../../../lib/database"

export async function POST(request) {
  try {
    const { walletAddress, profile } = await request.json()

    if (!walletAddress || !profile) {
      return Response.json({ error: "Missing walletAddress or profile data" }, { status: 400 })
    }

    // Add metadata to profile
    const profileData = {
      ...profile,
      walletAddress,
      lastUpdated: new Date().toISOString(),
      version: "1.0",
    }

    // Check if profile already exists and unpin old version
    const existingProfile = db.getProfileHash(walletAddress)
    if (existingProfile) {
      await pinataService.unpinFromIPFS(existingProfile.ipfsHash)
    }

    // Pin new profile to IPFS
    const result = await pinataService.pinJSONToIPFS(
      profileData,
      `Web3 Linktree Profile - ${walletAddress.slice(0, 8)}`,
    )

    // Store the mapping in our database
    db.setProfileHash(walletAddress, result.IpfsHash)

    return Response.json({
      success: true,
      ipfsHash: result.IpfsHash,
      message: "Profile saved to IPFS successfully",
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
    })
  } catch (error) {
    console.error("Error saving profile:", error)
    return Response.json(
      {
        error: "Failed to save profile to IPFS",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
