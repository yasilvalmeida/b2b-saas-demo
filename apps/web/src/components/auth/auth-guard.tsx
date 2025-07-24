'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isHydrated, user } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isHydrated) {
      if (!isAuthenticated || !user) {
        // Redirect to login if not authenticated
        window.location.href = '/login';
        return;
      }
      setIsChecking(false);
    }
  }, [isAuthenticated, isHydrated, user]);

  // Show loading while checking authentication
  if (isChecking || !isHydrated) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='w-8 h-8 rounded-full border-2 border-gray-300 border-t-blue-600 animate-spin'></div>
      </div>
    );
  }

  // If not authenticated, don't render children (will redirect)
  if (!isAuthenticated || !user) {
    return null;
  }

  // If authenticated, render children
  return <>{children}</>;
}
