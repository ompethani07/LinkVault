import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import Link from '@/models/Link'

// DELETE - Delete a specific link
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const userId = user.id

    await dbConnect()
    
    const { id: linkId } = await params
    
    // Find and delete the link, ensuring it belongs to the user
    const deletedLink = await Link.findOneAndDelete({ 
      _id: linkId, 
      userId 
    })

    if (!deletedLink) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Link deleted successfully' })
  } catch (error) {
    console.error('Error deleting link:', error)
    return NextResponse.json({ error: 'Failed to delete link' }, { status: 500 })
  }
}

// PUT - Update a specific link
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const userId = user.id

    await dbConnect()
    
    const { id: linkId } = await params
    const body = await request.json()
    
    // Find and update the link, ensuring it belongs to the user
    const updatedLink = await Link.findOneAndUpdate(
      { _id: linkId, userId },
      body,
      { new: true, runValidators: true }
    )

    if (!updatedLink) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }
    
    return NextResponse.json({ link: updatedLink })
  } catch (error) {
    console.error('Error updating link:', error)
    return NextResponse.json({ error: 'Failed to update link' }, { status: 500 })
  }
}
