'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import {
  BarChart3,
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  Home,
  LogOut,
  Settings,
  Users,
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    roles: ['ADMIN', 'USER'],
  },
  { name: 'Deals', href: '/deals', icon: FileText, roles: ['ADMIN', 'USER'] },
  {
    name: 'Commissions',
    href: '/commissions',
    icon: DollarSign,
    roles: ['ADMIN', 'USER'],
  },
  { name: 'KPIs', href: '/kpis', icon: BarChart3, roles: ['ADMIN'] },
  {
    name: 'Calendar',
    href: '/calendar',
    icon: Calendar,
    roles: ['ADMIN', 'USER'],
  },
  { name: 'Users', href: '/users', icon: Users, roles: ['ADMIN'] },
  { name: 'Billing', href: '/billing', icon: CreditCard, roles: ['ADMIN'] },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['ADMIN', 'USER'],
  },
];

export function Navigation() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  // Filter navigation items based on user role
  const filteredNavigation = navigation.filter((item) => {
    if (!user || !user.role) return false;
    return item.roles.includes(user.role);
  });

  return (
    <nav className='flex flex-col h-full'>
      <div className='flex-1 space-y-1'>
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive
                    ? 'text-gray-500'
                    : 'text-gray-400 group-hover:text-gray-500'
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className='flex-shrink-0 border-t border-gray-200 p-4'>
        <Button
          variant='ghost'
          className='w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          onClick={logout}
        >
          <LogOut className='mr-3 h-5 w-5' />
          Sign out
        </Button>
      </div>
    </nav>
  );
}
