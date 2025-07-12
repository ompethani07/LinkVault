import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function GET() {
  try {
    // Create products and prices if they don't exist
    const prices = await getOrCreatePrices();
    
    return NextResponse.json({ prices });
  } catch (error) {
    console.error('Error fetching prices:', error);
    return NextResponse.json({ error: 'Failed to fetch prices' }, { status: 500 });
  }
}

async function getOrCreatePrices() {
  try {
    // Check if prices already exist
    const existingPrices = await stripe.prices.list({ 
      product: 'linkvault-premium',
      active: true,
    });

    if (existingPrices.data.length > 0) {
      return {
        monthly: existingPrices.data.find(p => p.recurring?.interval === 'month')?.id,
        annual: existingPrices.data.find(p => p.recurring?.interval === 'year')?.id,
      };
    }

    // Create product if it doesn't exist
    let product;
    try {
      product = await stripe.products.retrieve('linkvault-premium');
    } catch (error) {
      product = await stripe.products.create({
        id: 'linkvault-premium',
        name: 'LinkVault Premium',
        description: 'Unlimited links, files, and advanced features',
      });
    }

    // Create monthly price
    const monthlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 2400, // $24 in cents
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      nickname: 'Monthly Premium',
    });

    // Create annual price
    const annualPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 1900, // $19 in cents (20% discount)
      currency: 'usd',
      recurring: {
        interval: 'year',
      },
      nickname: 'Annual Premium',
    });

    return {
      monthly: monthlyPrice.id,
      annual: annualPrice.id,
    };
  } catch (error) {
    console.error('Error creating prices:', error);
    throw error;
  }
}
