import { z } from 'zod';
import { AuditAction } from '../common';

// Zod schemas
export const AuditFiltersSchema = z.object({
  action: z.nativeEnum(AuditAction).optional(),
  entity: z.string().optional(),
  userId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// Response types
export interface AuditLogResponse {
  id: string;
  action: AuditAction;
  entity: string;
  entityId: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  meta: Record<string, any>;
  createdAt: string;
}

// Types
export type AuditFiltersRequest = z.infer<typeof AuditFiltersSchema>;
