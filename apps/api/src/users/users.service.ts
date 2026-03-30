import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma } from '@realtalk/database'
import type { PublicUser } from '@realtalk/types'
import type { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
  async findById(id: string): Promise<PublicUser> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, username: true, avatar: true },
    })
    if (!user) throw new NotFoundException('User not found')
    return user
  }

  async update(id: string, dto: UpdateUserDto): Promise<PublicUser> {
    return prisma.user.update({
      where: { id },
      data: dto,
      select: { id: true, email: true, username: true, avatar: true },
    })
  }
}
