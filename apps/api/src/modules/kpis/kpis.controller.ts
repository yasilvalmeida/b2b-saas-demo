import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { KpisService } from './kpis.service';
import { KpiFiltersDto, KpiDashboardResponseDto } from '@b2b-saas/dtos';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('kpis')
@Controller('kpis')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class KpisController {
  constructor(private readonly kpisService: KpisService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard KPIs' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard KPIs',
         type: KpiDashboardResponseDto,
  })
  async getDashboard(@Query() filters: KpiFiltersDto, @Request() req) {
    return this.kpisService.getDashboard(req.user.organizationId, filters);
  }
}
