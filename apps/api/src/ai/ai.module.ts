import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { AiService, AI_QUEUE } from './ai.service'
import { AiProcessor } from './processors/ai.processor'
import { GeminiProvider } from './providers/gemini.provider'
import { OpenAiProvider } from './providers/openai.provider'

@Module({
  imports: [
    BullModule.registerQueue({ name: AI_QUEUE }),
  ],
  providers: [AiService, AiProcessor, OpenAiProvider, GeminiProvider],
  exports: [AiService],
})
export class AiModule {}
