'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Channel } from '@realtalk/types'
import { cn } from '@/lib/utils'

interface ChannelItemProps {
  channel: Channel
}

export const ChannelItem = ({ channel }: ChannelItemProps) => {
  const pathname = usePathname()
  const isActive = pathname === `/chat/${channel.id}`

  return (
    <Link
      href={`/chat/${channel.id}`}
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
        isActive
          ? 'bg-brand-600 text-white'
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
      )}
    >
      <span className="text-base">#</span>
      <span className="truncate font-medium">{channel.name}</span>
    </Link>
  )
}
