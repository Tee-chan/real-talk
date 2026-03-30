import { io, type Socket } from 'socket.io-client'
import type { ClientToServerEvents, ServerToClientEvents } from '@realtalk/types'

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>

let socket: AppSocket | null = null

export const getSocket = (token: string): AppSocket => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:4000', {
      auth: { token },
      withCredentials: true,
      transports: ['websocket'],
      autoConnect: false,
    })
  }
  return socket
}

export const disconnectSocket = (): void => {
  socket?.disconnect()
  socket = null
}
