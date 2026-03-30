import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import type { Job } from 'bull'
import { AI_QUEUE, AiService, type AiJob } from '../ai.service'

@Processor(AI_QUEUE)
export class AiProcessor {
  private readonly logger = new Logger(AiProcessor.name)

  constructor(private readonly aiService: AiService) {}

  @Process()
  async handle(job: Job<AiJob>): Promise<void> {
    this.logger.log(`Processing AI job ${job.id} — type: ${job.data.type}`)
    if (job.data.type === 'summarize') {
      await this.aiService.summarize(job.data.channelId)
    }
  }
}
