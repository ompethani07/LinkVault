import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserLimits } from '@/lib/subscription';

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const limits = await getUserLimits(userId);
    return NextResponse.json(limits);
  } catch (error) {
    console.error('Error fetching user limits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user limits' },
      { status: 500 }
    );
  }
}
