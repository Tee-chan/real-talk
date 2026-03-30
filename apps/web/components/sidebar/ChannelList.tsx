'use client'
import { useQuery } from '@tanstack/react-query'
import type { Channel } from '@realtalk/types'
import { api } from '@/lib/api'
import { ChannelItem } from './ChannelItem'

export const ChannelList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['channels'],
    queryFn: async () => {
      const { data } = await api.get<{ data: Channel[] }>('/channels')
      return data.data
    },
  })

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1 p-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-9 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-0.5 p-2">
      <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
        Channels
      </p>
      {data?.map((channel) => <ChannelItem key={channel.id} channel={channel} />)}
    </div>
  )
}
