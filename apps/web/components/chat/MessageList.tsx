'use client'
import { useEffect, useRef } from 'react'
import type { Message } from '@realtalk/types'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'

interface MessageListProps {
  messages: Message[]
  currentUserId: string
  typingUsernames: string[]
  onScrollTop?: () => void
}

export const MessageList = ({
  messages,
  currentUserId,
  typingUsernames,
  onScrollTop,
}: MessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const handleScroll = () => {
    if (containerRef.current?.scrollTop === 0) {
      onScrollTop?.()
    }
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex flex-1 flex-col gap-3 overflow-y-auto p-4"
    >
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isOwn={message.senderId === currentUserId}
        />
      ))}
      <TypingIndicator usernames={typingUsernames} />
      <div ref={bottomRef} />
    </div>
  )
}
