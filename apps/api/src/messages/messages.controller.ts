import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import type { JwtPayload } from '@realtalk/types'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { GetMessagesDto } from './dto/get-messages.dto'
import { MessagesService } from './messages.service'

@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  getMessages(@Query() dto: GetMessagesDto, @CurrentUser() user: JwtPayload) {
    return this.messagesService.getMessages(dto, user.sub)
  }
}
