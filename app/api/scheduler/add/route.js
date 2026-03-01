import { db } from "../../../lib/database"

export async function POST(request) {
  try {
    const { walletAddress, schedule } = await request.json()

    if (!walletAddress || !schedule) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const scheduledLinks = db.getScheduledLinks(walletAddress)
    const newSchedule = {
      ...schedule,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    }

    scheduledLinks.push(newSchedule)
    db.setScheduledLinks(walletAddress, scheduledLinks)

    return Response.json({ success: true, schedule: newSchedule })
  } catch (error) {
    console.error("Error adding scheduled link:", error)
    return Response.json(
      {
        error: "Failed to add scheduled link",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
