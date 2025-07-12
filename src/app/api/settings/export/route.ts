import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import Link from '@/models/Link'
import Settings from '@/models/Settings'

// GET - Export all user data
export async function GET(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const userId = user.id

    await dbConnect()
    
    // Get all user links
    const links = await Link.find({ userId }).lean()
    
    // Get user settings
    const settings = await Settings.findOne({ userId }).lean()
    
    // Prepare export data
    const exportData = {
      user: {
        id: userId,
        email: user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName
      },
      settings: settings || {},
      links: links.map(link => ({
        ...link,
        // Remove sensitive internal data
        _id: undefined,
        __v: undefined,
        userId: undefined
      })),
      exportDate: new Date().toISOString(),
      totalLinks: links.length
    }
    
    // Set headers for file download
    const headers = new Headers()
    headers.set('Content-Type', 'application/json')
    headers.set('Content-Disposition', `attachment; filename="linkvault-export-${new Date().toISOString().split('T')[0]}.json"`)
    
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers
    })
  } catch (error) {
    console.error('Error exporting data:', error)
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 })
  }
}
