import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class CreateChannelDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name!: string

  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean
}
