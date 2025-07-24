import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CommissionsService } from './commissions.service';
import {
  CommissionFiltersDto,
  CommissionResponseDto,
  CommissionSummaryResponseDto,
  CommissionByUserResponseDto,
} from '@b2b-saas/dtos';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('commissions')
@Controller('commissions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CommissionsController {
  constructor(private readonly commissionsService: CommissionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all commissions with optional filters' })
  @ApiResponse({
    status: 200,
    description: 'List of commissions',
    type: [CommissionResponseDto],
  })
  async findAll(@Query() filters: CommissionFiltersDto, @Request() req) {
    return this.commissionsService.findAll(req.user.organizationId, filters);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get commission summary' })
  @ApiResponse({
    status: 200,
    description: 'Commission summary',
    type: CommissionSummaryResponseDto,
  })
  async getSummary(@Request() req) {
    return this.commissionsService.getSummary(req.user.organizationId);
  }

  @Get('by-user')
  @ApiOperation({ summary: 'Get commissions by user' })
  @ApiResponse({
    status: 200,
    description: 'Commissions by user',
         type: [CommissionByUserResponseDto],
  })
  async getByUser(@Request() req) {
    return this.commissionsService.getByUser(req.user.organizationId);
  }
}
