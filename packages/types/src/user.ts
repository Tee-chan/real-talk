export interface User {
  id: string
  email: string
  username: string
  avatar: string | null
  createdAt: Date
}

export type PublicUser = Omit<User, 'createdAt'>
