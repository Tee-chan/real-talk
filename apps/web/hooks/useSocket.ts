'use client'
import { useEffect, useRef } from 'react'
import type { Socket } from 'socket.io-client'
import type { ClientToServerEvents, ServerToClientEvents } from '@realtalk/types'
import { getSocket, disconnectSocket } from '@/lib/socket'

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>

export const useSocket = (token: string | null): AppSocket | null => {
  const socketRef = useRef<AppSocket | null>(null)

  useEffect(() => {
    if (!token) return
    const s = getSocket(token)
    socketRef.current = s
    s.connect()

    return () => {
      disconnectSocket()
      socketRef.current = null
    }
  }, [token])

  return socketRef.current
}
