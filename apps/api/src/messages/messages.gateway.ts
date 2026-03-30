import { Logger, UseFilters, UseGuards } from '@nestjs/common'
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import type { JwtPayload } from '@realtalk/types'

import { WsJwtGuard } from '../auth/guards/ws-jwt.guard'
import { WsExceptionFilter } from '../common/filters/ws-exception.filter'
import { PresenceService } from '../presence/presence.service'
import { SendMessageDto } from './dto/send-message.dto'
import { MessagesService } from './messages.service'

@UseFilters(WsExceptionFilter)
@UseGuards(WsJwtGuard)
@WebSocketGateway({ cors: { origin: process.env.ALLOWED_ORIGINS?.split(','), credentials: true } })
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
@WebSocketServer()
server!: Server

  private readonly logger = new Logger(MessagesGateway.name)

  constructor(
    private readonly messagesService: MessagesService,
    private readonly presenceService: PresenceService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    const user = client.data?.user as JwtPayload | undefined
    if (!user) {
      client.disconnect()
      return
    }
    await this.presenceService.setOnline(user.sub)
    this.server.emit('presence:update', { userId: user.sub, status: 'online' })
    this.logger.log(`Client connected: ${client.id} (user: ${user.sub})`)
  }

  async handleDisconnect(client: Socket): Promise<void> {
    const user = client.data?.user as JwtPayload | undefined
    if (user) {
      await this.presenceService.setOffline(user.sub)
      this.server.emit('presence:update', { userId: user.sub, status: 'offline' })
    }
    this.logger.log(`Client disconnected: ${client.id}`)
  }

  @SubscribeMessage('channel:join')
  async handleJoinChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() channelId: string,
  ): Promise<void> {
    await client.join(channelId)
    this.logger.log(`Client ${client.id} joined channel ${channelId}`)
  }

  @SubscribeMessage('channel:leave')
  async handleLeaveChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() channelId: string,
  ): Promise<void> {
    await client.leave(channelId)
  }

  @SubscribeMessage('message:send')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: SendMessageDto,
  ): Promise<void> {
    const user = client.data.user as JwtPayload
    const message = await this.messagesService.create(dto, user.sub)
    // Emit to everyone in the channel room including sender
    this.server.to(dto.channelId).emit('message:new', message)
  }

  @SubscribeMessage('typing:start')
  handleTypingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() channelId: string,
  ): void {
    const user = client.data.user as JwtPayload
    client.to(channelId).emit('typing:start', { channelId, userId: user.sub })
  }

  @SubscribeMessage('typing:stop')
  handleTypingStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() channelId: string,
  ): void {
    const user = client.data.user as JwtPayload
    client.to(channelId).emit('typing:stop', { channelId, userId: user.sub })
  }
}
