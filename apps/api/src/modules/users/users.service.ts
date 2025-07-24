import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, UserResponse, UserProfileResponse } from '@b2b-saas/dtos';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto, organizationId: string): Promise<UserResponse> {
    const passwordHash = await bcrypt.hash(createUserDto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        passwordHash,
        organizationId,
      },
    });

    return this.mapToUserResponse(user);
  }

  async findAll(organizationId: string): Promise<UserResponse[]> {
    const users = await this.prisma.user.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });

    return users.map(user => this.mapToUserResponse(user));
  }

  async findOne(id: string, organizationId: string): Promise<UserResponse> {
    const user = await this.prisma.user.findFirst({
      where: { id, organizationId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.mapToUserResponse(user);
  }

  async findProfile(id: string, organizationId: string): Promise<UserProfileResponse> {
    const user = await this.prisma.user.findFirst({
      where: { id, organizationId },
      include: { organization: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      ...this.mapToUserResponse(user),
      organization: {
        id: user.organization.id,
        name: user.organization.name,
      },
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto, organizationId: string, currentUserId: string): Promise<UserResponse> {
    // Users can only update their own profile, or admins can update any user
    const currentUser = await this.prisma.user.findUnique({
      where: { id: currentUserId },
    });

    if (currentUser.role !== 'ADMIN' && currentUserId !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }

    const user = await this.prisma.user.findFirst({
      where: { id, organizationId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    return this.mapToUserResponse(updatedUser);
  }

  async remove(id: string, organizationId: string, currentUserId: string): Promise<void> {
    // Users cannot delete themselves
    if (currentUserId === id) {
      throw new ForbiddenException('You cannot delete your own account');
    }

    const user = await this.prisma.user.findFirst({
      where: { id, organizationId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: { id },
    });
  }

  private mapToUserResponse(user: any): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
} 