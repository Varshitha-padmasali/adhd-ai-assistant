"use client"

import { useEffect, useRef, useState } from "react"
import MessageBubble from "./MessageBubble"
import ChatInput from "./ChatInput"

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

type ChatResponse = {
  reply?: string
  detail?: string
}

const STORAGE_KEY = "adhd-ai-assistant-chat-history"
const ERROR_MESSAGE =
  "Sorry, I had trouble getting a response. Please try again."
const INITIAL_MESSAGES: ChatMessage[] = [
  {
    role: "assistant",
    content: "Hi! I am your AI ADHD learning assistant."
  }
]

function isChatMessage(message: unknown): message is ChatMessage {
  if (!message || typeof message !== "object") return false

  const maybeMessage = message as Partial<ChatMessage>

  return (
    (maybeMessage.role === "user" || maybeMessage.role === "assistant") &&
    typeof maybeMessage.content === "string"
  )
}

function getInitialMessages() {
  if (typeof window === "undefined") return INITIAL_MESSAGES

  try {
    const savedMessages = window.localStorage.getItem(STORAGE_KEY)
    const parsedMessages = savedMessages ? JSON.parse(savedMessages) : null

    if (Array.isArray(parsedMessages) && parsedMessages.every(isChatMessage)) {
      return parsedMessages
    }
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
  }

  return INITIAL_MESSAGES
}

export default function ChatBox() {

  const [messages, setMessages] = useState<ChatMessage[]>(getInitialMessages)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const handleSend = async (message: string) => {
    if (isLoading) return

    const updatedMessages = [
        ...messages,
        {
          role: "user",
          content: message
        }
      ]
      
      setMessages(updatedMessages)
      setIsLoading(true)

    try {
      const response = await fetch(
          "http://localhost:8000/chat",
          {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  messages: updatedMessages,
              }),
          }
      )

      const data = await response.json().catch((): ChatResponse => ({}))

      if (!response.ok) {
        throw new Error(data.detail || "Chat request failed")
      }

      if (!data.reply) {
        throw new Error("Chat response did not include a reply")
      }

      setMessages((prev) => [
          ...prev,
          {
              role: "assistant",
              content: data.reply,
          },
      ])
    } catch {
      setMessages((prev) => [
          ...prev,
          {
              role: "assistant",
              content: ERROR_MESSAGE,
          },
      ])
    } finally {
      setIsLoading(false)
    }
}
    return (
      <div className="w-full max-w-3xl h-[80vh] bg-white rounded-2xl shadow-lg flex flex-col">
        <div className="p-4 border-b text-xl font-semibold">
          AI ADHD Learning Assistant
        </div>
  
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
    <MessageBubble
        key={index}
        role={message.role}
        content={message.content}
    />
))}
        {isLoading && (
          <MessageBubble
            role="assistant"
            content="Thinking..."
          />
        )}
        <div ref={messagesEndRef} />
        </div>
  
        <div className="p-4 border-t">
          <ChatInput onSend={handleSend} disabled={isLoading} />
        </div>
      </div>
    )
  }
