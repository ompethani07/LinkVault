'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface LoadingLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function LoadingLink({ href, children, className, onClick }: LoadingLinkProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Start loading animation
    if (typeof window !== 'undefined' && (window as any).startPageLoading) {
      (window as any).startPageLoading();
    }
    
    // Call custom onClick if provided
    onClick?.();
    
    // Navigate to the new page
    router.push(href);
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
