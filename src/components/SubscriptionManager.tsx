'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { redirectToCustomerPortal } from '@/lib/stripe';
import { getUserLimits, UserLimits } from '@/lib/subscription';

export default function SubscriptionManager() {
  const { user } = useUser();
  const [userLimits, setUserLimits] = useState<UserLimits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isManaging, setIsManaging] = useState(false);

  useEffect(() => {
    const loadUserLimits = async () => {
      if (!user) return;
      
      try {
        // Call the API instead of direct function call
        const response = await fetch('/api/subscription/limits');
        if (response.ok) {
          const limits = await response.json();
          setUserLimits(limits);
        } else {
          throw new Error('Failed to fetch user limits');
        }
      } catch (error) {
        console.error('Error loading user limits:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserLimits();
  }, [user]);

  const handleManageSubscription = async () => {
    setIsManaging(true);
    try {
      await redirectToCustomerPortal();
    } catch (error) {
      console.error('Error opening customer portal:', error);
      alert('Failed to open subscription management. Please try again.');
    } finally {
      setIsManaging(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3"></div>
          <div className="h-10 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!userLimits) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <p className="text-red-400">Failed to load subscription information</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h3 className="text-xl font-semibold mb-4">Subscription</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Current Plan</span>
          <span className={`font-semibold ${
            userLimits.plan === 'premium' ? 'text-red-400' : 'text-gray-300'
          }`}>
            {userLimits.plan === 'premium' ? 'Premium' : 'Free'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-400">Links Used</span>
          <span className="text-gray-300">
            {userLimits.linksUsed} / {userLimits.linksLimit === -1 ? '∞' : userLimits.linksLimit}
          </span>
        </div>

        {userLimits.plan === 'free' && (
          <div className="flex items-center justify-between">
            <span className="text-gray-400">File Storage Used</span>
            <span className="text-gray-300">
              {Math.round(userLimits.totalFileSizeUsed / 1024 / 1024)}MB / {Math.round(userLimits.maxFileSize / 1024 / 1024)}MB
            </span>
          </div>
        )}

        {userLimits.plan === 'premium' && (
          <div className="flex items-center justify-between">
            <span className="text-gray-400">File Storage Used</span>
            <span className="text-gray-300">
              {Math.round(userLimits.totalFileSizeUsed / 1024 / 1024)}MB / Unlimited
            </span>
          </div>
        )}

        <div className="pt-4 border-t border-gray-800">
          {userLimits.plan === 'premium' ? (
            <button
              onClick={handleManageSubscription}
              disabled={isManaging}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              {isManaging ? 'Opening...' : 'Manage Subscription'}
            </button>
          ) : (
            <a
              href="/pricing"
              className="block w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors text-center"
            >
              Upgrade to Premium
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
