import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DealsService } from './deals.service';
import { CreateDealDto, UpdateDealDto, ChangeDealStageDto, DealFiltersDto, DealResponse, DealWithCommissionResponse } from '@b2b-saas/dtos';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('deals')
@Controller('deals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new deal' })
  @ApiResponse({ status: 201, description: 'Deal created successfully', type: DealResponse })
  async create(@Body() createDealDto: CreateDealDto, @Request() req) {
    return this.dealsService.create(createDealDto, req.user.organizationId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all deals with optional filters' })
  @ApiResponse({ status: 200, description: 'List of deals', type: [DealResponse] })
  async findAll(@Query() filters: DealFiltersDto, @Request() req) {
    return this.dealsService.findAll(req.user.organizationId, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get deal by ID' })
  @ApiResponse({ status: 200, description: 'Deal details', type: DealWithCommissionResponse })
  @ApiResponse({ status: 404, description: 'Deal not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.dealsService.findOne(id, req.user.organizationId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update deal' })
  @ApiResponse({ status: 200, description: 'Deal updated successfully', type: DealResponse })
  @ApiResponse({ status: 404, description: 'Deal not found' })
  async update(@Param('id') id: string, @Body() updateDealDto: UpdateDealDto, @Request() req) {
    return this.dealsService.update(id, updateDealDto, req.user.organizationId);
  }

  @Patch(':id/stage')
  @ApiOperation({ summary: 'Change deal stage' })
  @ApiResponse({ status: 200, description: 'Deal stage changed successfully', type: DealResponse })
  @ApiResponse({ status: 404, description: 'Deal not found' })
  @ApiResponse({ status: 400, description: 'Invalid stage transition' })
  async changeStage(@Param('id') id: string, @Body() changeStageDto: ChangeDealStageDto, @Request() req) {
    return this.dealsService.changeStage(id, changeStageDto, req.user.organizationId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete deal' })
  @ApiResponse({ status: 200, description: 'Deal deleted successfully' })
  @ApiResponse({ status: 404, description: 'Deal not found' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.dealsService.remove(id, req.user.organizationId);
  }
} 