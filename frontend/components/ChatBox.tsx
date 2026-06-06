"use client"

import { useEffect, useRef, useState } from "react"
import MessageBubble from "./MessageBubble"
import ChatInput from "./ChatInput"

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

export default function ChatBox() {

  const [messages, setMessages] = useState<ChatMessage[]>([
      {
          role: "assistant",
          content: "Hi! I am your AI ADHD learning assistant."
      }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

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

      const data = await response.json()

      setMessages((prev) => [
          ...prev,
          {
              role: "assistant",
              content: data.reply,
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
