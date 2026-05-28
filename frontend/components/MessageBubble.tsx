type Props = {
    role: "user" | "assistant"
    content: string
  }
  
  export default function MessageBubble({ role, content }: Props) {
    const isUser = role === "user"
  
    return (
      <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed
          ${isUser ? "bg-black text-white" : "bg-gray-200 text-black"}`}
        >
          {content}
        </div>
      </div>
    )
  }