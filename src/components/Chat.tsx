"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
}

interface ChatProps {
  topic: string;
  topicLabel: string;
  suggestions?: string[];
}

function apiErrorMessage(status: number): string {
  if (status === 401) return "Invalid API key — check your server configuration.";
  if (status === 429) return "Rate limit reached. Wait a moment and try again.";
  if (status >= 500) return "The AI service is having issues. Try again shortly.";
  return "Something went wrong. Please try again.";
}

export default function Chat({ topic, topicLabel, suggestions = [] }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hi! I'm your personal finance tutor. I'm here to help you understand **${topicLabel}**. What would you like to learn about it?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(suggestions.length > 0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (history: Message[]) => {
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, topic: topicLabel }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        const msg = data.error || apiErrorMessage(response.status);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: msg, isError: true },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.content },
        ]);
      }
    } catch {
      const msg = navigator.onLine
        ? "Could not reach the server. Please try again."
        : "You're offline. Check your connection and try again.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: msg, isError: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setInput("");
    setShowSuggestions(false);

    await sendMessage(updatedHistory);
  };

  const handleSuggestion = async (text: string) => {
    const userMessage: Message = { role: "user", content: text };
    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setShowSuggestions(false);

    await sendMessage(updatedHistory);
  };

  const handleRetry = async () => {
    const errorIndex = messages.length - 1;
    const userIndex = messages.findLastIndex((m) => m.role === "user");
    if (userIndex === -1) return;

    const trimmed = messages.slice(0, errorIndex);
    setMessages(trimmed);

    await sendMessage(trimmed);
  };

  return (
    <div className="flex flex-col h-full rounded-lg border border-slate-700 bg-slate-900 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.isError ? (
              <div className="max-w-xs lg:max-w-md rounded-lg rounded-bl-none border border-red-500/40 bg-red-900/30 px-4 py-3">
                <p className="text-sm text-red-300">{message.content}</p>
                <button
                  onClick={handleRetry}
                  disabled={loading}
                  className="mt-2 text-xs font-medium text-red-400 hover:text-red-300 underline underline-offset-2 cursor-pointer disabled:opacity-50"
                >
                  Retry
                </button>
              </div>
            ) : message.role === "assistant" ? (
              <div className="max-w-xs lg:max-w-2xl px-4 py-3 rounded-lg rounded-bl-none bg-slate-800 text-slate-100 border border-slate-700">
                <div className="prose prose-sm prose-invert max-w-none">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg rounded-br-none bg-emerald-600 text-white">
                <p className="text-sm">{message.content}</p>
              </div>
            )}
          </div>
        ))}

        {showSuggestions && !loading && (
          <div className="flex flex-wrap gap-2 pt-1">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestion(s)}
                className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-500/70 transition-colors cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 text-slate-100 px-4 py-2 rounded-lg rounded-bl-none border border-slate-700">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="border-t border-slate-700 p-4 bg-slate-800">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me something..."
            disabled={loading}
            className="flex-1 px-4 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-600"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 disabled:bg-slate-700 transition-colors font-medium cursor-pointer"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
