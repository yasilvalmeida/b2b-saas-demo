import { z } from 'zod';

// Enums
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum DealStage {
  PROSPECT = 'PROSPECT',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  LOST = 'LOST',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  PAST_DUE = 'PAST_DUE',
  TRIAL = 'TRIAL',
}

export enum PlanKey {
  FREE = 'FREE',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

export enum AuditAction {
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  DEAL_CREATED = 'DEAL_CREATED',
  DEAL_UPDATED = 'DEAL_UPDATED',
  DEAL_DELETED = 'DEAL_DELETED',
  STAGE_CHANGED = 'STAGE_CHANGED',
  COMMISSION_CALCULATED = 'COMMISSION_CALCULATED',
  USER_LOGGED_IN = 'USER_LOGGED_IN',
  USER_LOGGED_OUT = 'USER_LOGGED_OUT',
  ORGANIZATION_UPDATED = 'ORGANIZATION_UPDATED',
  SUBSCRIPTION_CREATED = 'SUBSCRIPTION_CREATED',
  SUBSCRIPTION_UPDATED = 'SUBSCRIPTION_UPDATED',
}

// Zod schemas
export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

export const DateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// Types
export type Pagination = z.infer<typeof PaginationSchema>;
export type DateRange = z.infer<typeof DateRangeSchema>;

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
} 