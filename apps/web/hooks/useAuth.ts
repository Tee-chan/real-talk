'use client'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import type { LoginDto, RegisterDto } from '@realtalk/types'
import { api, setAccessToken, clearAccessToken } from '@/lib/api'

interface AuthResponse {
  data: { accessToken: string }
}

interface MeResponse {
  data: { id: string; email: string; username: string; avatar: string | null }
}

export const useMe = () =>
  useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const { data } = await api.get<MeResponse>('/users/me')
      return data.data
    },
    retry: false,
  })

export const useLogin = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: async (dto: LoginDto) => {
      const { data } = await api.post<AuthResponse>('/auth/login', dto)
      return data.data
    },
    onSuccess: ({ accessToken }) => {
      setAccessToken(accessToken)
      router.push('/chat')
    },
  })
}

export const useRegister = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: async (dto: RegisterDto) => {
      const { data } = await api.post<AuthResponse>('/auth/register', dto)
      return data.data
    },
    onSuccess: ({ accessToken }) => {
      setAccessToken(accessToken)
      router.push('/chat')
    },
  })
}

export const useLogout = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: () => api.post('/auth/logout'),
    onSuccess: () => {
      clearAccessToken()
      router.push('/login')
    },
  })
}
