export default function ChatPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
      <div className="text-5xl">💬</div>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Select a channel
      </h2>
      <p className="text-sm text-gray-500">Choose a channel from the sidebar to start chatting</p>
    </div>
  )
}
