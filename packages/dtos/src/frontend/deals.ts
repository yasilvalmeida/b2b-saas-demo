import { z } from 'zod';
import { DealStage } from '../common';

// Zod schemas
export const CreateDealSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000),
  amount: z.number().positive(),
  commissionRate: z.number().min(0).max(100),
  expectedCloseDate: z.string().datetime().optional(),
});

export const UpdateDealSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  amount: z.number().positive().optional(),
  commissionRate: z.number().min(0).max(100).optional(),
  expectedCloseDate: z.string().datetime().optional(),
});

export const ChangeDealStageSchema = z.object({
  stage: z.nativeEnum(DealStage),
});

export const DealFiltersSchema = z.object({
  stage: z.nativeEnum(DealStage).optional(),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
  search: z.string().optional(),
});

// Response types
export interface DealResponse {
  id: string;
  title: string;
  description: string;
  amount: number;
  commissionRate: number;
  stage: DealStage;
  expectedCloseDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DealWithCommissionResponse extends DealResponse {
  commission: {
    id: string;
    amount: number;
    status: string;
  };
}

// Types
export type CreateDealRequest = z.infer<typeof CreateDealSchema>;
export type UpdateDealRequest = z.infer<typeof UpdateDealSchema>;
export type ChangeDealStageRequest = z.infer<typeof ChangeDealStageSchema>;
export type DealFiltersRequest = z.infer<typeof DealFiltersSchema>;
