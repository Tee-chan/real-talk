import type { Message } from './message'
import type { PublicUser } from './user'

export interface ServerToClientEvents {
  'message:new': (message: Message) => void
  'message:updated': (message: Message) => void
  'presence:update': (payload: PresencePayload) => void
  'typing:start': (payload: TypingPayload) => void
  'typing:stop': (payload: TypingPayload) => void
  error: (payload: SocketError) => void
}

export interface ClientToServerEvents {
  'message:send': (payload: import('./message').CreateMessagePayload) => void
  'typing:start': (channelId: string) => void
  'typing:stop': (channelId: string) => void
  'channel:join': (channelId: string) => void
  'channel:leave': (channelId: string) => void
}

export interface PresencePayload {
  userId: string
  user: PublicUser
  status: 'online' | 'offline'
}

export interface TypingPayload {
  channelId: string
  user: PublicUser
}

export interface SocketError {
  message: string
  code: string
}
