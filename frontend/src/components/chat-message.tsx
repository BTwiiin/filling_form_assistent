import { Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Message } from "../types"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex items-start gap-3 rounded-lg p-3", isUser ? "bg-primary/5" : "bg-muted")}>
      <div className={cn("rounded-full p-2 flex items-center justify-center", isUser ? "bg-primary/10" : "bg-primary")}>
        {isUser ? <User className="h-4 w-4 text-primary" /> : <Bot className="h-4 w-4 text-primary-foreground" />}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium mb-1">{isUser ? "You" : "AI Assistant"}</p>
        <div className="text-sm">{message.content}</div>
      </div>
    </div>
  )
}
