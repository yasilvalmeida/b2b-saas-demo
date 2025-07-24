import { z } from 'zod';

// Zod schemas
export const KpiFiltersSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  userId: z.string().optional(),
});

// Response types
export interface KpiDashboardResponse {
  totalRevenue: number;
  totalDeals: number;
  closedDeals: number;
  averageDealSize: number;
  conversionRate: number;
  totalCommissions: number;
  averageCommissionRate: number;
  topPerformingUsers: Array<{
    userId: string;
    userName: string;
    totalRevenue: number;
    dealCount: number;
  }>;
  dealsByStage: Array<{
    stage: string;
    count: number;
    revenue: number;
  }>;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    deals: number;
  }>;
}

// Types
export type KpiFiltersRequest = z.infer<typeof KpiFiltersSchema>;
