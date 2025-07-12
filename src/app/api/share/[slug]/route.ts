import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Link from '@/models/Link'

// Correct type for dynamic route params
export async function GET(
  request: NextRequest,
  context: { params: { slug: string } }
) {
  try {
    await dbConnect();

    const { slug } = context.params;

    const link = await Link.findOne({ customSlug: slug });

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    await Link.findByIdAndUpdate(link._id, { $inc: { views: 1 } });

    return NextResponse.json({ link });
  } catch (error) {
    console.error('Error fetching shared link:', error);
    return NextResponse.json({ error: 'Failed to fetch link' }, { status: 500 });
  }
}
