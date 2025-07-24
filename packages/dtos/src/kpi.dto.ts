import { z } from 'zod';
import { IsString, IsOptional } from 'class-validator';
import { DealStage } from './common';

// Zod schemas
export const KpiFiltersSchema = z.object({
  period: z.enum(['day', 'week', 'month', 'quarter', 'year']).default('month'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// Class-validator DTOs
export class KpiFiltersDto {
  @IsString()
  @IsOptional()
  period?: 'day' | 'week' | 'month' | 'quarter' | 'year';

  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;
}

// Response types
export interface KpiSummaryResponse {
  totalDeals: number;
  totalRevenue: number;
  totalCommissions: number;
  averageDealSize: number;
  averageCommissionRate: number;
  conversionRate: number;
}

export interface DealStageBreakdownResponse {
  stage: DealStage;
  count: number;
  totalAmount: number;
  percentage: number;
}

export interface RevenueTrendResponse {
  period: string;
  revenue: number;
  deals: number;
  commissions: number;
}

export interface KpiDashboardResponse {
  summary: KpiSummaryResponse;
  stageBreakdown: DealStageBreakdownResponse[];
  revenueTrend: RevenueTrendResponse[];
  recentActivity: {
    id: string;
    action: string;
    entity: string;
    description: string;
    createdAt: string;
  }[];
}

// Types
export type KpiFiltersRequest = z.infer<typeof KpiFiltersSchema>; 