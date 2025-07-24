'use client';

import { useAuth } from '@/hooks/use-auth';
import { Navigation } from './navigation';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();

  // Only show sidebar if user is authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <main className='flex-1 relative overflow-y-auto focus:outline-none'>
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='flex h-screen'>
        {/* Sidebar - only shown when authenticated */}
        <div className='hidden md:flex md:w-64 md:flex-col'>
          <div className='flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r border-gray-200'>
            <div className='flex items-center flex-shrink-0 px-4'>
              <h1 className='text-xl font-semibold text-gray-900'>
                B2B SaaS Demo
              </h1>
            </div>
            <div className='mt-5 flex-grow flex flex-col'>
              <Navigation />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className='flex flex-col w-0 flex-1 overflow-hidden'>
          <main className='flex-1 relative overflow-y-auto focus:outline-none'>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
