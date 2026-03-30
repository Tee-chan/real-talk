import { Type } from 'class-transformer'
import { IsISO8601, IsOptional, IsUUID, Max, Min } from 'class-validator'

export class GetMessagesDto {
  @IsUUID()
  channelId!: string

  @IsOptional()
  @IsISO8601()
  cursor?: string

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(50)
  limit?: number
}