import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCalendarSlotDto, UpdateCalendarSlotDto, CalendarSlotResponse } from '@b2b-saas/dtos';

@Injectable()
export class CalendarService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCalendarSlotDto: CreateCalendarSlotDto, userId: string): Promise<CalendarSlotResponse> {
    const slot = await this.prisma.calendarSlot.create({
      data: {
        ...createCalendarSlotDto,
        userId,
      },
    });

    return this.mapToCalendarSlotResponse(slot);
  }

  async findAll(userId: string): Promise<CalendarSlotResponse[]> {
    const slots = await this.prisma.calendarSlot.findMany({
      where: { userId },
      orderBy: { start: 'asc' },
    });

    return slots.map(slot => this.mapToCalendarSlotResponse(slot));
  }

  async findOne(id: string, userId: string): Promise<CalendarSlotResponse> {
    const slot = await this.prisma.calendarSlot.findFirst({
      where: { id, userId },
    });

    if (!slot) {
      throw new NotFoundException('Calendar slot not found');
    }

    return this.mapToCalendarSlotResponse(slot);
  }

  async update(id: string, updateCalendarSlotDto: UpdateCalendarSlotDto, userId: string): Promise<CalendarSlotResponse> {
    const slot = await this.prisma.calendarSlot.findFirst({
      where: { id, userId },
    });

    if (!slot) {
      throw new NotFoundException('Calendar slot not found');
    }

    const updatedSlot = await this.prisma.calendarSlot.update({
      where: { id },
      data: updateCalendarSlotDto,
    });

    return this.mapToCalendarSlotResponse(updatedSlot);
  }

  async remove(id: string, userId: string): Promise<void> {
    const slot = await this.prisma.calendarSlot.findFirst({
      where: { id, userId },
    });

    if (!slot) {
      throw new NotFoundException('Calendar slot not found');
    }

    await this.prisma.calendarSlot.delete({
      where: { id },
    });
  }

  private mapToCalendarSlotResponse(slot: any): CalendarSlotResponse {
    return {
      id: slot.id,
      userId: slot.userId,
      start: slot.start.toISOString(),
      end: slot.end.toISOString(),
      isBooked: slot.isBooked,
      title: slot.title,
      description: slot.description,
      createdAt: slot.createdAt.toISOString(),
      updatedAt: slot.updatedAt.toISOString(),
    };
  }
} 