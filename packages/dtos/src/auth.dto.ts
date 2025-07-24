import { z } from 'zod';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { UserRole } from './common';

// Zod schemas
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const RegisterSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6),
  organizationName: z.string().min(2).max(100),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string(),
});

// Class-validator DTOs
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(2)
  organizationName: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}

// Response types
export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    organizationId: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  organizationId: string;
  iat?: number;
  exp?: number;
}

// Types
export type LoginRequest = z.infer<typeof LoginSchema>;
export type RegisterRequest = z.infer<typeof RegisterSchema>;
export type RefreshTokenRequest = z.infer<typeof RefreshTokenSchema>; 