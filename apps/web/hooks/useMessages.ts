'use client'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Message } from '@realtalk/types'
import { api } from '@/lib/api'

interface MessagesPage {
  messages: Message[]
  nextCursor: string | null
}

export const useMessages = (channelId: string) => {
  return useInfiniteQuery({
    queryKey: ['messages', channelId],
    queryFn: async ({ pageParam }) => {
      const params: Record<string, string> = { channelId }
      if (pageParam) params['cursor'] = pageParam as string
      const { data } = await api.get<{ data: MessagesPage }>('/messages', { params })
      return data.data
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
  })
}

export const useSendMessage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {
      content: string
      channelId: string
      clientMessageId: string
    }) => {
      const { data } = await api.post<{ data: Message }>('/messages', payload)
      return data.data
    },
    onSuccess: (message) => {
      void queryClient.invalidateQueries({ queryKey: ['messages', message.channelId] })
    },
  })
}
