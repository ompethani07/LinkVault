import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { priceId, isAnnual } = await request.json();

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
    }

    // Connect to database
    await dbConnect();

    // Get or create user
    let user = await User.findOne({ userId });
    if (!user) {
      // Get user email from Clerk
      const { getUser } = await import('@clerk/nextjs/server');
      const clerkUser = await getUser(userId);
      
      user = await User.create({
        userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || `user-${userId}@example.com`,
        plan: 'free'
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      payment_method_types: ['card', 'link'], // Enable Google Pay, Apple Pay, etc.
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?canceled=true`,
      metadata: {
        userId,
        plan: 'premium',
        isAnnual: isAnnual ? 'true' : 'false',
      },
      subscription_data: {
        metadata: {
          userId,
          plan: 'premium',
        },
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
