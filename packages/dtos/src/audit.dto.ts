import { z } from 'zod';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { AuditAction } from './common';

export const AuditFiltersSchema = z.object({
  action: z.nativeEnum(AuditAction).optional(),
  entity: z.string().optional(),
  entityId: z.string().optional(),
  userId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export class AuditFiltersDto {
  @IsEnum(AuditAction)
  @IsOptional()
  action?: AuditAction;

  @IsString()
  @IsOptional()
  entity?: string;

  @IsString()
  @IsOptional()
  entityId?: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;
}

export interface AuditLogResponse {
  id: string;
  organizationId: string;
  userId: string;
  userName: string;
  action: AuditAction;
  entity: string;
  entityId: string;
  meta: Record<string, any>;
  createdAt: string;
}

export type AuditFiltersRequest = z.infer<typeof AuditFiltersSchema>; 