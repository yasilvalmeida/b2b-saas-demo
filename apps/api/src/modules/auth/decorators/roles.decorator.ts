import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@b2b-saas/dtos';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles); 