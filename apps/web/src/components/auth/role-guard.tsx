'use client';

import { useAuth } from '@/hooks/use-auth';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallback?: React.ReactNode;
}

export function RoleGuard({
  children,
  allowedRoles,
  fallback,
}: RoleGuardProps) {
  const { user, isAuthenticated, isHydrated } = useAuth();

  // Show loading while checking authentication
  if (!isHydrated) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='w-8 h-8 rounded-full border-2 border-gray-300 border-t-blue-600 animate-spin'></div>
      </div>
    );
  }

  // If not authenticated, don't render anything (AuthGuard will handle redirect)
  if (!isAuthenticated || !user) {
    return null;
  }

  // Check if user has required role
  const hasRequiredRole = allowedRoles.includes(user.role);

  if (!hasRequiredRole) {
    return (
      fallback || (
        <div className='flex justify-center items-center min-h-screen'>
          <div className='text-center'>
            <h1 className='text-2xl font-bold text-gray-900 mb-2'>
              Access Denied
            </h1>
            <p className='text-gray-600'>
              You don't have permission to access this page.
            </p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
