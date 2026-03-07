import { Paperclip } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { ChatMessage as ChatMessageType } from '@/types'

interface ChatMessageProps {
  message: ChatMessageType
  isOwnMessage: boolean
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso)
  const time = date.toLocaleTimeString('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
  const day = date.getDate()
  const month = date.toLocaleString('en-GB', { month: 'short' })
  return `${time} \u00b7 ${day} ${month}`
}

export function ChatMessage({ message, isOwnMessage }: ChatMessageProps) {
  const readCount = message.readBy.length

  return (
    <div
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] rounded-xl px-4 py-3 border ${
          isOwnMessage
            ? 'bg-accent/10 border-accent/20'
            : 'bg-surface-overlay border-border-subtle'
        }`}
      >
        {/* Sender name and role badge */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-text-secondary">
            {message.sender.name}
          </span>
          <Badge
            variant={message.sender.role === 'client' ? 'accent' : 'muted'}
            className="text-[10px] px-1.5 py-0"
          >
            {message.sender.role}
          </Badge>
        </div>

        {/* Message text */}
        <p className="text-sm text-text-primary whitespace-pre-wrap">
          {message.text}
        </p>

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 space-y-1">
            {message.attachments.map((filename, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 text-xs text-text-muted"
              >
                <Paperclip className="w-3 h-3" />
                <span className="truncate">{filename}</span>
              </div>
            ))}
          </div>
        )}

        {/* Timestamp and read status */}
        <div className="flex items-center justify-between gap-3 mt-2">
          <span className="text-[11px] text-text-muted">
            {formatTimestamp(message.timestamp)}
          </span>
          {readCount > 1 && (
            <span className="text-[11px] text-text-muted">
              Read by {readCount - 1}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
