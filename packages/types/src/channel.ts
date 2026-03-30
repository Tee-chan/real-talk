export interface Channel {
  id: string
  name: string
  description: string | null
  isPrivate: boolean
  createdAt: Date
  memberCount?: number
}

export interface ChannelMember {
  userId: string
  channelId: string
  joinedAt: Date
  role: 'ADMIN' | 'MEMBER'
}
