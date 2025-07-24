import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { UpdateOrganizationDto, OrganizationResponse } from '@b2b-saas/dtos';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('organizations')
@Controller('organizations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get organization profile' })
  @ApiResponse({ status: 200, description: 'Organization profile', type: OrganizationResponse })
  async getProfile(@Request() req) {
    return this.organizationsService.findOne(req.user.organizationId);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update organization profile' })
  @ApiResponse({ status: 200, description: 'Organization updated successfully', type: OrganizationResponse })
  async updateProfile(@Body() updateOrganizationDto: UpdateOrganizationDto, @Request() req) {
    return this.organizationsService.update(req.user.organizationId, updateOrganizationDto);
  }
} 