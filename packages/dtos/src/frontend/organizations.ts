import { z } from 'zod';

// Zod schemas
export const UpdateOrganizationSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional(),
  website: z.string().url().optional(),
  phone: z.string().optional(),
  address: z.string().max(200).optional(),
});

// Response types
export interface OrganizationResponse {
  id: string;
  name: string;
  description?: string;
  website?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

// Types
export type UpdateOrganizationRequest = z.infer<
  typeof UpdateOrganizationSchema
>;
