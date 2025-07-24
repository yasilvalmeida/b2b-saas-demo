import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { 
  CreateDealDto, 
  UpdateDealDto, 
  ChangeDealStageDto, 
  DealFiltersDto,
  DealResponse, 
  DealWithCommissionResponse,
  DealStage 
} from '@b2b-saas/dtos';

@Injectable()
export class DealsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDealDto: CreateDealDto, organizationId: string): Promise<DealResponse> {
    const deal = await this.prisma.deal.create({
      data: {
        ...createDealDto,
        organizationId,
      },
    });

    return this.mapToDealResponse(deal);
  }

  async findAll(organizationId: string, filters?: DealFiltersDto): Promise<DealResponse[]> {
    const where: any = { organizationId };

    if (filters?.stage) {
      where.stage = filters.stage;
    }

    if (filters?.minAmount || filters?.maxAmount) {
      where.amount = {};
      if (filters.minAmount) where.amount.gte = filters.minAmount;
      if (filters.maxAmount) where.amount.lte = filters.maxAmount;
    }

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
      if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
    }

    const deals = await this.prisma.deal.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return deals.map(deal => this.mapToDealResponse(deal));
  }

  async findOne(id: string, organizationId: string): Promise<DealWithCommissionResponse> {
    const deal = await this.prisma.deal.findFirst({
      where: { id, organizationId },
      include: {
        commissions: true,
      },
    });

    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    const commissionAmount = deal.commissions.reduce((sum, commission) => sum + commission.amount, 0);
    const isClosed = deal.stage === DealStage.CLOSED;

    return {
      ...this.mapToDealResponse(deal),
      commissionAmount,
      isClosed,
    };
  }

  async update(id: string, updateDealDto: UpdateDealDto, organizationId: string): Promise<DealResponse> {
    const deal = await this.prisma.deal.findFirst({
      where: { id, organizationId },
    });

    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    const updatedDeal = await this.prisma.deal.update({
      where: { id },
      data: updateDealDto,
    });

    return this.mapToDealResponse(updatedDeal);
  }

  async changeStage(id: string, changeStageDto: ChangeDealStageDto, organizationId: string): Promise<DealResponse> {
    const deal = await this.prisma.deal.findFirst({
      where: { id, organizationId },
    });

    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    // Validate stage transition
    this.validateStageTransition(deal.stage, changeStageDto.stage);

    const updateData: any = { stage: changeStageDto.stage };
    
    // If moving to CLOSED stage, set closeDate if not provided
    if (changeStageDto.stage === DealStage.CLOSED && !changeStageDto.closeDate) {
      updateData.closeDate = new Date();
    } else if (changeStageDto.closeDate) {
      updateData.closeDate = new Date(changeStageDto.closeDate);
    }

    const updatedDeal = await this.prisma.deal.update({
      where: { id },
      data: updateData,
    });

    // Calculate commission if deal is closed
    if (changeStageDto.stage === DealStage.CLOSED) {
      await this.calculateCommission(updatedDeal);
    }

    return this.mapToDealResponse(updatedDeal);
  }

  async remove(id: string, organizationId: string): Promise<void> {
    const deal = await this.prisma.deal.findFirst({
      where: { id, organizationId },
    });

    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    await this.prisma.deal.delete({
      where: { id },
    });
  }

  private validateStageTransition(currentStage: DealStage, newStage: DealStage): void {
    const validTransitions = {
      [DealStage.PROSPECT]: [DealStage.ACTIVE, DealStage.LOST],
      [DealStage.ACTIVE]: [DealStage.CLOSED, DealStage.LOST],
      [DealStage.CLOSED]: [],
      [DealStage.LOST]: [],
    };

    if (!validTransitions[currentStage].includes(newStage)) {
      throw new BadRequestException(`Invalid stage transition from ${currentStage} to ${newStage}`);
    }
  }

  private async calculateCommission(deal: any): Promise<void> {
    const commissionAmount = (deal.amount * deal.commissionRate) / 100;

    // For demo purposes, assign commission to the first user in the organization
    const user = await this.prisma.user.findFirst({
      where: { organizationId: deal.organizationId },
    });

    if (user) {
      await this.prisma.commissionEntry.create({
        data: {
          dealId: deal.id,
          userId: user.id,
          amount: commissionAmount,
        },
      });
    }
  }

  private mapToDealResponse(deal: any): DealResponse {
    return {
      id: deal.id,
      title: deal.title,
      amount: deal.amount,
      stage: deal.stage,
      commissionRate: deal.commissionRate,
      closeDate: deal.closeDate?.toISOString(),
      description: deal.description,
      organizationId: deal.organizationId,
      createdAt: deal.createdAt.toISOString(),
      updatedAt: deal.updatedAt.toISOString(),
    };
  }
} 