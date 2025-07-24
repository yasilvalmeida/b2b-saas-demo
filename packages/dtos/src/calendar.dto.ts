import { z } from 'zod';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export const CreateCalendarSlotSchema = z.object({
  start: z.string().datetime(),
  end: z.string().datetime(),
  isBooked: z.boolean().default(false),
  title: z.string().optional(),
  description: z.string().optional(),
});

export const UpdateCalendarSlotSchema = z.object({
  start: z.string().datetime().optional(),
  end: z.string().datetime().optional(),
  isBooked: z.boolean().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
});

export class CreateCalendarSlotDto {
  @IsString()
  start: string;

  @IsString()
  end: string;

  @IsBoolean()
  @IsOptional()
  isBooked?: boolean;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateCalendarSlotDto {
  @IsString()
  @IsOptional()
  start?: string;

  @IsString()
  @IsOptional()
  end?: string;

  @IsBoolean()
  @IsOptional()
  isBooked?: boolean;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export interface CalendarSlotResponse {
  id: string;
  userId: string;
  start: string;
  end: string;
  isBooked: boolean;
  title?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateCalendarSlotRequest = z.infer<typeof CreateCalendarSlotSchema>;
export type UpdateCalendarSlotRequest = z.infer<typeof UpdateCalendarSlotSchema>; 