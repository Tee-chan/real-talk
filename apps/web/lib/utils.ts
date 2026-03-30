import clsx, { type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs))

export const formatTime = (date: Date | string): string =>
  new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

export const formatDate = (date: Date | string): string =>
  new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric' })
