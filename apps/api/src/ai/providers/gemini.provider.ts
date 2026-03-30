import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class GeminiProvider {
  private readonly logger = new Logger(GeminiProvider.name)
  private readonly apiKey: string

  constructor(private readonly config: ConfigService) {
    this.apiKey = this.config.get<string>('GEMINI_API_KEY') ?? ''
  }

  async summarize(text: string): Promise<string> {
    this.logger.log('Summarizing with Gemini')
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Summarize this chat in 2-3 sentences:\n\n${text}`,
                },
              ],
            },
          ],
        }),
      },
    )
    const data = (await res.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
    }
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  }

  async smartReply(context: string): Promise<string[]> {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Given this chat context, suggest 3 short reply options as a JSON array:\n\n${context}`,
                },
              ],
            },
          ],
        }),
      },
    )
    const data = (await res.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
    }
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]'
    try {
      return JSON.parse(raw) as string[]
    } catch {
      return []
    }
  }
}
