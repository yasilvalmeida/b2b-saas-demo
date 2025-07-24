'use client';

import { useQuery } from '@tanstack/react-query';
import { kpisApi, dealsApi, commissionsApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { AuthGuard } from '@/components/auth/auth-guard';
import { RoleGuard } from '@/components/auth/role-guard';

function KpisContent() {
  const { data: kpiDashboard, isLoading: kpiLoading } = useQuery({
    queryKey: ['kpi-dashboard'],
    queryFn: () => kpisApi.getDashboard(),
  });

  const { data: deals, isLoading: dealsLoading } = useQuery({
    queryKey: ['deals'],
    queryFn: () => dealsApi.getAll(),
  });

  const { data: commissionSummary, isLoading: commissionLoading } = useQuery({
    queryKey: ['commission-summary'],
    queryFn: () => commissionsApi.getSummary(),
  });

  const isLoading = kpiLoading || dealsLoading || commissionLoading;

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

  // Calculate metrics
  const totalDeals = deals?.data?.length || 0;
  const totalRevenue =
    deals?.data?.reduce((sum: number, deal: any) => sum + deal.amount, 0) || 0;
  const closedDeals =
    deals?.data?.filter((deal: any) => deal.stage === 'CLOSED').length || 0;
  const activeDeals =
    deals?.data?.filter((deal: any) => deal.stage === 'ACTIVE').length || 0;
  const conversionRate = totalDeals > 0 ? (closedDeals / totalDeals) * 100 : 0;
  const averageDealSize = totalDeals > 0 ? totalRevenue / totalDeals : 0;

  // Prepare chart data
  const stageData = [
    {
      stage: 'Prospect',
      count:
        deals?.data?.filter((d: any) => d.stage === 'PROSPECT').length || 0,
    },
    { stage: 'Active', count: activeDeals },
    { stage: 'Closed', count: closedDeals },
    {
      stage: 'Lost',
      count: deals?.data?.filter((d: any) => d.stage === 'LOST').length || 0,
    },
  ];

  const monthlyData = kpiDashboard?.data?.monthlyMetrics || [
    { month: 'Jan', deals: 12, revenue: 150000, commissions: 15000 },
    { month: 'Feb', deals: 18, revenue: 220000, commissions: 22000 },
    { month: 'Mar', deals: 15, revenue: 180000, commissions: 18000 },
    { month: 'Apr', deals: 22, revenue: 280000, commissions: 28000 },
    { month: 'May', deals: 25, revenue: 320000, commissions: 32000 },
    { month: 'Jun', deals: 30, revenue: 400000, commissions: 40000 },
  ];

  return (
    <div className='p-6 space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>KPIs & Analytics</h1>
        <p className='text-gray-600'>
          Key performance indicators and business metrics
        </p>
      </div>

      {/* Main KPI Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              ${totalRevenue.toLocaleString()}
            </div>
            <p className='text-xs text-muted-foreground'>All time revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {conversionRate.toFixed(1)}%
            </div>
            <p className='text-xs text-muted-foreground'>
              Deals closed vs total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Average Deal Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              ${averageDealSize.toLocaleString()}
            </div>
            <p className='text-xs text-muted-foreground'>Per deal average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Commissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              $
              {commissionSummary?.data?.totalCommissions?.toLocaleString() || 0}
            </div>
            <p className='text-xs text-muted-foreground'>Paid to sales team</p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalDeals}</div>
            <p className='text-xs text-muted-foreground'>All deals created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Active Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{activeDeals}</div>
            <p className='text-xs text-muted-foreground'>
              Currently in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Closed Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{closedDeals}</div>
            <p className='text-xs text-muted-foreground'>Successfully closed</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='month' />
                <YAxis />
                <Tooltip
                  formatter={(value) => [
                    `$${value.toLocaleString()}`,
                    'Amount',
                  ]}
                />
                <Area
                  type='monotone'
                  dataKey='revenue'
                  stackId='1'
                  stroke='#8884d8'
                  fill='#8884d8'
                />
                <Area
                  type='monotone'
                  dataKey='commissions'
                  stackId='2'
                  stroke='#82ca9d'
                  fill='#82ca9d'
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deals by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={stageData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='stage' />
                <YAxis />
                <Tooltip />
                <Bar dataKey='count' fill='#3b82f6' />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='month' />
              <YAxis />
              <Tooltip formatter={(value) => [value, 'Count']} />
              <Line
                type='monotone'
                dataKey='deals'
                stroke='#8884d8'
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Metrics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div className='text-center p-4 bg-gray-50 rounded-lg'>
              <div className='text-2xl font-bold text-blue-600'>
                {conversionRate.toFixed(1)}%
              </div>
              <div className='text-sm text-gray-600'>Conversion Rate</div>
            </div>
            <div className='text-center p-4 bg-gray-50 rounded-lg'>
              <div className='text-2xl font-bold text-green-600'>
                ${averageDealSize.toLocaleString()}
              </div>
              <div className='text-sm text-gray-600'>Average Deal Size</div>
            </div>
            <div className='text-center p-4 bg-gray-50 rounded-lg'>
              <div className='text-2xl font-bold text-purple-600'>
                {totalDeals > 0
                  ? (totalRevenue / totalDeals / 1000).toFixed(1)
                  : 0}
                k
              </div>
              <div className='text-sm text-gray-600'>Revenue per Deal (k)</div>
            </div>
            <div className='text-center p-4 bg-gray-50 rounded-lg'>
              <div className='text-2xl font-bold text-orange-600'>
                {commissionSummary?.data?.totalCommissions
                  ? (
                      (commissionSummary.data.totalCommissions / totalRevenue) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </div>
              <div className='text-sm text-gray-600'>Commission Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function KpisPage() {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={['ADMIN']}>
        <KpisContent />
      </RoleGuard>
    </AuthGuard>
  );
}
