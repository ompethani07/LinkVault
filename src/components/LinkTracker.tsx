'use client';

import { useEffect } from 'react';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { trackLinkClick } from '@/lib/gtag';

interface LinkTrackerProps {
  linkId: string;
  onTrack?: (googleUser: any) => void;
}

export default function LinkTracker({ linkId, onTrack }: LinkTrackerProps) {
  const { user } = useGoogleAuth();

  useEffect(() => {
    // Track the link view/click with Google account info
    const trackClick = () => {
      trackLinkClick(linkId, user);
      
      // Store analytics data locally
      const analytics = JSON.parse(localStorage.getItem('linkVaultAnalytics') || '{}');
      
      if (!analytics[linkId]) {
        analytics[linkId] = {
          views: 0,
          clicks: 0,
          googleUsers: [],
        };
      }
      
      analytics[linkId].views++;
      
      // Store Google user info if available
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
      
      if (onTrack) {
        onTrack(user);
      }
    };

    trackClick();
  }, [linkId, user, onTrack]);

  return null;
}
