import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Link from '@/models/Link'

// POST - Track click on a link
export async function POST(
  request: NextRequest,
  { params }: any
) {
  try {
    await dbConnect()
    
    const linkId = params.id
    
    // Increment click count
    const updatedLink = await Link.findByIdAndUpdate(
      linkId,
      { $inc: { clicks: 1 } },
      { new: true }
    )

    if (!updatedLink) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Click tracked' })
  } catch (error) {
    console.error('Error tracking click:', error)
    return NextResponse.json({ error: 'Failed to track click' }, { status: 500 })
  }
}
