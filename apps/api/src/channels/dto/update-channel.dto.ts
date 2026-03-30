import { IsOptional, IsString, MaxLength } from 'class-validator'

export class UpdateChannelDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string
}
