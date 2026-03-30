import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { PresenceModule } from '../presence/presence.module'
import { MessagesController } from './messages.controller'
import { MessagesGateway } from './messages.gateway'
import { MessagesService } from './messages.service'

@Module({
  imports: [AuthModule, PresenceModule],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesGateway],
})
export class MessagesModule {}
