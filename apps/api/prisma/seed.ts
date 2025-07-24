import {
  PrismaClient,
  UserRole,
  DealStage,
  PlanKey,
  SubscriptionStatus,
  AuditAction,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create plans
  console.log('Creating plans...');
  const freePlan = await prisma.plan.upsert({
    where: { key: PlanKey.FREE },
    update: {},
    create: {
      key: PlanKey.FREE,
      name: 'Free Plan',
      description: 'Perfect for getting started',
      maxDeals: 10,
      maxUsers: 2,
      priceMonthly: 0,
      features: [
        'Basic deal tracking',
        'Commission calculations',
        'Basic reporting',
      ],
    },
  });

  const proPlan = await prisma.plan.upsert({
    where: { key: PlanKey.PRO },
    update: {},
    create: {
      key: PlanKey.PRO,
      name: 'Pro Plan',
      description: 'For growing teams',
      maxDeals: 100,
      maxUsers: 10,
      priceMonthly: 99,
      features: [
        'Advanced deal tracking',
        'Commission calculations',
        'Advanced reporting',
        'Calendar integration',
        'Audit logs',
      ],
    },
  });

  const enterprisePlan = await prisma.plan.upsert({
    where: { key: PlanKey.ENTERPRISE },
    update: {},
    create: {
      key: PlanKey.ENTERPRISE,
      name: 'Enterprise Plan',
      description: 'For large organizations',
      maxDeals: 1000,
      maxUsers: 100,
      priceMonthly: 299,
      features: [
        'Unlimited deal tracking',
        'Advanced commission calculations',
        'Custom reporting',
        'Full calendar integration',
        'Advanced audit logs',
        'Priority support',
      ],
    },
  });

  // Create organization
  console.log('Creating organization...');
  const organization = await prisma.organization.create({
    data: {
      name: 'Demo Organization',
    },
  });

  // Create users
  console.log('Creating users...');
  const adminPassword = await bcrypt.hash('admin123', 12);
  const userPassword = await bcrypt.hash('user123', 12);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@demo.com',
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
      organizationId: organization.id,
    },
  });

  const user = await prisma.user.create({
    data: {
      name: 'Regular User',
      email: 'user@demo.com',
      passwordHash: userPassword,
      role: UserRole.USER,
      organizationId: organization.id,
    },
  });

  // Create subscription
  console.log('Creating subscription...');
  await prisma.subscription.create({
    data: {
      organizationId: organization.id,
      planId: proPlan.id,
      status: SubscriptionStatus.ACTIVE,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  });

  // Create deals
  console.log('Creating deals...');
  const deals = [
    {
      title: 'Enterprise Software License',
      amount: 50000,
      stage: DealStage.CLOSED,
      commissionRate: 15,
      closeDate: new Date('2024-01-15'),
      description: 'Annual software license for enterprise client',
    },
    {
      title: 'Consulting Services',
      amount: 25000,
      stage: DealStage.ACTIVE,
      commissionRate: 12,
      description: '6-month consulting engagement',
    },
    {
      title: 'Training Program',
      amount: 15000,
      stage: DealStage.PROSPECT,
      commissionRate: 10,
      description: 'Corporate training program',
    },
    {
      title: 'Support Contract',
      amount: 8000,
      stage: DealStage.CLOSED,
      commissionRate: 8,
      closeDate: new Date('2024-02-01'),
      description: 'Annual support contract',
    },
    {
      title: 'Custom Development',
      amount: 75000,
      stage: DealStage.ACTIVE,
      commissionRate: 20,
      description: 'Custom software development project',
    },
    {
      title: 'Data Migration',
      amount: 12000,
      stage: DealStage.LOST,
      commissionRate: 10,
      description: 'Data migration project (lost to competitor)',
    },
    {
      title: 'Cloud Migration',
      amount: 45000,
      stage: DealStage.CLOSED,
      commissionRate: 18,
      closeDate: new Date('2024-01-30'),
      description: 'Cloud infrastructure migration',
    },
    {
      title: 'Security Audit',
      amount: 18000,
      stage: DealStage.PROSPECT,
      commissionRate: 12,
      description: 'Comprehensive security audit',
    },
    {
      title: 'Performance Optimization',
      amount: 22000,
      stage: DealStage.ACTIVE,
      commissionRate: 15,
      description: 'System performance optimization',
    },
    {
      title: 'Integration Project',
      amount: 35000,
      stage: DealStage.CLOSED,
      commissionRate: 16,
      closeDate: new Date('2024-02-10'),
      description: 'Third-party system integration',
    },
  ];

  for (const dealData of deals) {
    await prisma.deal.create({
      data: {
        ...dealData,
        organizationId: organization.id,
      },
    });
  }

  // Create commission entries for closed deals
  console.log('Creating commission entries...');
  const closedDeals = await prisma.deal.findMany({
    where: {
      organizationId: organization.id,
      stage: DealStage.CLOSED,
    },
  });

  for (const deal of closedDeals) {
    const commissionAmount = (deal.amount * deal.commissionRate) / 100;
    await prisma.commissionEntry.create({
      data: {
        dealId: deal.id,
        userId: admin.id,
        amount: commissionAmount,
      },
    });
  }

  // Create KPI snapshots
  console.log('Creating KPI snapshots...');
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
  const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 7);

  const currentMonthStats = await prisma.deal.aggregate({
    where: {
      organizationId: organization.id,
      createdAt: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    },
    _count: { id: true },
    _sum: { amount: true },
  });

  const currentMonthClosed = await prisma.deal.aggregate({
    where: {
      organizationId: organization.id,
      stage: DealStage.CLOSED,
      closeDate: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    },
    _count: { id: true },
    _sum: { amount: true },
  });

  const currentMonthCommissions = await prisma.commissionEntry.aggregate({
    where: {
      deal: {
        organizationId: organization.id,
        closeDate: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    },
    _sum: { amount: true },
  });

  await prisma.kpiSnapshot.upsert({
    where: {
      organizationId_period: {
        organizationId: organization.id,
        period: currentMonth,
      },
    },
    update: {},
    create: {
      organizationId: organization.id,
      period: currentMonth,
      totalDeals: currentMonthStats._count.id,
      closedDeals: currentMonthClosed._count.id,
      totalRevenue: currentMonthStats._sum.amount || 0,
      commissionsPaid: currentMonthCommissions._sum.amount || 0,
    },
  });

  // Create calendar slots
  console.log('Creating calendar slots...');
  const calendarSlots = [
    {
      start: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      end: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 1 hour later
      isBooked: false,
      title: 'Available for meetings',
      description: 'Open slot for client meetings',
    },
    {
      start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
      end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours later
      isBooked: true,
      title: 'Client Demo',
      description: 'Product demonstration for potential client',
    },
    {
      start: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000), // 1.5 hours later
      isBooked: false,
      title: 'Available',
      description: 'Open slot for consultations',
    },
  ];

  for (const slotData of calendarSlots) {
    await prisma.calendarSlot.create({
      data: {
        ...slotData,
        userId: admin.id,
      },
    });
  }

  // Create audit logs
  console.log('Creating audit logs...');
  const auditLogs = [
    {
      action: AuditAction.USER_CREATED,
      entity: 'User',
      entityId: admin.id,
      meta: { email: admin.email, role: admin.role },
    },
    {
      action: AuditAction.USER_CREATED,
      entity: 'User',
      entityId: user.id,
      meta: { email: user.email, role: user.role },
    },
    {
      action: AuditAction.ORGANIZATION_UPDATED,
      entity: 'Organization',
      entityId: organization.id,
      meta: { name: organization.name },
    },
    {
      action: AuditAction.SUBSCRIPTION_CREATED,
      entity: 'Subscription',
      entityId: 'subscription-1',
      meta: { planKey: proPlan.key, status: SubscriptionStatus.ACTIVE },
    },
  ];

  for (const logData of auditLogs) {
    await prisma.auditLog.create({
      data: {
        ...logData,
        organizationId: organization.id,
        userId: admin.id,
      },
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log('\n📋 Seed Data Summary:');
  console.log(`- Organization: ${organization.name}`);
  console.log(`- Admin User: ${admin.email} (password: admin123)`);
  console.log(`- Regular User: ${user.email} (password: user123)`);
  console.log(
    `- Plans: ${freePlan.name}, ${proPlan.name}, ${enterprisePlan.name}`
  );
  console.log(`- Deals: ${deals.length} deals created`);
  console.log(
    `- Commission Entries: ${closedDeals.length} entries for closed deals`
  );
  console.log(`- Calendar Slots: ${calendarSlots.length} slots created`);
  console.log(`- Audit Logs: ${auditLogs.length} entries created`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
