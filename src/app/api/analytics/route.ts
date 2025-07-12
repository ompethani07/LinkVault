import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import Link from '@/models/Link'

// GET - Fetch analytics data for authenticated user
export async function GET(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const userId = user.id

    await dbConnect()
    
    // Get all user links
    const links = await Link.find({ userId })
    
    // Calculate analytics
    const totalLinks = links.length
    const totalViews = links.reduce((sum, link) => sum + (link.views || 0), 0)
    const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0)
    const clickRate = totalViews > 0 ? Math.round((totalClicks / totalViews) * 100) : 0
    
    // Category breakdown
    const categoryStats = links.reduce((acc, link) => {
      acc[link.category] = (acc[link.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    // Recent links (last 5)
    const recentLinks = links
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(link => ({
        id: link._id,
        title: link.title,
        description: link.description,
        views: link.views || 0,
        clicks: link.clicks || 0,
        createdAt: link.createdAt
      }))
    
    // Monthly stats (current month)
    const currentMonth = new Date()
    currentMonth.setDate(1)
    currentMonth.setHours(0, 0, 0, 0)
    
    const monthlyLinks = links.filter(link => 
      new Date(link.createdAt) >= currentMonth
    ).length
    
    return NextResponse.json({
      totalLinks,
      totalViews,
      totalClicks,
      clickRate,
      categoryStats,
      recentLinks,
      monthlyLinks
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
