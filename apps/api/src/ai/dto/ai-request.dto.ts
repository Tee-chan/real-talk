import { IsString, IsUUID } from 'class-validator'

export class AiSummarizeDto {
  @IsUUID()
  channelId!: string
}

export class AiSmartReplyDto {
  @IsString()
  context!: string
}
