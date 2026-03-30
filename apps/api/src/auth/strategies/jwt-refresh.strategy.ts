import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import type { Request } from 'express'
import { Strategy } from 'passport-jwt'
import type { JwtPayload } from '@realtalk/types'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: (req: Request) => {
        return (req.cookies as Record<string, string>)?.['refresh_token'] ?? null
      },
      secretOrKey: config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
      ignoreExpiration: false,
    })
  }

  validate(req: Request, payload: JwtPayload): JwtPayload & { refreshToken: string } {
    const refreshToken = (req.cookies as Record<string, string>)?.['refresh_token']
    if (!refreshToken) throw new UnauthorizedException('Refresh token missing')
    return { ...payload, refreshToken }
  }
}
