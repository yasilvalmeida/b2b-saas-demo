// Frontend-safe exports (no class-validator decorators)
export * from './common';

// Re-export only the Zod schemas and types, not the class-validator DTOs
export {
  LoginSchema,
  RegisterSchema,
  RefreshTokenSchema,
  type LoginRequest,
  type RegisterRequest,
  type RefreshTokenRequest,
  type AuthResponse,
  type JwtPayload,
} from './auth.dto';

export {
  CreateDealSchema,
  UpdateDealSchema,
  ChangeDealStageSchema,
  DealFiltersSchema,
  type CreateDealRequest,
  type UpdateDealRequest,
  type ChangeDealStageRequest,
  type DealFiltersRequest,
  type DealResponse,
  type DealWithCommissionResponse,
} from './deal.dto';

export {
  CreateUserSchema,
  UpdateUserSchema,
  type CreateUserRequest,
  type UpdateUserRequest,
  type UserResponse,
  type UserProfileResponse,
} from './user.dto';

export {
  UpdateOrganizationSchema,
  type UpdateOrganizationRequest,
  type OrganizationResponse,
} from './organization.dto';

export {
  CommissionFiltersSchema,
  type CommissionFiltersRequest,
  type CommissionResponse,
  type CommissionSummaryResponse,
  type CommissionByUserResponse,
} from './commission.dto';

export {
  KpiFiltersSchema,
  type KpiFiltersRequest,
  type KpiDashboardResponse,
} from './kpi.dto';

export {
  CreateCalendarSlotSchema,
  UpdateCalendarSlotSchema,
  type CreateCalendarSlotRequest,
  type UpdateCalendarSlotRequest,
  type CalendarSlotResponse,
} from './calendar.dto';

export {
  CreateCheckoutSessionSchema,
  CreatePortalSessionSchema,
  type CreateCheckoutSessionRequest,
  type CreatePortalSessionRequest,
  type PlanResponse,
  type SubscriptionResponse,
  type BillingPortalResponse,
  type CheckoutSessionResponse,
} from './billing.dto';

export {
  AuditFiltersSchema,
  type AuditFiltersRequest,
  type AuditLogResponse,
} from './audit.dto';

// API Response DTOs (class-based for Swagger)
export * from './api-responses';
