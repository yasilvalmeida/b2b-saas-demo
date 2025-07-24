import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BillingService } from './billing.service';

@ApiTags('billing')
@Controller('billing')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BillingController {
  constructor(private billingService: BillingService) {}

  @Get('subscription')
  @ApiOperation({ summary: 'Get current subscription' })
  @ApiResponse({ status: 200, description: 'Current subscription details' })
  async getSubscription(@Request() req) {
    return this.billingService.getSubscription(req.user.organizationId);
  }

  @Get('plans')
  @ApiOperation({ summary: 'Get available plans' })
  @ApiResponse({ status: 200, description: 'List of available plans' })
  async getPlans() {
    return this.billingService.getPlans();
  }
}
