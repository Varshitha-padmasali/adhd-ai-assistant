export default function ChatInput() {
    return (
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ask anything..."
          className="flex-1 border rounded-xl px-4 py-3 outline-none"
        />
  
        <button className="bg-black text-white px-5 rounded-xl">
          Send
        </button>
      </div>
    )
}