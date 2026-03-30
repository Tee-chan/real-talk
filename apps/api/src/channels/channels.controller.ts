import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import type { JwtPayload } from '@realtalk/types'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { ChannelsService } from './channels.service'
import { CreateChannelDto } from './dto/create-channel.dto'
import { UpdateChannelDto } from './dto/update-channel.dto'

@UseGuards(JwtAuthGuard)
@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get()
  findAll() {
    return this.channelsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.channelsService.findOne(id)
  }

  @Post()
  create(@Body() dto: CreateChannelDto, @CurrentUser() user: JwtPayload) {
    return this.channelsService.create(dto, user.sub)
  }

  @Post(':id/join')
  join(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.channelsService.join(id, user.sub)
  }

  @Post(':id/leave')
  leave(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.channelsService.leave(id, user.sub)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateChannelDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.channelsService.update(id, dto, user.sub)
  }
}
