import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

  async getSubscription(organizationId: string) {
    return this.prisma.subscription.findFirst({
      where: { organizationId },
      include: {
        plan: true,
      },
    });
  }

  async getPlans() {
    return this.prisma.plan.findMany({
      orderBy: { priceMonthly: 'asc' },
    });
  }
}
