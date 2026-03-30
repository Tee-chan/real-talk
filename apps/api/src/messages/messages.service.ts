import { ForbiddenException, Injectable, Logger } from '@nestjs/common'
import { prisma } from '@realtalk/database'
import type { Message } from '@realtalk/types'
import type { GetMessagesDto } from './dto/get-messages.dto'
import type { SendMessageDto } from './dto/send-message.dto'

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name)

  // Cursor-based pagination — no offset, production-safe
  async getMessages(dto: GetMessagesDto, userId: string): Promise<{ messages: Message[]; nextCursor: string | null }> {
    const limit = dto.limit ?? 30

    const member = await prisma.channelMember.findUnique({
      where: { userId_channelId: { userId, channelId: dto.channelId } },
    })
    if (!member) throw new ForbiddenException('You are not a member of this channel')

    const messages = await prisma.message.findMany({
      where: {
        channelId: dto.channelId,
        ...(dto.cursor ? { createdAt: { lt: new Date(dto.cursor) } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      include: {
        sender: { select: { id: true, username: true, avatar: true, email: true } },
      },
    })

    const hasMore = messages.length > limit
    if (hasMore) messages.pop()

    const nextCursor =
      hasMore && messages.length > 0
        ? messages[messages.length - 1]!.createdAt.toISOString()
        : null

    return { messages: messages.reverse() as unknown as Message[], nextCursor }
  }

  async create(dto: SendMessageDto, senderId: string): Promise<Message> {
    const member = await prisma.channelMember.findUnique({
      where: { userId_channelId: { userId: senderId, channelId: dto.channelId } },
    })
    if (!member) throw new ForbiddenException('You are not a member of this channel')

    const message = await prisma.message.create({
      data: {
        content: dto.content,
        senderId,
        channelId: dto.channelId,
        clientMessageId: dto.clientMessageId,
      },
      include: {
        sender: { select: { id: true, username: true, avatar: true, email: true } },
      },
    })

    this.logger.log(`Message created in channel ${dto.channelId} by user ${senderId}`)
    return message as unknown as Message
  }
}
