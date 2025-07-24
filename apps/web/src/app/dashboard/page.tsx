'use client'

import { useQuery } from '@tanstack/react-query'
import { dealsApi, commissionsApi } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function DashboardPage() {
  const { user } = useAuth()

  const { data: deals } = useQuery({
    queryKey: ['deals'],
    queryFn: () => dealsApi.getAll(),
  })

  const { data: commissionSummary } = useQuery({
    queryKey: ['commission-summary'],
    queryFn: () => commissionsApi.getSummary(),
  })

  const { data: commissionsByUser } = useQuery({
    queryKey: ['commissions-by-user'],
    queryFn: () => commissionsApi.getByUser(),
  })

  // Calculate metrics
  const totalDeals = deals?.data?.length || 0
  const totalRevenue = deals?.data?.reduce((sum: number, deal: any) => sum + deal.amount, 0) || 0
  const closedDeals = deals?.data?.filter((deal: any) => deal.stage === 'CLOSED').length || 0
  const averageCommissionRate = deals?.data?.reduce((sum: number, deal: any) => sum + deal.commissionRate, 0) / totalDeals || 0

  // Prepare chart data
  const stageData = [
    { stage: 'Prospect', count: deals?.data?.filter((d: any) => d.stage === 'PROSPECT').length || 0 },
    { stage: 'Active', count: deals?.data?.filter((d: any) => d.stage === 'ACTIVE').length || 0 },
    { stage: 'Closed', count: deals?.data?.filter((d: any) => d.stage === 'CLOSED').length || 0 },
    { stage: 'Lost', count: deals?.data?.filter((d: any) => d.stage === 'LOST').length || 0 },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}!</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeals}</div>
            <p className="text-xs text-muted-foreground">
              {closedDeals} closed this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all deals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Commission Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageCommissionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Average across deals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${commissionSummary?.data?.totalCommissions?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Paid this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Deals by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Commissions by User</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {commissionsByUser?.data?.map((user: any) => (
                <div key={user.userId} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{user.userName}</span>
                  <span className="text-sm text-gray-600">
                    ${user.totalCommissions.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Deals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deals?.data?.slice(0, 5).map((deal: any) => (
              <div key={deal.id} className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{deal.title}</h4>
                  <p className="text-sm text-gray-600">{deal.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${deal.amount.toLocaleString()}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    deal.stage === 'CLOSED' ? 'bg-green-100 text-green-800' :
                    deal.stage === 'ACTIVE' ? 'bg-blue-100 text-blue-800' :
                    deal.stage === 'PROSPECT' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {deal.stage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 