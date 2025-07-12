import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import Link from '@/models/Link'

// DELETE - Delete all user links
export async function DELETE(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const userId = user.id

    await dbConnect()
    
    // Delete all links for this user
    const result = await Link.deleteMany({ userId })
    
    return NextResponse.json({ 
      message: `Successfully deleted ${result.deletedCount} links`,
      deletedCount: result.deletedCount
    })
  } catch (error) {
    console.error('Error deleting all links:', error)
    return NextResponse.json({ error: 'Failed to delete links' }, { status: 500 })
  }
}
