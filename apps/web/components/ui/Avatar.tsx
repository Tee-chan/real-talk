import { cn } from '@/lib/utils'

interface AvatarProps {
  src?: string | null
  username: string
  size?: 'sm' | 'md' | 'lg'
  online?: boolean
}

export const Avatar = ({ src, username, size = 'md', online }: AvatarProps) => {
  const initials = username.slice(0, 2).toUpperCase()

  return (
    <div className="relative inline-block">
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-brand-600 font-semibold text-white',
          {
            'h-7 w-7 text-xs': size === 'sm',
            'h-9 w-9 text-sm': size === 'md',
            'h-12 w-12 text-base': size === 'lg',
          },
        )}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={username} className="h-full w-full rounded-full object-cover" />
        ) : (
          initials
        )}
      </div>
      {online !== undefined && (
        <span
          className={cn(
            'absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-gray-900',
            online ? 'bg-green-500' : 'bg-gray-400',
          )}
        />
      )}
    </div>
  )
}
