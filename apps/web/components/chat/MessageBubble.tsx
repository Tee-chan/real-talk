'use client'
import type { Message } from '@realtalk/types'
import { Avatar } from '@/components/ui'
import { formatTime } from '@/lib/utils'

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
}

export const MessageBubble = ({ message, isOwn }: MessageBubbleProps) => {
  return (
    <div className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isOwn && message.sender && (
        <Avatar username={message.sender.username} src={message.sender.avatar} size="sm" />
      )}
      <div className={`flex max-w-[70%] flex-col gap-1 ${isOwn ? 'items-end' : 'items-start'}`}>
        {!isOwn && message.sender && (
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {message.sender.username}
          </span>
        )}
        <div
          className={`rounded-2xl px-4 py-2 text-sm ${
            isOwn
              ? 'rounded-br-sm bg-brand-600 text-white'
              : 'rounded-bl-sm bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
          }`}
        >
          {message.content}
        </div>
        <span className="text-[11px] text-gray-400">{formatTime(message.createdAt)}</span>
      </div>
    </div>
  )
}
