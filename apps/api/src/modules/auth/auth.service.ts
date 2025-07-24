import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { AuthResponse, JwtPayload } from '@b2b-saas/dtos';
import { LoginDto, RegisterDto } from '@b2b-saas/dtos';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { organization: true },
    });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

    // Log the login action
    await this.prisma.auditLog.create({
      data: {
        organizationId: user.organizationId,
        userId: user.id,
        action: 'USER_LOGGED_IN',
        entity: 'User',
        entityId: user.id,
        meta: { email: user.email },
      },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
      },
      accessToken,
      refreshToken,
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create organization
    const organization = await this.prisma.organization.create({
      data: {
        name: registerDto.organizationName,
      },
    });

    // Hash password
    const passwordHash = await bcrypt.hash(registerDto.password, 12);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        name: registerDto.name,
        email: registerDto.email,
        passwordHash,
        role: 'ADMIN', // First user is admin
        organizationId: organization.id,
      },
      include: { organization: true },
    });

    // Create default subscription (FREE plan)
    const freePlan = await this.prisma.plan.findUnique({
      where: { key: 'FREE' },
    });

    if (freePlan) {
      await this.prisma.subscription.create({
        data: {
          organizationId: organization.id,
          planId: freePlan.id,
          status: 'ACTIVE',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      });
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

    // Log the registration
    await this.prisma.auditLog.create({
      data: {
        organizationId: user.organizationId,
        userId: user.id,
        action: 'USER_CREATED',
        entity: 'User',
        entityId: user.id,
        meta: { email: user.email, organizationName: organization.name },
      },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const accessToken = this.jwtService.sign({
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
        organizationId: payload.organizationId,
      });

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
} 