"use client";

import { useState, useEffect } from "react";

export default function Playground() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  // ✅ Load existing conversation when page loads
  useEffect(() => {
    const loadConversation = async () => {
      const res = await fetch("/api/conversation", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (data?.messages) {
          setMessages(data.messages);
          setConversationId(data.conversationId);
        }
      }
    };
    loadConversation();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input, conversationId }),
        credentials: "include", // ✅ ensure auth session
      });

      const data = await res.json();

      if (data.response) {
        setMessages([...newMessages, { role: "assistant", content: data.response }]);
      }

      if (data.conversationId) {
        setConversationId(data.conversationId);
      }
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">AI Playground</h1>
      <div className="border rounded-lg p-4 h-[500px] overflow-y-auto mb-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`my-2 p-3 rounded-lg max-w-[80%] ${
              msg.role === "user" ? "bg-indigo-100 ml-auto" : "bg-white"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <p className="text-gray-500">Thinking...</p>}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border rounded-lg p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-indigo-600 text-white px-4 rounded-lg hover:bg-indigo-700"
          onClick={sendMessage}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}

