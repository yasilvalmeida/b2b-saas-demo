import { z } from 'zod';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

// Zod schemas
export const CommissionFiltersSchema = z.object({
  userId: z.string().optional(),
  dealId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// Class-validator DTOs
export class CommissionFiltersDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  dealId?: string;

  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;
}

// Response types
export interface CommissionResponse {
  id: string;
  dealId: string;
  userId: string;
  amount: number;
  dealTitle: string;
  dealAmount: number;
  commissionRate: number;
  userName: string;
  createdAt: string;
}

export interface CommissionSummaryResponse {
  totalCommissions: number;
  totalDeals: number;
  averageCommissionRate: number;
  commissionsThisMonth: number;
  commissionsThisYear: number;
}

export interface CommissionByUserResponse {
  userId: string;
  userName: string;
  totalCommissions: number;
  totalDeals: number;
  averageCommissionRate: number;
}

// Types
export type CommissionFiltersRequest = z.infer<typeof CommissionFiltersSchema>; 