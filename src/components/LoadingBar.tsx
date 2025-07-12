'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface LoadingBarProps {
  onNavigationStart?: () => void;
}

export default function LoadingBar({ onNavigationStart }: LoadingBarProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  // Function to start loading
  const startLoading = () => {
    setIsLoading(true);
    setProgress(10);
    onNavigationStart?.();
    
    // Gradually increase progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 20;
      });
    }, 150);

    return interval;
  };

  // Function to complete loading
  const completeLoading = () => {
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 300);
  };

  // Listen for pathname changes
  useEffect(() => {
    completeLoading();
  }, [pathname]);

  // Expose global loading functions
  useEffect(() => {
    (window as any).startPageLoading = startLoading;
    (window as any).completePageLoading = completeLoading;
    
    return () => {
      delete (window as any).startPageLoading;
      delete (window as any).completePageLoading;
    };
  }, []);

  if (!isLoading) return null;

  return (
    <>
      {/* Loading bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200/20">
        <div 
          className="h-full bg-gradient-to-r from-red-500 via-red-400 to-red-600 transition-all duration-300 ease-out relative overflow-hidden shadow-lg"
          style={{ width: `${progress}%` }}
        >
          {/* Shining effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
          
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-400/50 via-red-300/50 to-red-500/50 blur-sm" />
        </div>
      </div>

      {/* Optional overlay for dramatic effect */}
      <div className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[0.5px] transition-opacity duration-300" />
    </>
  );
}
