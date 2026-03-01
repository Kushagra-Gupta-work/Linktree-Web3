import { db } from "../../../lib/database"

export async function POST(request) {
  try {
    const { walletAddress, index } = await request.json()

    if (!walletAddress || index === undefined) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const scheduledLinks = db.getScheduledLinks(walletAddress)
    scheduledLinks.splice(index, 1)
    db.setScheduledLinks(walletAddress, scheduledLinks)

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error removing scheduled link:", error)
    return Response.json(
      {
        error: "Failed to remove scheduled link",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
