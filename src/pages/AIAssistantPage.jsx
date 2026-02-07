import React, { useState } from "react";
import { Send } from "lucide-react";
import { api } from "../services/api";

const INITIAL_MESSAGE = {
  role: "assistant",
  content: "Hello! I'm your AI financial assistant. How can I help you today?",
};

export const AIAssistantPage = () => {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setMessages((m) => [...m, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);
    try {
      const result = await api.chatWithAI(userMessage);
      if (result.success) {
        setMessages((m) => [...m, { role: "assistant", content: result.response }]);
      }
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-white mb-8">AI Assistant</h1>
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-purple-500/20 h-[600px] flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] p-4 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "bg-gray-700 text-white"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-700 p-4 rounded-2xl text-white">Thinking...</div>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-purple-500/20">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask me anything about your finances..."
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500 outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl disabled:opacity-50"
            >
              <Send className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
