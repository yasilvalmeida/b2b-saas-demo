import { z } from 'zod';
import { PlanKey, SubscriptionStatus } from '../common';

// Zod schemas
export const CreateCheckoutSessionSchema = z.object({
  planKey: z.nativeEnum(PlanKey),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

export const CreatePortalSessionSchema = z.object({
  returnUrl: z.string().url(),
});

// Response types
export interface PlanResponse {
  id: string;
  key: PlanKey;
  name: string;
  description: string;
  maxDeals: number;
  maxUsers: number;
  priceMonthly: number;
  features: string[];
}

export interface SubscriptionResponse {
  id: string;
  planId: string;
  plan: PlanResponse;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export interface BillingPortalResponse {
  url: string;
}

export interface CheckoutSessionResponse {
  url: string;
  sessionId: string;
}

// Types
export type CreateCheckoutSessionRequest = z.infer<
  typeof CreateCheckoutSessionSchema
>;
export type CreatePortalSessionRequest = z.infer<
  typeof CreatePortalSessionSchema
>;
