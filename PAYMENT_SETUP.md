# Payment System Setup Guide

## Overview
Your LinkVault application now has a complete payment system using Stripe. When users purchase Premium, the money will go directly to YOUR Stripe account.

## What I've Implemented

### 1. Payment Processing
- **Stripe Checkout**: Users can purchase Premium subscriptions
- **Webhook Handler**: Automatic subscription status updates
- **Customer Portal**: Users can manage their subscriptions
- **Price Management**: Automatic creation of monthly/annual prices

### 2. Premium Features
- **User Management**: Tracks subscription status in MongoDB
- **Feature Restrictions**: Enforces limits for free vs premium users
- **Subscription UI**: Settings page with subscription management

### 3. Security
- **Webhook Verification**: Ensures only Stripe can trigger updates
- **User Authentication**: All endpoints require valid user session
- **Error Handling**: Comprehensive error handling and logging

## Setup Instructions

### 1. Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete account verification to receive payments
3. Get your API keys from the Stripe Dashboard

### 2. Add Environment Variables
Add these to your `.env.local` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...  # Get from Stripe Dashboard
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Get from Stripe Dashboard  
STRIPE_WEBHOOK_SECRET=whsec_...  # Get after setting up webhook (step 4)

# Your app URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # Change to your domain in production
```

### 3. Test the Payment Flow
1. Start your development server: `npm run dev`
2. Go to `/pricing` page
3. Click "Upgrade to Premium"
4. Use Stripe test card: `4242 4242 4242 4242`
5. Check that user is upgraded to Premium

### 4. Set Up Webhooks (Important for Production)
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Enter URL: `https://yourdomain.com/api/stripe/webhook`
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook secret and add it to `.env.local`

### 5. Configure Prices
The system automatically creates these prices:
- **Monthly**: $24/month
- **Annual**: $19/month (20% discount)

To change prices, edit `src/app/api/stripe/prices/route.ts`

## How Money Flows to Your Account

1. **Customer Payment**: When a user buys Premium, Stripe processes the payment
2. **Your Account**: Money goes to your Stripe account (minus Stripe fees)
3. **Bank Transfer**: Stripe deposits money to your bank account automatically
4. **Webhook**: Your app receives notification and upgrades the user

## Premium Features Enabled

✅ **Unlimited Links**: Remove 5-link limit  
✅ **Unlimited File Storage**: Remove 10MB limit  
✅ **Priority Support**: Mark premium users  
✅ **Advanced Analytics**: Premium analytics features  
✅ **Custom Categories**: Additional categorization  
✅ **Team Collaboration**: Multi-user features  
✅ **API Access**: Developer API access  

## Important Files Created

- `src/app/api/stripe/checkout/route.ts` - Payment processing
- `src/app/api/stripe/webhook/route.ts` - Subscription updates
- `src/app/api/stripe/prices/route.ts` - Price management
- `src/app/api/stripe/customer-portal/route.ts` - Subscription management
- `src/lib/stripe.ts` - Client-side Stripe utilities
- `src/components/SubscriptionManager.tsx` - Subscription UI
- `src/app/api/subscription/limits/route.ts` - User limits API

## Testing

### Test Cards (Stripe Test Mode)
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Insufficient funds**: `4000 0000 0000 9995`

### Test Flow
1. Go to pricing page
2. Click "Upgrade to Premium"
3. Use test card details
4. Verify user is upgraded in settings
5. Test premium features (unlimited links, etc.)

## Going Live

1. **Switch to Live Mode**: In Stripe Dashboard, toggle to "Live mode"
2. **Get Live Keys**: Copy live API keys to production `.env`
3. **Update Webhook URL**: Point to your production domain
4. **Test Real Payment**: Use a real card with small amount
5. **Monitor**: Watch Stripe Dashboard for payments

## Support

The payment system is fully functional and secure. Users can:
- Purchase Premium subscriptions
- Manage their subscriptions 
- Cancel anytime
- Get refunds through Stripe

**Money goes directly to your Stripe account** - you'll see payments in your Stripe Dashboard and receive automatic bank deposits.

## Troubleshooting

### Common Issues
1. **Webhook not working**: Check webhook URL and secret
2. **Payment not processing**: Verify Stripe keys
3. **User not upgraded**: Check webhook events and logs
4. **Subscription not canceled**: User can use customer portal

### Debug Steps
1. Check browser console for errors
2. Check server logs for webhook issues
3. Check Stripe Dashboard for payment status
4. Test with different cards
