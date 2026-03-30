import { ExecutionContext, Injectable } from '@nestjs/common'
import { ThrottlerGuard } from '@nestjs/throttler'

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, unknown>): Promise<string> {
    const request = req as { ip?: string; user?: { sub?: string } }
    return request.user?.sub ?? request.ip ?? 'unknown'
  }

  protected errorMessage = 'Too many requests — please slow down'

  getRequestResponse(context: ExecutionContext): {
    req: Record<string, unknown>
    res: Record<string, unknown>
  } {
    const http = context.switchToHttp()
    return { req: http.getRequest(), res: http.getResponse() }
  }
}
