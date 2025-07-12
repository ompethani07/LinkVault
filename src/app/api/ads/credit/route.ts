import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const userId = user.id

    await dbConnect()
    
    const updatedUser = await User.findOneAndUpdate(
      { userId },
      { $inc: { adCredits: 2 } },
      { new: true, upsert: true }
    )
    
    return NextResponse.json({ 
      message: 'Ad credit awarded successfully',
      adCredits: updatedUser.adCredits 
    })
  } catch (error) {
    console.error('Error awarding ad credit:', error)
    return NextResponse.json({ error: 'Failed to award ad credit' }, { status: 500 })
  }
}