// Simple in-memory database for demo - in production, use a real database
class SimpleDB {
  constructor() {
    this.data = new Map()
    this.analytics = new Map()
    this.scheduledLinks = new Map()
  }

  // Profile mapping: walletAddress -> IPFS hash
  setProfileHash(walletAddress, ipfsHash) {
    this.data.set(walletAddress.toLowerCase(), {
      ipfsHash,
      lastUpdated: new Date().toISOString(),
    })
  }

  getProfileHash(walletAddress) {
    return this.data.get(walletAddress.toLowerCase())
  }

  // Analytics: walletAddress -> analytics data
  getAnalytics(walletAddress) {
    const key = walletAddress.toLowerCase()
    if (!this.analytics.has(key)) {
      this.analytics.set(key, {
        totalViews: 0,
        totalClicks: 0,
        linkClicks: {},
        recentActivity: [],
      })
    }
    return this.analytics.get(key)
  }

  incrementViews(walletAddress) {
    const analytics = this.getAnalytics(walletAddress)
    analytics.totalViews++
    analytics.recentActivity.unshift({
      action: "Profile viewed",
      timestamp: new Date().toISOString(),
    })
    // Keep only last 50 activities
    analytics.recentActivity = analytics.recentActivity.slice(0, 50)
  }

  incrementLinkClick(walletAddress, linkTitle, linkUrl) {
    const analytics = this.getAnalytics(walletAddress)
    analytics.totalClicks++

    const linkKey = `${linkTitle}|${linkUrl}`
    if (!analytics.linkClicks[linkKey]) {
      analytics.linkClicks[linkKey] = {
        title: linkTitle,
        url: linkUrl,
        clicks: 0,
      }
    }
    analytics.linkClicks[linkKey].clicks++

    analytics.recentActivity.unshift({
      action: `Link clicked: ${linkTitle}`,
      timestamp: new Date().toISOString(),
    })
    analytics.recentActivity = analytics.recentActivity.slice(0, 50)
  }

  // Scheduled links
  getScheduledLinks(walletAddress) {
    return this.scheduledLinks.get(walletAddress.toLowerCase()) || []
  }

  setScheduledLinks(walletAddress, links) {
    this.scheduledLinks.set(walletAddress.toLowerCase(), links)
  }
}

export const db = new SimpleDB()
