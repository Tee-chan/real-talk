import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import type { Socket } from 'socket.io'
import type { JwtPayload } from '@realtalk/types'

@Injectable()
export class WsJwtGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtGuard.name)

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient<Socket>()
    const token =
      (client.handshake.auth as Record<string, string>)?.token ??
      client.handshake.headers?.authorization?.replace('Bearer ', '')

    if (!token) {
      this.logger.warn(`Client ${client.id} attempted connection without token`)
      throw new UnauthorizedException('No token provided')
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      })
      // Attach user to socket data for use in gateway handlers
      client.data = { user: payload }
      return true
    } catch {
      throw new UnauthorizedException('Invalid or expired token')
    }
  }
}
