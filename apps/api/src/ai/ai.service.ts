import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectQueue } from '@nestjs/bull'
import type { Queue } from 'bull'
import { prisma } from '@realtalk/database'
import { GeminiProvider } from './providers/gemini.provider'
import { OpenAiProvider } from './providers/openai.provider'

export const AI_QUEUE = 'ai'
export type AiJob = { type: 'summarize'; channelId: string; requestedBy: string }

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name)

  constructor(
    private readonly config: ConfigService,
    private readonly openai: OpenAiProvider,
    private readonly gemini: GeminiProvider,
    @InjectQueue(AI_QUEUE) private readonly aiQueue: Queue<AiJob>,
  ) {}

  async enqueueSummarize(channelId: string, requestedBy: string): Promise<{ jobId: string }> {
    const job = await this.aiQueue.add({ type: 'summarize', channelId, requestedBy })
    return { jobId: String(job.id) }
  }

  async summarize(channelId: string): Promise<string> {
    const messages = await prisma.message.findMany({
      where: { channelId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { sender: { select: { username: true } } },
    })

    const text = messages
      .reverse()
      .map((m) => `${m.sender.username}: ${m.content}`)
      .join('\n')

    const provider = this.config.get('AI_PROVIDER') === 'gemini' ? this.gemini : this.openai
    const summary = await provider.summarize(text)

    this.logger.log(`Summarized channel ${channelId}`)
    return summary
  }

  async smartReply(context: string): Promise<string[]> {
    const provider = this.config.get('AI_PROVIDER') === 'gemini' ? this.gemini : this.openai
    return provider.smartReply(context)
  }
}
