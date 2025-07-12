'use client';

import { useState, useEffect } from 'react';

interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export function useGoogleAuth() {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is signed in to Google
    const checkGoogleAuth = async () => {
      try {
        // Check if Google Identity Services is available
        if (typeof window !== 'undefined' && window.google?.accounts) {
          window.google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
            callback: (response: any) => {
              // Decode JWT token to get user info
              const payload = JSON.parse(atob(response.credential.split('.')[1]));
              setUser({
                id: payload.sub,
                email: payload.email,
                name: payload.name,
                picture: payload.picture,
              });
            },
          });

          // Check if user is already signed in
          window.google.accounts.id.prompt();
        }
      } catch (error) {
        console.error('Google Auth error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkGoogleAuth();
  }, []);

  return { user, isLoading };
}
