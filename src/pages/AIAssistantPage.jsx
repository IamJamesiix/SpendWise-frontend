import React, { useState, useRef, useEffect } from "react";
import { Send, Brain, User, Sparkles } from "lucide-react";
import { api } from "../services/api";

const INITIAL_MESSAGE = {
  role: "assistant",
  content:
    "Hello! I'm your AI financial assistant. I can help you with budgeting advice, savings tips, tax questions, and more. How can I help you today?",
};

export const AIAssistantPage = () => {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorToast, setErrorToast] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Auto-hide error toast after a short delay
  useEffect(() => {
    if (!errorToast) return;
    const id = setTimeout(() => setErrorToast(null), 8000);
    return () => clearTimeout(id);
  }, [errorToast]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input;
    setMessages((m) => [...m, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);
    try {
      const result = await api.chatWithAI(userMessage);
      // Backend may return either a success payload or an error like:
      // { "error": "Failed to get AI response", "details": "OpenAI API quota exceeded. Please check your billing." }
      if (result?.error) {
        const message = result.details
          ? `${result.error}: ${result.details}`
          : result.error;
        setErrorToast(message);
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: message,
          },
        ]);
      } else if (result?.success) {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: result.response },
        ]);
      } else {
        const fallback =
          "Failed to get AI response. Please try again in a moment.";
        setErrorToast(fallback);
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: fallback,
          },
        ]);
      }
    } catch (err) {
      const fallback =
        "Sorry, I encountered a network error talking to the AI. Please try again.";
      setErrorToast(fallback);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: fallback,
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const suggestions = [
    "How can I save more money?",
    "Tips for reducing expenses",
    "How should I budget my income?",
  ];

  return (
    <div className="fade-in flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="bg-purple-500/15 p-2 rounded-xl">
            <Brain className="w-5 h-5 text-purple-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            AI Assistant
          </h1>
        </div>
        <p className="text-gray-400 text-sm ml-12">
          Your personal financial advisor powered by AI
        </p>
      </div>

      {/* Backend error toast */}
      {errorToast && (
        <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200 flex items-start justify-between gap-2">
          <span className="pr-2">{errorToast}</span>
          <button
            type="button"
            onClick={() => setErrorToast(null)}
            className="ml-1 text-red-300 hover:text-red-100"
          >
            ×
          </button>
        </div>
      )}

      {/* Chat container */}
      <div className="flex-1 bg-gray-900 rounded-2xl border border-gray-800 flex flex-col overflow-hidden min-h-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === "user"
                    ? "bg-purple-600"
                    : "bg-gray-800 border border-gray-700"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Sparkles className="w-4 h-4 text-purple-400" />
                )}
              </div>

              {/* Message bubble */}
              <div
                className={`max-w-[80%] sm:max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-purple-600 text-white rounded-tr-md"
                    : "bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-md"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <div className="bg-gray-800 border border-gray-700 px-4 py-3 rounded-2xl rounded-tl-md">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          {/* Quick suggestions (show only at start) */}
          {messages.length === 1 && !loading && (
            <div className="flex flex-wrap gap-2 pt-2">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(s);
                    inputRef.current?.focus();
                  }}
                  className="px-3 py-2 text-xs text-gray-400 bg-gray-800 border border-gray-700 rounded-xl hover:border-purple-500/40 hover:text-purple-300 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 sm:p-4 border-t border-gray-800">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask me anything about your finances..."
              className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed p-2.5 rounded-xl transition-colors shrink-0"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
