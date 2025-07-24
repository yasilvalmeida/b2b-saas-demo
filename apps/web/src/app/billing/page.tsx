'use client';

import { useQuery } from '@tanstack/react-query';
import { billingApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, Package } from 'lucide-react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { RoleGuard } from '@/components/auth/role-guard';

function BillingContent() {
  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ['billing-plans'],
    queryFn: () => billingApi.getPlans(),
  });

  const { data: subscription, isLoading: subscriptionLoading } = useQuery({
    queryKey: ['billing-subscription'],
    queryFn: () => billingApi.getSubscription(),
  });

  const isLoading = plansLoading || subscriptionLoading;

  if (isLoading) {
    return (
      <div className='p-6'>
        <div className='animate-pulse space-y-4'>
          <div className='h-8 bg-gray-200 rounded w-1/4'></div>
          <div className='h-64 bg-gray-200 rounded'></div>
        </div>
      </div>
    );
  }

  const currentPlan = subscription?.data?.plan || 'FREE';
  const plansList: any[] = plans?.data || [
    {
      key: 'FREE',
      name: 'Free Plan',
      priceMonthly: 0,
      features: [
        'Basic deal tracking',
        'Commission calculations',
        'Basic reporting',
      ],
    },
    {
      key: 'PRO',
      name: 'Pro Plan',
      priceMonthly: 99,
      features: [
        'Advanced deal tracking',
        'Commission calculations',
        'Advanced reporting',
        'Calendar integration',
        'Audit logs',
      ],
    },
    {
      key: 'ENTERPRISE',
      name: 'Enterprise Plan',
      priceMonthly: 299,
      features: [
        'Unlimited deal tracking',
        'Advanced commission calculations',
        'Custom reporting',
        'Full calendar integration',
        'Advanced audit logs',
      ],
    },
  ];

  return (
    <div className='p-6 space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>
          Billing & Subscription
        </h1>
        <p className='text-gray-600'>
          Manage your subscription and billing information
        </p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-lg font-semibold'>
                {plansList.find((p) => p.key === currentPlan)?.name ||
                  'Free Plan'}
              </h3>
              <p className='text-gray-600'>
                $
                {plansList.find((p) => p.key === currentPlan)?.priceMonthly ||
                  0}
                /month
              </p>
            </div>
            <Badge
              variant='outline'
              className='text-green-600 border-green-600'
            >
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h2 className='text-xl font-semibold mb-4'>Available Plans</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {plansList.map((plan) => (
            <Card
              key={plan.key}
              className={`relative flex flex-col ${currentPlan === plan.key ? 'ring-2 ring-blue-500' : ''}`}
            >
              {currentPlan === plan.key && (
                <div className='absolute -top-2 left-1/2 transform -translate-x-1/2'>
                  <Badge className='bg-blue-500 text-white'>Current Plan</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <Package className='mr-2 h-5 w-5' />
                  {plan.name}
                </CardTitle>
                <div className='text-3xl font-bold'>
                  ${plan.priceMonthly}
                  <span className='text-sm font-normal text-gray-600'>
                    /month
                  </span>
                </div>
              </CardHeader>
              <CardContent className='flex flex-col flex-1'>
                <ul className='space-y-2 flex-1'>
                  {plan.features.map((feature: string, index: number) => (
                    <li key={index} className='flex items-center'>
                      <Check className='h-4 w-4 text-green-500 mr-2' />
                      <span className='text-sm'>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className='mt-6'>
                  <Button
                    className='w-full'
                    variant={currentPlan === plan.key ? 'outline' : 'default'}
                    disabled={currentPlan === plan.key}
                  >
                    {currentPlan === plan.key ? 'Current Plan' : 'Upgrade'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Billing Actions */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <CreditCard className='mr-2 h-5 w-5' />
              Billing Portal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-gray-600 mb-4'>
              Manage your billing information, view invoices, and update payment
              methods.
            </p>
            <Button variant='outline' className='w-full'>
              Open Billing Portal
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='flex justify-between items-center p-3 bg-gray-50 rounded'>
                <div>
                  <div className='font-medium'>Professional Plan</div>
                  <div className='text-sm text-gray-600'>March 2024</div>
                </div>
                <div className='text-right'>
                  <div className='font-medium'>$99.00</div>
                  <Badge
                    variant='outline'
                    className='text-green-600 border-green-600'
                  >
                    Paid
                  </Badge>
                </div>
              </div>
              <div className='flex justify-between items-center p-3 bg-gray-50 rounded'>
                <div>
                  <div className='font-medium'>Professional Plan</div>
                  <div className='text-sm text-gray-600'>February 2024</div>
                </div>
                <div className='text-right'>
                  <div className='font-medium'>$99.00</div>
                  <Badge
                    variant='outline'
                    className='text-green-600 border-green-600'
                  >
                    Paid
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={['ADMIN']}>
        <BillingContent />
      </RoleGuard>
    </AuthGuard>
  );
}
