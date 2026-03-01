import { db } from "../../../../lib/database"

export async function GET(request, { params }) {
  try {
    const { address } = params

    if (!address) {
      return Response.json({ error: "Wallet address is required" }, { status: 400 })
    }

    const analytics = db.getAnalytics(address)

    // Convert linkClicks object to array
    const linkClicksArray = Object.values(analytics.linkClicks)

    return Response.json({
      totalViews: analytics.totalViews,
      totalClicks: analytics.totalClicks,
      linkClicks: linkClicksArray,
      recentActivity: analytics.recentActivity,
    })
  } catch (error) {
    console.error("Error loading analytics:", error)
    return Response.json(
      {
        error: "Failed to load analytics",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
