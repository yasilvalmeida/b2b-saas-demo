'use client';

import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    // Use window.location for immediate redirect
    const checkAndRedirect = () => {
      try {
        const authData = localStorage.getItem('auth-storage');
        if (authData) {
          const parsed = JSON.parse(authData);
          if (parsed.state?.accessToken && parsed.state?.user) {
            window.location.href = '/dashboard';
            return;
          }
        }
        // No valid auth data, redirect to login
        window.location.href = '/login';
      } catch (error) {
        // Any error, redirect to login
        window.location.href = '/login';
      }
    };

    // Execute immediately
    checkAndRedirect();
  }, []);

  // Show minimal loading while redirecting
  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='w-8 h-8 rounded-full border-2 border-gray-300 border-t-blue-600 animate-spin'></div>
    </div>
  );
}
