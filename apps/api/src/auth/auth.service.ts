import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { compare, hash } from 'bcryptjs'
import { createHash, randomBytes } from 'crypto'
import type { Response } from 'express'
import { prisma } from '@realtalk/database'
import type { JwtPayload } from '@realtalk/types'

import type { LoginDto } from './dto/login.dto'
import type { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<{ accessToken: string }> {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { username: dto.username }] },
    })
    if (existing) {
      throw new ConflictException(
        existing.email === dto.email ? 'Email already in use' : 'Username already taken',
      )
    }

    const passwordHash = await hash(dto.password, 12)
    const user = await prisma.user.create({
      data: { email: dto.email, username: dto.username, passwordHash },
    })

    this.logger.log(`New user registered: ${user.email}`)
    return this.generateTokens({ sub: user.id, email: user.email })
  }

  async login(dto: LoginDto, res: Response): Promise<{ accessToken: string }> {
    const user = await prisma.user.findUnique({ where: { email: dto.email } })
    if (!user) throw new UnauthorizedException('Invalid credentials')

    const passwordValid = await compare(dto.password, user.passwordHash)
    if (!passwordValid) throw new UnauthorizedException('Invalid credentials')

    const tokens = await this.generateTokens({ sub: user.id, email: user.email })
    await this.setRefreshTokenCookie(user.id, res)

    this.logger.log(`User logged in: ${user.email}`)
    return { accessToken: tokens.accessToken }
  }

  async refresh(userId: string, rawRefreshToken: string, res: Response): Promise<{ accessToken: string }> {
    const tokenHash = this.hashToken(rawRefreshToken)
    const stored = await prisma.refreshToken.findFirst({
      where: { userId, tokenHash, expiresAt: { gt: new Date() } },
    })
    if (!stored) throw new UnauthorizedException('Refresh token invalid or expired')

    // Rotate — delete old, issue new
    await prisma.refreshToken.delete({ where: { id: stored.id } })

    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } })
    const tokens = await this.generateTokens({ sub: user.id, email: user.email })
    await this.setRefreshTokenCookie(userId, res)

    return { accessToken: tokens.accessToken }
  }

  async logout(userId: string, rawRefreshToken: string, res: Response): Promise<void> {
    const tokenHash = this.hashToken(rawRefreshToken)
    await prisma.refreshToken.deleteMany({ where: { userId, tokenHash } })
    res.clearCookie('refresh_token')
  }

  private async generateTokens(payload: JwtPayload): Promise<{ accessToken: string }> {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.getOrThrow('JWT_ACCESS_SECRET'),
      expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN', '15m'),
    })
    return { accessToken }
  }

  private async setRefreshTokenCookie(userId: string, res: Response): Promise<void> {
    const rawToken = randomBytes(64).toString('hex')
    const tokenHash = this.hashToken(rawToken)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    await prisma.refreshToken.create({ data: { userId, tokenHash, expiresAt } })

    res.cookie('refresh_token', rawToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/api/auth/refresh',
    })
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex')
  }
}
