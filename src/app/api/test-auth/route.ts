import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'

export async function GET(request: NextRequest) {
  try {
    console.log('Testing auth...')
    const { userId: authUserId } = auth()
    const user = await currentUser()
    
    console.log('Auth result:', { 
      authUserId, 
      currentUserId: user?.id,
      userEmail: user?.emailAddresses?.[0]?.emailAddress 
    })
    
    return NextResponse.json({ 
      authUserId,
      currentUserId: user?.id || null,
      userEmail: user?.emailAddresses?.[0]?.emailAddress || null,
      authenticated: !!user?.id
    })
  } catch (error) {
    console.error('Auth test error:', error)
    return NextResponse.json({ error: 'Auth test failed', details: error.message }, { status: 500 })
  }
}
