import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { prisma } from '@realtalk/database'
import type { Channel } from '@realtalk/types'
import type { CreateChannelDto } from './dto/create-channel.dto'
import type { UpdateChannelDto } from './dto/update-channel.dto'

@Injectable()
export class ChannelsService {
  async findAll(): Promise<Channel[]> {
    return prisma.channel.findMany({
      where: { isPrivate: false },
      orderBy: { createdAt: 'asc' },
    })
  }

  async findOne(id: string): Promise<Channel> {
    const channel = await prisma.channel.findUnique({ where: { id } })
    if (!channel) throw new NotFoundException('Channel not found')
    return channel
  }

  async create(dto: CreateChannelDto, userId: string): Promise<Channel> {
    const channel = await prisma.channel.create({
      data: {
        name: dto.name,
        description: dto.description,
        isPrivate: dto.isPrivate ?? false,
        members: { create: { userId, role: 'ADMIN' } },
      },
    })
    return channel
  }

  async join(channelId: string, userId: string): Promise<void> {
    const channel = await prisma.channel.findUnique({ where: { id: channelId } })
    if (!channel) throw new NotFoundException('Channel not found')
    if (channel.isPrivate) throw new ForbiddenException('Cannot join a private channel')

    await prisma.channelMember.upsert({
      where: { userId_channelId: { userId, channelId } },
      create: { userId, channelId, role: 'MEMBER' },
      update: {},
    })
  }

  async leave(channelId: string, userId: string): Promise<void> {
    await prisma.channelMember.deleteMany({ where: { userId, channelId } })
  }

  async update(id: string, dto: UpdateChannelDto, userId: string): Promise<Channel> {
    const member = await prisma.channelMember.findUnique({
      where: { userId_channelId: { userId, channelId: id } },
    })
    if (!member || member.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can update channels')
    }
    return prisma.channel.update({ where: { id }, data: dto })
  }

  async isMember(channelId: string, userId: string): Promise<boolean> {
    const member = await prisma.channelMember.findUnique({
      where: { userId_channelId: { userId, channelId } },
    })
    return !!member
  }
}
