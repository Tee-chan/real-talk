import { Module } from '@nestjs/common'
import { ThrottlerModule } from '@nestjs/throttler'
import { AiModule } from './ai/ai.module'
import { AuthModule } from './auth/auth.module'
import { ChannelsModule } from './channels/channels.module'
import { ConfigModule } from './config/config.module'
import { HealthModule } from './health/health.module'
import { MessagesModule } from './messages/messages.module'
import { PresenceModule } from './presence/presence.module'
import { RedisModule } from './redis/redis.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    ConfigModule,
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    RedisModule,
    AuthModule,
    UsersModule,
    ChannelsModule,
    MessagesModule,
    PresenceModule,
    AiModule,
    HealthModule,
  ],
})
export class AppModule {}
