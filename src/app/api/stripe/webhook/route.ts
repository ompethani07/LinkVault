import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { upgradeToPremium, downgradeToFree } from '@/lib/subscription';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    await dbConnect();

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  if (!userId) return;

  console.log('Checkout completed for user:', userId);
  
  // The subscription will be handled by the subscription.created event
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) return;

  console.log('Subscription created for user:', userId);
  
  await upgradeToPremium(userId, subscription.id);
  
  // Update user subscription status
  await User.findOneAndUpdate(
    { userId },
    {
      subscriptionId: subscription.id,
      subscriptionStatus: 'active',
      plan: 'premium',
    },
    { upsert: true }
  );
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) return;

  console.log('Subscription updated for user:', userId);
  
  let status = 'inactive';
  let plan = 'free';
  
  if (subscription.status === 'active') {
    status = 'active';
    plan = 'premium';
  } else if (subscription.status === 'canceled') {
    status = 'cancelled';
    plan = 'free';
  }
  
  await User.findOneAndUpdate(
    { userId },
    {
      subscriptionId: subscription.id,
      subscriptionStatus: status,
      plan: plan,
    }
  );
  
  if (plan === 'free') {
    await downgradeToFree(userId);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) return;

  console.log('Subscription deleted for user:', userId);
  
  await downgradeToFree(userId);
  
  await User.findOneAndUpdate(
    { userId },
    {
      subscriptionId: null,
      subscriptionStatus: 'cancelled',
      plan: 'free',
    }
  );
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;
  if (!subscriptionId) return;
  
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const userId = subscription.metadata?.userId;
    
    if (!userId) return;
    
    console.log('Payment succeeded for user:', userId);
    
    // Ensure user is still marked as premium
    await User.findOneAndUpdate(
      { userId },
      {
        subscriptionStatus: 'active',
        plan: 'premium',
      }
    );
  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;
  if (!subscriptionId) return;
  
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const userId = subscription.metadata?.userId;
    
    if (!userId) return;
    
    console.log('Payment failed for user:', userId);
    
    // You might want to send an email notification here
    // For now, just log it - Stripe will handle retries
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}
