"use client"

import { useState } from "react"

type Props = {
  onSend: (message: string) => void
}

export default function ChatInput({ onSend }: Props) {

  const [input, setInput] = useState("")

  const handleSend = () => {

    if (!input.trim()) return

    onSend(input)

    setInput("")
  }

  return (
    <div className="flex gap-2">

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSend()
          }
        }}
        placeholder="Ask anything..."
        className="flex-1 border rounded-xl px-4 py-3 outline-none"
      />

      <button
        onClick={handleSend}
        className="bg-black text-white px-5 rounded-xl"
      >
        Send
      </button>

    </div>
  )
}