'use client'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui'

interface MessageInputProps {
  onSend: (content: string) => void
  onTypingStart?: () => void
  onTypingStop?: () => void
  disabled?: boolean
}

export const MessageInput = ({
  onSend,
  onTypingStart,
  onTypingStop,
  disabled,
}: MessageInputProps) => {
  const [value, setValue] = useState('')
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isTyping = useRef(false)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)

    if (!isTyping.current) {
      isTyping.current = true
      onTypingStart?.()
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current)
    typingTimeout.current = setTimeout(() => {
      isTyping.current = false
      onTypingStop?.()
    }, 2000)
  }

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    if (typingTimeout.current) clearTimeout(typingTimeout.current)
    isTyping.current = false
    onTypingStop?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex items-end gap-2 border-t border-gray-200 p-4 dark:border-gray-700">
      <textarea
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a message… (Enter to send)"
        disabled={disabled}
        rows={1}
        className="flex-1 resize-none rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
      />
      <Button size="sm" onClick={handleSend} disabled={!value.trim() || disabled}>
        Send
      </Button>
    </div>
  )
}
