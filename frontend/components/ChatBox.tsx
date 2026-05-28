import MessageBubble from "./MessageBubble"
import ChatInput from "./ChatInput"

export default function ChatBox() {
    return (
      <div className="w-full max-w-3xl h-[80vh] bg-white rounded-2xl shadow-lg flex flex-col">
        <div className="p-4 border-b text-xl font-semibold">
          AI ADHD Learning Assistant
        </div>
  
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <MessageBubble
                role="assistant"
                content="Hi! I am your AI ADHD learning assistant."
            />

            <MessageBubble
                role="user"
                content="Explain recursion simply."
            />
        </div>
  
        <div className="p-4 border-t">
            <ChatInput />
        </div>
      </div>
    )
  }