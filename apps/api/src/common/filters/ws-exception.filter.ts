import { ArgumentsHost, Catch, Logger } from '@nestjs/common'
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets'
import type { Socket } from 'socket.io'

@Catch(WsException)
export class WsExceptionFilter extends BaseWsExceptionFilter {
  private readonly logger = new Logger(WsExceptionFilter.name)

  catch(exception: WsException, host: ArgumentsHost): void {
    const client = host.switchToWs().getClient<Socket>()
    const message = exception.getError()

    this.logger.error(`WebSocket error for client ${client.id}: ${JSON.stringify(message)}`)

    client.emit('error', {
      message: typeof message === 'string' ? message : 'An error occurred',
      code: 'WS_ERROR',
    })
  }
}
