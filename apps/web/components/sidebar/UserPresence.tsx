'use client'
import { Avatar } from '@/components/ui'
import { useLogout, useMe } from '@/hooks/useAuth'
import { Button } from '@/components/ui'

export const UserPresence = () => {
  const { data: user } = useMe()
  const logout = useLogout()

  if (!user) return null

  return (
    <div className="flex items-center gap-2 border-t border-gray-200 p-3 dark:border-gray-700">
      <Avatar username={user.username} src={user.avatar} size="sm" online />
      <div className="flex flex-1 flex-col overflow-hidden">
        <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
          {user.username}
        </span>
        <span className="text-xs text-green-500">Online</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => logout.mutate()}
        loading={logout.isPending}
      >
        Out
      </Button>
    </div>
  )
}
