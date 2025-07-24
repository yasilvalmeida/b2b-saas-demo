import { z } from 'zod';

// Zod schemas
export const CommissionFiltersSchema = z.object({
  userId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// Response types
export interface CommissionResponse {
  id: string;
  dealId: string;
  deal: {
    id: string;
    title: string;
    amount: number;
  };
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  amount: number;
  rate: number;
  status: string;
  paidAt?: string;
  createdAt: string;
}

export interface CommissionSummaryResponse {
  totalCommissions: number;
  paidCommissions: number;
  pendingCommissions: number;
  averageCommissionRate: number;
  totalDeals: number;
}

export interface CommissionByUserResponse {
  userId: string;
  userName: string;
  totalCommissions: number;
  paidCommissions: number;
  pendingCommissions: number;
  dealCount: number;
}

// Types
export type CommissionFiltersRequest = z.infer<typeof CommissionFiltersSchema>;
