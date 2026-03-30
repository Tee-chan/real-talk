'use client'
import { useEffect, useState } from 'react'
import type { Socket } from 'socket.io-client'
import type { ClientToServerEvents, ServerToClientEvents } from '@realtalk/types'

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>

export const usePresence = (socket: AppSocket | null, userIds: string[]) => {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!socket) return

    const handler: ServerToClientEvents['presence:update'] = ({ userId, status }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev)
        if (status === 'online') next.add(userId)
        else next.delete(userId)
        return next
      })
    }

    socket.on('presence:update', handler)
    return () => { socket.off('presence:update', handler) }
  }, [socket])

  return { onlineUsers }
}
