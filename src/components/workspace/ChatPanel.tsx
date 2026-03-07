import { useState, useRef, useEffect, useMemo } from 'react'
import { ChevronDown, ChevronUp, Send, MessageSquare } from 'lucide-react'
import { useChatStore } from '@/stores/chatStore'
import { useAuthStore } from '@/stores/authStore'
import { ChatMessage } from '@/components/workspace/ChatMessage'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ChatPanelProps {
  quoteId: string
}

export function ChatPanel({ quoteId }: ChatPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [inputText, setInputText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const allMessages = useChatStore((s) => s.messages)
  const sendMessage = useChatStore((s) => s.sendMessage)
  const currentUser = useAuthStore((s) => s.currentUser)

  // Filter and sort messages for this quote
  const sortedMessages = useMemo(
    () =>
      allMessages
        .filter((m) => m.quoteId === quoteId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
    [allMessages, quoteId],
  )

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isExpanded) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [sortedMessages.length, isExpanded])

  function handleSend() {
    const text = inputText.trim()
    if (!text || !currentUser) return

    sendMessage(quoteId, text, {
      userId: currentUser.id,
      name: currentUser.name,
      role: currentUser.role,
    })
    setInputText('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="rounded-xl border border-border-subtle bg-surface-raised overflow-hidden">
      {/* Header bar */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full flex items-center justify-between px-5 py-3 hover:bg-surface-overlay/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <MessageSquare className="w-4 h-4 text-accent" />
          <span className="text-sm font-semibold text-text-primary">
            Project Chat
          </span>
          {sortedMessages.length > 0 && (
            <Badge variant="accent" className="text-[10px]">
              {sortedMessages.length}
            </Badge>
          )}
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-text-muted" />
        ) : (
          <ChevronUp className="w-4 h-4 text-text-muted" />
        )}
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="border-t border-border-subtle">
          {/* Message list */}
          <div className="max-h-[360px] overflow-y-auto px-5 py-4 space-y-3">
            {sortedMessages.length === 0 && (
              <p className="text-center text-text-muted text-sm py-8">
                No messages yet. Start a conversation.
              </p>
            )}
            {sortedMessages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                isOwnMessage={currentUser?.id === msg.sender.userId}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-border-subtle px-5 py-3 flex items-center gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 rounded-lg border border-border-subtle bg-surface-overlay px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
            />
            <Button
              onClick={handleSend}
              disabled={!inputText.trim() || !currentUser}
              size="sm"
              className="gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Send
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
