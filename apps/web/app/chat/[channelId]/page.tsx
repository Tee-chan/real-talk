'use client'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { v4 as uuid } from 'uuid'
import type { Message } from '@realtalk/types'
import { MessageList } from '@/components/chat/MessageList'
import { MessageInput } from '@/components/chat/MessageInput'
import { useMessages } from '@/hooks/useMessages'
import { useMe } from '@/hooks/useAuth'
import { useSocketContext } from '@/components/providers/SocketProvider'

export default function ChannelPage() {
  
  const { channelId } = useParams<{ channelId: string }>()
  const { data: me } = useMe()
  const socket = useSocketContext()
  const [realtimeMessages, setRealtimeMessages] = useState<Message[]>([])
  const [typingUsers, setTypingUsers] = useState<Map<string, string>>(new Map())
  const { data, fetchNextPage, hasNextPage } = useMessages(channelId)

  const historicMessages = data?.pages.flatMap((p) => p.messages) ?? []
  const allMessages = [...historicMessages, ...realtimeMessages]

  // Join channel room + listen for events
  useEffect(() => {
    if (!socket || !channelId) return

    socket.emit('channel:join', channelId)
    setRealtimeMessages([])
    setTypingUsers(new Map())

    socket.on('message:new', (message) => {
      setRealtimeMessages((prev) => [...prev, message])
    })

    socket.on('typing:start', ({ userId, channelId: cId }) => {
      if (cId !== channelId) return
      setTypingUsers((prev) => new Map(prev).set(userId, userId))
    })

    socket.on('typing:stop', ({ userId, channelId: cId }) => {
      if (cId !== channelId) return
      setTypingUsers((prev) => {
        const next = new Map(prev)
        next.delete(userId)
        return next
      })
    })

    return () => {
      socket.emit('channel:leave', channelId)
      socket.off('message:new')
      socket.off('typing:start')
      socket.off('typing:stop')
    }
  }, [socket, channelId])

  const handleSend = (content: string) => {
    if (!socket || !me) return
    socket.emit('message:send', {
      content,
      channelId,
      clientMessageId: uuid(),
    })
  }

  const handleTypingStart = () => socket?.emit('typing:start', channelId)
  const handleTypingStop = () => socket?.emit('typing:stop', channelId)

  return (
    <div className="flex h-full flex-col">
      {/* Channel header */}
      <div className="flex h-14 items-center border-b border-gray-200 px-4 dark:border-gray-700">
        <span className="font-semibold text-gray-900 dark:text-white"># {channelId}</span>
      </div>

      {/* Messages */}
      <MessageList
        messages={allMessages}
        currentUserId={me?.id ?? ''}
        typingUsernames={Array.from(typingUsers.values())}
        onScrollTop={() => { if (hasNextPage) void fetchNextPage() }}
      />

      {/* Input */}
      <MessageInput
        onSend={handleSend}
        onTypingStart={handleTypingStart}
        onTypingStop={handleTypingStop}
      />
    </div>
  )
}
