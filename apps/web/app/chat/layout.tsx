import { ChannelList } from '@/components/sidebar/ChannelList'
import { UserPresence } from '@/components/sidebar/UserPresence'

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="flex w-64 flex-shrink-0 flex-col border-r border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
        {/* App name */}
        <div className="flex h-14 items-center border-b border-gray-200 px-4 dark:border-gray-700">
          <span className="text-lg font-bold text-gray-900 dark:text-white">RealTalk</span>
        </div>

        {/* Channel list */}
        <div className="flex-1 overflow-y-auto">
          <ChannelList />
        </div>

        {/* Current user */}
        <UserPresence />
      </aside>

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  )
}
