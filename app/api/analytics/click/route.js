import { db } from "../../../lib/database"

export async function POST(request) {
  try {
    const { walletAddress, linkTitle, linkUrl } = await request.json()

    if (!walletAddress || !linkTitle || !linkUrl) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Track the click
    db.incrementLinkClick(walletAddress, linkTitle, linkUrl)

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error tracking click:", error)
    return Response.json(
      {
        error: "Failed to track click",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
