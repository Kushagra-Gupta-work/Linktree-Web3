import { pinataService } from "../../../../lib/pinata"
import { db } from "../../../../lib/database"

export async function GET(request, { params }) {
  try {
    const { address } = params

    if (!address) {
      return Response.json({ error: "Wallet address is required" }, { status: 400 })
    }

    // Get IPFS hash for this wallet address
    const profileMapping = db.getProfileHash(address)

    if (!profileMapping) {
      return Response.json({ error: "Profile not found" }, { status: 404 })
    }

    // Fetch profile data from IPFS
    const profileData = await pinataService.getFromIPFS(profileMapping.ipfsHash)

    // Increment view count
    db.incrementViews(address)

    return Response.json({
      ...profileData,
      ipfsHash: profileMapping.ipfsHash,
      lastUpdated: profileMapping.lastUpdated,
    })
  } catch (error) {
    console.error("Error loading profile:", error)
    return Response.json(
      {
        error: "Failed to load profile from IPFS",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
