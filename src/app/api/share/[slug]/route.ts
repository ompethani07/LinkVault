import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Link from '@/models/Link';

// GET - Fetch link by slug for public sharing
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();

    const { slug } = params;

    // Find the link by customSlug
    const link = await Link.findOne({ customSlug: slug });

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    // Increment view count
    await Link.findByIdAndUpdate(link._id, { $inc: { views: 1 } });

    return NextResponse.json({ link });
  } catch (error) {
    console.error('Error fetching shared link:', error);
    return NextResponse.json({ error: 'Failed to fetch link' }, { status: 500 });
  }
}
