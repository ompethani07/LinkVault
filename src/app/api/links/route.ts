import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import Link from '@/models/Link'
import { getUserLimits, checkFileUploadLimit } from '@/lib/subscription'
import UserModel from '@/models/User'

// GET - Fetch all links for authenticated user
export async function GET(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const userId = user.id

    await dbConnect()
    
    const links = await Link.find({ userId }).sort({ createdAt: -1 })
    
    // Get user limits
    const userLimits = await getUserLimits(userId)
    
    return NextResponse.json({ links, userLimits })
  } catch (error) {
    console.error('Error fetching links:', error)
    return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 })
  }
}

// POST - Create new link
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const userId = user.id

    await dbConnect()
    
    // Check user limits before creating link
    const userLimits = await getUserLimits(userId)
    if (!userLimits.canCreateLink) {
      return NextResponse.json({
        error: 'Link creation limit reached. Upgrade to Premium for unlimited links.',
        limit: userLimits.linksLimit,
        used: userLimits.linksUsed,
        showAdOption: true
      }, { status: 403 })
    }
    
    const body = await request.json()
    console.log('Received body:', JSON.stringify(body, null, 2))
    console.log('Files type:', typeof body.files)
    console.log('Files array:', Array.isArray(body.files))
    if (body.files && body.files.length > 0) {
      console.log('First file structure:', JSON.stringify(body.files[0], null, 2))
    }
    const { title, url, description, category, image, isFile, files, customSlug } = body

    // Check total file storage limits for uploads
    if (isFile && files && files.length > 0) {
      const uploadCheck = await checkFileUploadLimit(userId, files)
      if (!uploadCheck.canUpload) {
        return NextResponse.json({ 
          error: uploadCheck.error,
          totalFileSizeUsed: userLimits.totalFileSizeUsed,
          maxFileSize: userLimits.maxFileSize,
          plan: userLimits.plan
        }, { status: 413 })
      }
    }

    // Generate shareUrl
    const origin = request.headers.get('origin') || 'http://localhost:3000'
    const shareUrl = `${origin}/share/${customSlug}`

    // Check if customSlug already exists
    const existingLink = await Link.findOne({ customSlug })
    if (existingLink) {
      return NextResponse.json({ error: 'Custom slug already exists' }, { status: 400 })
    }

    const newLink = new Link({
      title,
      url,
      description,
      category,
      image,
      isFile,
      files,
      customSlug,
      shareUrl,
      userId
    })

    const savedLink = await newLink.save()

    // If user is on free plan and has used an ad credit, decrement it
    const userDoc = await UserModel.findOne({ userId });
    if (userDoc.plan === 'free' && userLimits.linksUsed >= userLimits.linksLimit) {
      await UserModel.findOneAndUpdate({ userId }, { $inc: { adCredits: -1 } });
    }
    
    return NextResponse.json({ link: savedLink }, { status: 201 })
  } catch (error) {
    console.error('Error creating link:', error)
    return NextResponse.json({ error: 'Failed to create link' }, { status: 500 })
  }
}
