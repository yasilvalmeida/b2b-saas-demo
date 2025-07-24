import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CommissionFiltersDto, CommissionResponse, CommissionSummaryResponse, CommissionByUserResponse } from '@b2b-saas/dtos';

@Injectable()
export class CommissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId: string, filters?: CommissionFiltersDto): Promise<CommissionResponse[]> {
    const where: any = {
      deal: { organizationId },
    };

    if (filters?.userId) {
      where.userId = filters.userId;
    }

    if (filters?.dealId) {
      where.dealId = filters.dealId;
    }

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
      if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
    }

    const commissions = await this.prisma.commissionEntry.findMany({
      where,
      include: {
        deal: true,
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return commissions.map(commission => ({
      id: commission.id,
      dealId: commission.dealId,
      userId: commission.userId,
      amount: commission.amount,
      dealTitle: commission.deal.title,
      dealAmount: commission.deal.amount,
      commissionRate: commission.deal.commissionRate,
      userName: commission.user.name,
      createdAt: commission.createdAt.toISOString(),
    }));
  }

  async getSummary(organizationId: string): Promise<CommissionSummaryResponse> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [totalCommissions, totalDeals, commissionsThisMonth, commissionsThisYear] = await Promise.all([
      this.prisma.commissionEntry.aggregate({
        where: { deal: { organizationId } },
        _sum: { amount: true },
      }),
      this.prisma.deal.count({
        where: { organizationId },
      }),
      this.prisma.commissionEntry.aggregate({
        where: {
          deal: { organizationId },
          createdAt: { gte: startOfMonth },
        },
        _sum: { amount: true },
      }),
      this.prisma.commissionEntry.aggregate({
        where: {
          deal: { organizationId },
          createdAt: { gte: startOfYear },
        },
        _sum: { amount: true },
      }),
    ]);

    const averageCommissionRate = await this.prisma.deal.aggregate({
      where: { organizationId },
      _avg: { commissionRate: true },
    });

    return {
      totalCommissions: totalCommissions._sum.amount || 0,
      totalDeals,
      averageCommissionRate: averageCommissionRate._avg.commissionRate || 0,
      commissionsThisMonth: commissionsThisMonth._sum.amount || 0,
      commissionsThisYear: commissionsThisYear._sum.amount || 0,
    };
  }

  async getByUser(organizationId: string): Promise<CommissionByUserResponse[]> {
    const users = await this.prisma.user.findMany({
      where: { organizationId },
      include: {
        commissions: {
          include: {
            deal: true,
          },
        },
      },
    });

    return users.map(user => {
      const totalCommissions = user.commissions.reduce((sum, commission) => sum + commission.amount, 0);
      const totalDeals = user.commissions.length;
      const averageCommissionRate = totalDeals > 0 
        ? user.commissions.reduce((sum, commission) => sum + commission.deal.commissionRate, 0) / totalDeals
        : 0;

      return {
        userId: user.id,
        userName: user.name,
        totalCommissions,
        totalDeals,
        averageCommissionRate,
      };
    });
  }
} 