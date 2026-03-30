import { Inject, Injectable, Logger } from '@nestjs/common'
import Redis from 'ioredis'
import { REDIS_CLIENT } from '../redis/redis.module'

const ONLINE_TTL = 35 // seconds — slightly more than heartbeat interval (30s)
const ONLINE_KEY = (userId: string) => `presence:${userId}`

@Injectable()
export class PresenceService {
  private readonly logger = new Logger(PresenceService.name)

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async setOnline(userId: string): Promise<void> {
    await this.redis.set(ONLINE_KEY(userId), '1', 'EX', ONLINE_TTL)
    this.logger.debug(`User ${userId} is online`)
  }

  async setOffline(userId: string): Promise<void> {
    await this.redis.del(ONLINE_KEY(userId))
    this.logger.debug(`User ${userId} is offline`)
  }

  async isOnline(userId: string): Promise<boolean> {
    const result = await this.redis.exists(ONLINE_KEY(userId))
    return result === 1
  }

  async getOnlineUsers(userIds: string[]): Promise<Record<string, boolean>> {
    if (userIds.length === 0) return {}
    const pipeline = this.redis.pipeline()
    userIds.forEach((id) => pipeline.exists(ONLINE_KEY(id)))
    const results = await pipeline.exec()
    return Object.fromEntries(
      userIds.map((id, i) => [id, (results?.[i]?.[1] as number) === 1]),
    )
  }
}
