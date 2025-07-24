import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { DealsModule } from './modules/deals/deals.module';
import { CommissionsModule } from './modules/commissions/commissions.module';
import { KpisModule } from './modules/kpis/kpis.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { BillingModule } from './modules/billing/billing.module';
import { AuditModule } from './modules/audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    OrganizationsModule,
    DealsModule,
    CommissionsModule,
    KpisModule,
    CalendarModule,
    BillingModule,
    AuditModule,
  ],
})
export class AppModule {} 