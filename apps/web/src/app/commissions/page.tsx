'use client';

import { useQuery } from '@tanstack/react-query';
import { commissionsApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { AuthGuard } from '@/components/auth/auth-guard';

function CommissionsContent() {
  const { data: commissionSummary, isLoading: summaryLoading } = useQuery({
    queryKey: ['commission-summary'],
    queryFn: () => commissionsApi.getSummary(),
  });

  const { data: commissionsByUser, isLoading: userLoading } = useQuery({
    queryKey: ['commissions-by-user'],
    queryFn: () => commissionsApi.getByUser(),
  });

  const { data: allCommissions, isLoading: allLoading } = useQuery({
    queryKey: ['commissions'],
    queryFn: () => commissionsApi.getAll(),
  });

  const isLoading = summaryLoading || userLoading || allLoading;

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

  // Prepare chart data
  const userChartData =
    commissionsByUser?.data?.map((user: any) => ({
      name: user.userName,
      value: user.totalCommissions,
    })) || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className='p-6 space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>Commissions</h1>
        <p className='text-gray-600'>Track and manage commission payments</p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
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
            <p className='text-xs text-muted-foreground'>All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              $
              {commissionSummary?.data?.commissionsThisMonth?.toLocaleString() ||
                0}
            </div>
            <p className='text-xs text-muted-foreground'>Current month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Average Commission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {commissionSummary?.data?.averageCommissionRate?.toFixed(2) || 0}%
            </div>
            <p className='text-xs text-muted-foreground'>Per deal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {commissionsByUser?.data?.length || 0}
            </div>
            <p className='text-xs text-muted-foreground'>Earning commissions</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Commissions by User</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={commissionsByUser?.data || []}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='userName' />
                <YAxis />
                <Tooltip
                  formatter={(value) => [
                    `$${value.toLocaleString()}`,
                    'Commission',
                  ]}
                />
                <Bar dataKey='totalCommissions' fill='#3b82f6' />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Commission Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={userChartData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='value'
                >
                  {userChartData.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    `$${value.toLocaleString()}`,
                    'Commission',
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Commission Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Commission Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Deal</TableHead>
                <TableHead>Deal Amount</TableHead>
                <TableHead>Commission Rate</TableHead>
                <TableHead>Commission Amount</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allCommissions?.data?.map((commission: any) => (
                <TableRow key={commission.id}>
                  <TableCell className='font-medium'>
                    {commission.userName}
                  </TableCell>
                  <TableCell>{commission.dealTitle}</TableCell>
                  <TableCell>
                    ${commission.dealAmount.toLocaleString()}
                  </TableCell>
                  <TableCell>{commission.commissionRate}%</TableCell>
                  <TableCell className='font-medium text-green-600'>
                    ${commission.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(commission.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Commission Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Total Deals</TableHead>
                <TableHead>Total Commission</TableHead>
                <TableHead>Average Commission</TableHead>
                <TableHead>Last Commission</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commissionsByUser?.data?.map((user: any) => (
                <TableRow key={user.userId}>
                  <TableCell className='font-medium'>{user.userName}</TableCell>
                  <TableCell>{user.totalDeals}</TableCell>
                  <TableCell className='font-medium text-green-600'>
                    ${user.totalCommissions.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    $
                    {(user.totalCommissions / user.totalDeals).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {user.lastCommissionDate
                      ? new Date(user.lastCommissionDate).toLocaleDateString()
                      : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CommissionsPage() {
  return (
    <AuthGuard>
      <CommissionsContent />
    </AuthGuard>
  );
}
