import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { cleanupExpiredLinks, cleanupExpiredLinksForUser } from '@/lib/cleanup'

// GET - Manual cleanup (for cron jobs or admin)
export async function GET(request: NextRequest) {
  try {
    // Check for cron secret or admin access
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || 'your-secret-key'
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const result = await cleanupExpiredLinks()
    
    return NextResponse.json({
      message: 'Cleanup completed',
      ...result
    })
  } catch (error) {
    console.error('Error in cleanup job:', error)
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 })
  }
}

// POST - Manual cleanup for current user
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const userId = user.id
    const result = await cleanupExpiredLinksForUser(userId)
    
    return NextResponse.json({
      message: 'User cleanup completed',
      ...result
    })
  } catch (error) {
    console.error('Error in user cleanup:', error)
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 })
  }
}
