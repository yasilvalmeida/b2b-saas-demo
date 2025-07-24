import { z } from 'zod';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  Min,
  Max,
  MinLength,
  MaxLength,
} from 'class-validator';
import { DealStage } from './common';

// Zod schemas
export const CreateDealSchema = z.object({
  title: z.string().min(2).max(200),
  amount: z.number().positive(),
  stage: z.nativeEnum(DealStage).default(DealStage.PROSPECT),
  commissionRate: z.number().min(0).max(100).default(10),
  closeDate: z.string().datetime().optional(),
  description: z.string().optional(),
});

export const UpdateDealSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  amount: z.number().positive().optional(),
  stage: z.nativeEnum(DealStage).optional(),
  commissionRate: z.number().min(0).max(100).optional(),
  closeDate: z.string().datetime().optional(),
  description: z.string().optional(),
});

export const ChangeDealStageSchema = z.object({
  stage: z.nativeEnum(DealStage),
  closeDate: z.string().datetime().optional(),
});

export const DealFiltersSchema = z.object({
  stage: z.nativeEnum(DealStage).optional(),
  minAmount: z.number().positive().optional(),
  maxAmount: z.number().positive().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// Class-validator DTOs
export class CreateDealDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsEnum(DealStage)
  @IsOptional()
  stage?: DealStage;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  commissionRate?: number;

  @IsString()
  @IsOptional()
  closeDate?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateDealDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  @IsOptional()
  title?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @IsEnum(DealStage)
  @IsOptional()
  stage?: DealStage;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  commissionRate?: number;

  @IsString()
  @IsOptional()
  closeDate?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class ChangeDealStageDto {
  @IsEnum(DealStage)
  stage: DealStage;

  @IsString()
  @IsOptional()
  closeDate?: string;
}

export class DealFiltersDto {
  @IsEnum(DealStage)
  @IsOptional()
  stage?: DealStage;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minAmount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  maxAmount?: number;

  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;
}

// Response types
export interface DealResponse {
  id: string;
  title: string;
  amount: number;
  stage: DealStage;
  commissionRate: number;
  closeDate?: string;
  description?: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DealWithCommissionResponse extends DealResponse {
  commissionAmount: number;
  isClosed: boolean;
}

// Types
export type CreateDealRequest = z.infer<typeof CreateDealSchema>;
export type UpdateDealRequest = z.infer<typeof UpdateDealSchema>;
export type ChangeDealStageRequest = z.infer<typeof ChangeDealStageSchema>;
export type DealFiltersRequest = z.infer<typeof DealFiltersSchema>;
