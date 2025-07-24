import { z } from 'zod';
import { IsString, IsOptional, MinLength } from 'class-validator';

export const UpdateOrganizationSchema = z.object({
  name: z.string().min(2).max(100),
});

export class UpdateOrganizationDto {
  @IsString()
  @MinLength(2)
  name: string;
}

export interface OrganizationResponse {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type UpdateOrganizationRequest = z.infer<typeof UpdateOrganizationSchema>; 