export interface Message {
  id: string
  content: string
  senderId: string
  channelId: string
  createdAt: Date
  aiSummary?: string | null
  sender?: import('./user').PublicUser
}

export interface CreateMessagePayload {
  content: string
  channelId: string
  clientMessageId: string
}
