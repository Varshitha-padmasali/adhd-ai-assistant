"use client"

import { useState } from "react"

type Props = {
  onSend: (message: string) => void
  disabled?: boolean
}

export default function ChatInput({ onSend, disabled = false }: Props) {

  const [input, setInput] = useState("")

  const handleSend = () => {

    if (!input.trim() || disabled) return

    onSend(input)

    setInput("")
  }

  return (
    <div className="flex gap-2">

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={disabled}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSend()
          }
        }}
        placeholder="Ask anything..."
        className="flex-1 border rounded-xl px-4 py-3 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
      />

      <button
        onClick={handleSend}
        disabled={disabled}
        className="bg-black text-white px-5 rounded-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {disabled ? "Sending..." : "Send"}
      </button>

    </div>
  )
}
