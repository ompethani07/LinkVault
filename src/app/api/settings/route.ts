import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import Settings from '@/models/Settings'

// GET - Fetch user settings
export async function GET(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const userId = user.id

    await dbConnect()
    
    let settings = await Settings.findOne({ userId })
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = new Settings({
        userId,
        theme: 'dark',
        notifications: true,
        publicProfile: false,
        defaultCategory: 'work',
        autoDelete: false,
        autoDeleteDays: 30,
        linkExpiration: false,
        linkExpirationDays: 7
      })
      await settings.save()
    }
    
    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

// PUT - Update user settings
export async function PUT(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const userId = user.id

    await dbConnect()
    
    const body = await request.json()
    const {
      theme,
      notifications,
      publicProfile,
      defaultCategory,
      autoDelete,
      autoDeleteDays,
      linkExpiration,
      linkExpirationDays
    } = body

    // Update or create settings
    const settings = await Settings.findOneAndUpdate(
      { userId },
      {
        theme,
        notifications,
        publicProfile,
        defaultCategory,
        autoDelete,
        autoDeleteDays,
        linkExpiration,
        linkExpirationDays
      },
      { 
        new: true, 
        upsert: true, // Create if doesn't exist
        runValidators: true 
      }
    )
    
    return NextResponse.json({ settings, message: 'Settings updated successfully' })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
