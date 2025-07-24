import { UserRole, DealStage } from './common';

export class AuthResponseDto {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    organizationId: string;
  };

  accessToken: string;

  refreshToken: string;
}

export class UserResponseDto {
  id: string;

  name: string;

  email: string;

  role: UserRole;

  organizationId: string;

  createdAt: Date;
}

export class UserProfileResponseDto {
  id: string;

  name: string;

  email: string;

  role: UserRole;

  organizationId: string;

  createdAt: Date;
}

export class DealResponseDto {
  id: string;

  title: string;

  amount: number;

  stage: DealStage;

  commissionRate: number;

  closeDate: Date | null;

  description: string | null;

  organizationId: string;

  createdAt: Date;

  updatedAt: Date;
}

export class DealWithCommissionResponseDto extends DealResponseDto {
  commissionAmount: number;
}

export class CommissionResponseDto {
  id: string;

  dealId: string;

  userId: string;

  amount: number;

  createdAt: Date;
}

export class CommissionSummaryResponseDto {
  totalCommissions: number;

  totalDeals: number;

  averageCommissionRate: number;

  totalRevenue: number;
}

export class CommissionByUserResponseDto {
  userId: string;

  userName: string;

  totalCommissions: number;

  dealCount: number;
}

export class CalendarSlotResponseDto {
  id: string;

  userId: string;

  start: Date;

  end: Date;

  isBooked: boolean;

  title: string | null;

  description: string | null;

  createdAt: Date;

  updatedAt: Date;
}

export class OrganizationResponseDto {
  id: string;

  name: string;

  createdAt: Date;

  updatedAt: Date;
}

export class KpiDashboardResponseDto {
  totalDeals: number;

  totalRevenue: number;

  totalCommissions: number;

  averageCommissionRate: number;

  dealsByStage: {
    stage: DealStage;
    count: number;
  }[];

  recentActivity: {
    id: string;
    action: string;
    entity: string;
    createdAt: Date;
    user: {
      name: string;
      email: string;
    };
  }[];
}
