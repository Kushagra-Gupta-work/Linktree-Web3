import { db } from "../../../../lib/database"

export async function GET(request, { params }) {
  try {
    const { address } = params

    if (!address) {
      return Response.json({ error: "Wallet address is required" }, { status: 400 })
    }

    const scheduledLinks = db.getScheduledLinks(address)
    return Response.json(scheduledLinks)
  } catch (error) {
    console.error("Error loading scheduled links:", error)
    return Response.json(
      {
        error: "Failed to load scheduled links",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
