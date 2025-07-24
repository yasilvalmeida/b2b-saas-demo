import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateOrganizationDto, OrganizationResponse } from '@b2b-saas/dtos';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string): Promise<OrganizationResponse> {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return {
      id: organization.id,
      name: organization.name,
      createdAt: organization.createdAt.toISOString(),
      updatedAt: organization.updatedAt.toISOString(),
    };
  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto): Promise<OrganizationResponse> {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const updatedOrganization = await this.prisma.organization.update({
      where: { id },
      data: updateOrganizationDto,
    });

    return {
      id: updatedOrganization.id,
      name: updatedOrganization.name,
      createdAt: updatedOrganization.createdAt.toISOString(),
      updatedAt: updatedOrganization.updatedAt.toISOString(),
    };
  }
} 