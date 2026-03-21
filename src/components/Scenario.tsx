"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
}

interface ScenarioProps {
  topic: string;
  topicLabel: string;
}

function apiErrorMessage(status: number): string {
  if (status === 401) return "Invalid API key — check your server configuration.";
  if (status === 429) return "Rate limit reached. Wait a moment and try again.";
  if (status >= 500) return "The AI service is having issues. Try again shortly.";
  return "Something went wrong. Please try again.";
}

export default function Scenario({ topic, topicLabel }: ScenarioProps) {
  const [scenarioText, setScenarioText] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateScenario = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, topicLabel }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Failed to generate scenario.");
      } else {
        setScenarioText(data.scenario);
        setMessages([]);
      }
    } catch {
      setError(navigator.onLine ? "Could not reach the server." : "You're offline.");
    } finally {
      setGenerating(false);
    }
  };

  const sendMessage = async (history: Message[]) => {
    setLoading(true);
    try {
      const systemPrompt = `You are a personal finance tutor helping someone work through a realistic scenario about ${topicLabel}.

Here is the scenario the learner is analyzing:
---
${scenarioText}
---

Guide them through their thinking. Ask follow-up questions, point out things they may have missed, explain relevant concepts, and help them arrive at a well-reasoned decision. Be encouraging and practical.`;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          topic: `${topicLabel} scenario coaching`,
          systemPromptOverride: systemPrompt,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        const msg = data.error || apiErrorMessage(res.status);
        setMessages((prev) => [...prev, { role: "assistant", content: msg, isError: true }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
      }
    } catch {
      const msg = navigator.onLine ? "Could not reach the server." : "You're offline.";
      setMessages((prev) => [...prev, { role: "assistant", content: msg, isError: true }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMessage: Message = { role: "user", content: input };
    const updated = [...messages, userMessage];
    setMessages(updated);
    setInput("");
    await sendMessage(updated);
  };

  // Empty state
  if (!scenarioText) {
    return (
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 text-center">
        <div className="text-4xl mb-4">🎭</div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
          Real-World Scenario
        </h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
          Get a realistic financial situation to reason through. Work out what you would do and why — then discuss it with your AI tutor.
        </p>
        {error && (
          <p className="mb-4 rounded-lg border border-red-500/40 bg-red-50 dark:bg-red-900/30 px-4 py-3 text-sm text-red-600 dark:text-red-300">
            {error}
          </p>
        )}
        <button
          onClick={generateScenario}
          disabled={generating}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:text-slate-400 transition-colors font-medium cursor-pointer"
        >
          {generating ? "Generating scenario…" : "Generate a Scenario"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Scenario card */}
      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            📋 Scenario
          </span>
          <button
            onClick={generateScenario}
            disabled={generating}
            className="text-xs text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer disabled:opacity-50"
          >
            {generating ? "Loading…" : "New scenario ↺"}
          </button>
        </div>
        <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{scenarioText}</p>
      </div>

      {/* Discussion */}
      <div className="flex flex-col rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 overflow-hidden">
        {messages.length === 0 && (
          <div className="p-5 text-center text-sm text-slate-400 dark:text-slate-500">
            What would you do? Type your response below and discuss it with your tutor.
          </div>
        )}

        {messages.length > 0 && (
          <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-96">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.isError ? (
                  <div className="max-w-md rounded-lg border border-red-500/40 bg-red-50 dark:bg-red-900/30 px-4 py-3">
                    <p className="text-sm text-red-600 dark:text-red-300">{msg.content}</p>
                  </div>
                ) : msg.role === "assistant" ? (
                  <div className="max-w-xl px-4 py-3 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-md px-4 py-2 rounded-lg bg-emerald-600 text-white">
                    <p className="text-sm">{msg.content}</p>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        <form
          onSubmit={handleSend}
          className="border-t border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-800"
        >
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What would you do in this situation?"
              disabled={loading}
              className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 dark:disabled:bg-slate-600"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:text-slate-400 transition-colors font-medium cursor-pointer"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
