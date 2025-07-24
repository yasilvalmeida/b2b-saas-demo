import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CalendarService } from './calendar.service';
import {
  CreateCalendarSlotDto,
  UpdateCalendarSlotDto,
  CalendarSlotResponseDto,
} from '@b2b-saas/dtos';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('calendar')
@Controller('calendar')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post()
  @ApiOperation({ summary: 'Create calendar slot' })
     @ApiResponse({
     status: 201,
     description: 'Calendar slot created successfully',
     type: CalendarSlotResponseDto,
   })
  async create(
    @Body() createCalendarSlotDto: CreateCalendarSlotDto,
    @Request() req
  ) {
    return this.calendarService.create(createCalendarSlotDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all calendar slots' })
     @ApiResponse({
     status: 200,
     description: 'List of calendar slots',
     type: [CalendarSlotResponseDto],
   })
  async findAll(@Request() req) {
    return this.calendarService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get calendar slot by ID' })
     @ApiResponse({
     status: 200,
     description: 'Calendar slot details',
     type: CalendarSlotResponseDto,
   })
  @ApiResponse({ status: 404, description: 'Calendar slot not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.calendarService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update calendar slot' })
     @ApiResponse({
     status: 200,
     description: 'Calendar slot updated successfully',
     type: CalendarSlotResponseDto,
   })
  @ApiResponse({ status: 404, description: 'Calendar slot not found' })
  async update(
    @Param('id') id: string,
    @Body() updateCalendarSlotDto: UpdateCalendarSlotDto,
    @Request() req
  ) {
    return this.calendarService.update(id, updateCalendarSlotDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete calendar slot' })
  @ApiResponse({
    status: 200,
    description: 'Calendar slot deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Calendar slot not found' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.calendarService.remove(id, req.user.id);
  }
}
