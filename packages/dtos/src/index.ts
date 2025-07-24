// Backend-safe exports (no zod dependencies)

// API Response DTOs
export * from './api-responses';

// Common types
export * from './common';

// Backend DTOs (class-validator only)
export { 
  LoginDto, 
  RegisterDto, 
  RefreshTokenDto
} from './auth.dto';

export type { 
  AuthResponse,
  JwtPayload
} from './auth.dto';

export { 
  CreateUserDto, 
  UpdateUserDto
} from './user.dto';

export type { 
  UserResponse, 
  UserProfileResponse 
} from './user.dto';

export { 
  UpdateOrganizationDto
} from './organization.dto';

export type { 
  OrganizationResponse 
} from './organization.dto';

export { 
  CreateDealDto, 
  UpdateDealDto, 
  DealFiltersDto,
  ChangeDealStageDto
} from './deal.dto';

export type { 
  DealResponse,
  DealWithCommissionResponse
} from './deal.dto';

export { 
  DealWithCommissionResponseDto
} from './api-responses';

export { 
  CommissionFiltersDto
} from './commission.dto';

export type { 
  CommissionResponse, 
  CommissionSummaryResponse, 
  CommissionByUserResponse 
} from './commission.dto';

export { 
  KpiFiltersDto
} from './kpi.dto';

export type { 
  KpiDashboardResponse 
} from './kpi.dto';

export { 
  CreateCalendarSlotDto, 
  UpdateCalendarSlotDto
} from './calendar.dto';

export type { 
  CalendarSlotResponse 
} from './calendar.dto';

export type { 
  PlanResponse, 
  SubscriptionResponse, 
  BillingPortalResponse, 
  CheckoutSessionResponse 
} from './billing.dto';

export type { 
  AuditLogResponse, 
  AuditFiltersDto 
} from './audit.dto'; 