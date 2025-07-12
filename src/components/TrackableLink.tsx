'use client';

import { useState } from 'react';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';

interface TrackableLinkProps {
  linkId: string;
  targetUrl: string;
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function TrackableLink({
  linkId,
  targetUrl,
  title,
  description,
  className = '',
  children,
}: TrackableLinkProps) {
  const { user } = useGoogleAuth();
  const [copied, setCopied] = useState(false);

  const generateTrackableUrl = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const trackUrl = new URL(`${baseUrl}/api/track/${linkId}`);
    trackUrl.searchParams.set('url', targetUrl);
    
    // Add Google token if user is signed in
    if (user && typeof window !== 'undefined' && window.google?.accounts) {
      // In a real implementation, you'd get the actual JWT token
      // For now, we'll create a simple token with user info
      const token = btoa(JSON.stringify({
        sub: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      }));
      trackUrl.searchParams.set('google_token', token);
    }
    
    return trackUrl.toString();
  };

  const copyToClipboard = async () => {
    const trackableUrl = generateTrackableUrl();
    await navigator.clipboard.writeText(trackableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClick = () => {
    // Track the click locally
    const analytics = JSON.parse(localStorage.getItem('linkVaultAnalytics') || '{}');
    
    if (!analytics[linkId]) {
      analytics[linkId] = {
        views: 0,
        clicks: 0,
        googleUsers: [],
      };
    }
    
    analytics[linkId].clicks++;
    
    // Add Google user info if available
    if (user) {
      const existingUser = analytics[linkId].googleUsers.find(
        (u: any) => u.id === user.id
      );
      
      if (!existingUser) {
        analytics[linkId].googleUsers.push({
          id: user.id,
          email: user.email,
          name: user.name,
          firstView: new Date().toISOString(),
        });
      }
    }
    
    localStorage.setItem('linkVaultAnalytics', JSON.stringify(analytics));
  };

  return (
    <div className={`relative group ${className}`}>
      {children || (
        <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50 hover:border-red-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-white font-medium mb-2">{title}</h3>
              {description && (
                <p className="text-gray-400 text-sm mb-4">{description}</p>
              )}
              <div className="flex items-center space-x-4">
                <a
                  href={generateTrackableUrl()}
                  onClick={handleClick}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  Open Link
                </a>
                <button
                  onClick={copyToClipboard}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {copied ? '✓ Copied' : 'Copy Trackable Link'}
                </button>
              </div>
            </div>
            {user && (
              <div className="ml-4 flex items-center space-x-2">
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-green-400 text-sm">Google Tracking Active</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
