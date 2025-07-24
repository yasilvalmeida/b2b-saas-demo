import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { KpiFiltersDto, KpiDashboardResponse } from '@b2b-saas/dtos';

@Injectable()
export class KpisService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(organizationId: string, filters?: KpiFiltersDto): Promise<KpiDashboardResponse> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Get summary metrics
    const [totalDeals, totalRevenue, totalCommissions, averageDealSize, averageCommissionRate, conversionRate] = await Promise.all([
      this.prisma.deal.count({ where: { organizationId } }),
      this.prisma.deal.aggregate({
        where: { organizationId },
        _sum: { amount: true },
      }),
      this.prisma.commissionEntry.aggregate({
        where: { deal: { organizationId } },
        _sum: { amount: true },
      }),
      this.prisma.deal.aggregate({
        where: { organizationId },
        _avg: { amount: true },
      }),
      this.prisma.deal.aggregate({
        where: { organizationId },
        _avg: { commissionRate: true },
      }),
      this.prisma.deal.aggregate({
        where: { organizationId },
        _count: { id: true },
      }),
    ]);

    const closedDeals = await this.prisma.deal.count({
      where: { organizationId, stage: 'CLOSED' },
    });

    // Get stage breakdown
    const stageBreakdown = await this.prisma.deal.groupBy({
      by: ['stage'],
      where: { organizationId },
      _count: { id: true },
      _sum: { amount: true },
    });

    // Get recent activity
    const recentActivity = await this.prisma.auditLog.findMany({
      where: { organizationId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return {
      summary: {
        totalDeals: totalDeals,
        totalRevenue: totalRevenue._sum.amount || 0,
        totalCommissions: totalCommissions._sum.amount || 0,
        averageDealSize: averageDealSize._avg.amount || 0,
        averageCommissionRate: averageCommissionRate._avg.commissionRate || 0,
        conversionRate: totalDeals > 0 ? (closedDeals / totalDeals) * 100 : 0,
      },
      stageBreakdown: stageBreakdown.map(stage => ({
        stage: stage.stage,
        count: stage._count.id,
        totalAmount: stage._sum.amount || 0,
        percentage: totalDeals > 0 ? (stage._count.id / totalDeals) * 100 : 0,
      })),
      revenueTrend: [], // Would be implemented with time-series data
      recentActivity: recentActivity.map(activity => ({
        id: activity.id,
        action: activity.action,
        entity: activity.entity,
        description: `${activity.user.name} performed ${activity.action.toLowerCase().replace('_', ' ')}`,
        createdAt: activity.createdAt.toISOString(),
      })),
    };
  }
} 