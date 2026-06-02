"use client"

import { useState } from "react"
import MessageBubble from "./MessageBubble"
import ChatInput from "./ChatInput"

export default function ChatBox() {

  const [messages, setMessages] = useState([
      {
          role: "assistant",
          content: "Hi! I am your AI ADHD learning assistant."
      }
  ])
  const handleSend = async (message: string) => {

    setMessages((prev) => [
        ...prev,
        {
            role: "user",
            content: message
        }
    ])

    const response = await fetch(
        "http://localhost:8000/chat",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message,
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
        role={message.role as "user" | "assistant"}
        content={message.content}
    />
))}
        </div>
  
        <div className="p-4 border-t">
          <ChatInput onSend={handleSend} />
        </div>
      </div>
    )
  }