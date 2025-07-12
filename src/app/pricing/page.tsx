'use client';

import { useState, useEffect } from 'react';
import { UserButton, useUser } from '@clerk/nextjs';
import LoadingLink from '@/components/LoadingLink';
import StaticLogo from '@/components/StaticLogo';
import { useCurrency } from '@/hooks/useCurrency';
import { formatPrice } from '@/lib/currency';
import { redirectToCheckout } from '@/lib/stripe';

export default function PricingPage() {
  const { user } = useUser();
  const [isAnnual, setIsAnnual] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [prices, setPrices] = useState<{ monthly: string; annual: string } | null>(null);
  const { currencyInfo, isLoading, country } = useCurrency();
  
  // USD base prices
  const basePrices = {
    monthly: 24,
    annual: 19
  };

  // Load Stripe prices on component mount
  useEffect(() => {
    const loadPrices = async () => {
      try {
        const response = await fetch('/api/stripe/prices');
        if (response.ok) {
          const data = await response.json();
          setPrices(data.prices);
        }
      } catch (error) {
        console.error('Error loading prices:', error);
      }
    };
    
    loadPrices();
  }, []);

  const handleUpgrade = async () => {
    if (!prices || !user) return;
    
    setIsProcessing(true);
    try {
      const priceId = isAnnual ? prices.annual : prices.monthly;
      await redirectToCheckout(priceId, isAnnual);
    } catch (error) {
      console.error('Error starting checkout:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const features = {
    free: [
      'Up to 5 links',
      'Basic file upload (max 10MB)',
      'Standard support',
      'Basic analytics'
    ],
    premium: [
      'Unlimited links',
      'Unlimited file size',
      'Priority support',
      'Advanced analytics',
      'Custom categories',
      'Team collaboration',
      'API access'
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-3">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 90% 10%, rgba(220, 38, 38, 0.03) 0%, transparent 80%)
            `
          }}
        />
      </div>
      
      {/* Header */}
      <header className="relative z-10 bg-black/80 backdrop-blur-md border-b border-red-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <StaticLogo size={52} />
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                    LinkVault
                  </h1>
                  <p className="text-xs text-gray-500 tracking-wide">DASHBOARD</p>
                </div>
              </div>
              
              <div className="hidden md:flex items-center space-x-6">
                <div className="h-6 w-px bg-gray-700"></div>
                <nav className="flex space-x-6">
                  <LoadingLink href="/dashboard" className="text-gray-400 hover:text-red-400 transition-colors">Dashboard</LoadingLink>
                  <LoadingLink href="/analytics" className="text-gray-400 hover:text-red-400 transition-colors">Analytics</LoadingLink>
                  <LoadingLink href="/settings" className="text-gray-400 hover:text-red-400 transition-colors">Settings</LoadingLink>
                  <LoadingLink href="/pricing" className="text-red-400 font-medium">Pricing</LoadingLink>
                </nav>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm text-gray-300 font-medium">Welcome back,</p>
                <p className="text-lg font-bold text-white">{user?.firstName}</p>
              </div>
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      {/* Pricing Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-gray-400 text-lg mb-8">Select the perfect plan for your needs</p>
          
          {/* Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${!isAnnual ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                isAnnual ? 'bg-red-600' : 'bg-gray-600'
              }`}
            >
              <div
                className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-transform ${
                  isAnnual ? 'transform translate-x-7' : 'transform translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-white' : 'text-gray-400'}`}>
              Annual <span className="text-red-400">(Save 20%)</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <div className="text-4xl font-bold mb-4">
                {isLoading ? '$0' : `${currencyInfo.symbol}0`}
              </div>
              <p className="text-gray-400">Perfect for getting started</p>
            </div>
            
            <ul className="space-y-3 mb-8">
              {features.free.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors">
              Current Plan
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-red-900/20 rounded-xl p-8 border border-red-500 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <div className="text-4xl font-bold mb-4">
                {isLoading ? (
                  `$${isAnnual ? '19' : '24'}`
                ) : (
                  formatPrice(isAnnual ? basePrices.annual : basePrices.monthly, currencyInfo)
                )}
                <span className="text-lg text-gray-400">/month</span>
              </div>
              <p className="text-gray-400">For power users and teams</p>
              {!isLoading && country !== 'US' && (
                <p className="text-xs text-gray-500 mt-2">
                  Detected location: {country} • Currency: {currencyInfo.currency}
                </p>
              )}
            </div>
            
            <ul className="space-y-3 mb-8">
              {features.premium.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button 
              onClick={handleUpgrade}
              disabled={isProcessing || !prices}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              {isProcessing ? 'Processing...' : 'Upgrade to Premium'}
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h4 className="font-semibold mb-2">Can I upgrade at any time?</h4>
              <p className="text-gray-400">Yes, you can upgrade or downgrade your plan at any time.</p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold mb-2">What happens to my links if I downgrade?</h4>
              <p className="text-gray-400">Your existing links will remain accessible, but you won't be able to create new ones beyond the free tier limit.</p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold mb-2">Is there a free trial?</h4>
              <p className="text-gray-400">Yes, the free plan is available forever with basic features.</p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold mb-2">Can I cancel anytime?</h4>
              <p className="text-gray-400">Yes, you can cancel your subscription at any time with no penalties.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
