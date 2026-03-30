import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import OpenAI from 'openai'

@Injectable()
export class OpenAiProvider {
  private readonly client: OpenAI
  private readonly logger = new Logger(OpenAiProvider.name)

  constructor(private readonly config: ConfigService) {
    this.client = new OpenAI({ apiKey: this.config.get<string>('OPENAI_API_KEY') })
  }

  async summarize(text: string): Promise<string> {
    this.logger.log('Summarizing with OpenAI')
    const res = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Summarize the following chat conversation in 2-3 sentences.' },
        { role: 'user', content: text },
      ],
      max_tokens: 200,
    })
    return res.choices[0]?.message?.content ?? ''
  }

  async smartReply(context: string): Promise<string[]> {
    const res = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Given this chat context, suggest 3 short reply options. Return as JSON array of strings.',
        },
        { role: 'user', content: context },
      ],
      max_tokens: 150,
      response_format: { type: 'json_object' },
    })
    const raw = res.choices[0]?.message?.content ?? '{"replies":[]}'
    const parsed = JSON.parse(raw) as { replies?: string[] }
    return parsed.replies ?? []
  }
}
