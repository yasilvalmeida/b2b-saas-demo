import { z } from 'zod';

// Zod schemas
export const CreateCalendarSlotSchema = z.object({
  start: z.string().datetime(),
  end: z.string().datetime(),
  title: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  isAvailable: z.boolean().default(true),
});

export const UpdateCalendarSlotSchema = z.object({
  start: z.string().datetime().optional(),
  end: z.string().datetime().optional(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional(),
  isAvailable: z.boolean().optional(),
});

// Response types
export interface CalendarSlotResponse {
  id: string;
  userId: string;
  start: string;
  end: string;
  title: string;
  description?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

// Types
export type CreateCalendarSlotRequest = z.infer<
  typeof CreateCalendarSlotSchema
>;
export type UpdateCalendarSlotRequest = z.infer<
  typeof UpdateCalendarSlotSchema
>;
