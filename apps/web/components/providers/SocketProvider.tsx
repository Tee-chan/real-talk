'use client'
import { createContext, useContext, useEffect, useRef } from 'react'
import type { Socket } from 'socket.io-client'
import type { ClientToServerEvents, ServerToClientEvents } from '@realtalk/types'
import { getSocket, disconnectSocket } from '@/lib/socket'

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>

const SocketContext = createContext<AppSocket | null>(null)

export const SocketProvider = ({
  children,
  token,
}: {
  children: React.ReactNode
  token: string | null
}) => {
  const socketRef = useRef<AppSocket | null>(null)

  useEffect(() => {
    if (!token) return
    const s = getSocket(token)
    socketRef.current = s
    s.connect()
    return () => {
      disconnectSocket()
    }
  }, [token])

  return (
    <SocketContext.Provider value={socketRef.current}>{children}</SocketContext.Provider>
  )
}

export const useSocketContext = (): AppSocket | null => useContext(SocketContext)
