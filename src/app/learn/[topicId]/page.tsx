"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PERSONAL_FINANCE_INTERESTS, Interest } from "@/lib/interests";
import Chat from "@/components/Chat";
import Quiz from "@/components/Quiz";

export default function LearnPage() {
  const params = useParams();
  const router = useRouter();
  const [interest, setInterest] = useState<Interest | null>(null);
  const [tab, setTab] = useState<"chat" | "quiz">("chat");

  useEffect(() => {
    const topicId = params.topicId as string;
    const found = PERSONAL_FINANCE_INTERESTS.find((i) => i.id === topicId);
    
    if (!found) {
      router.push("/");
      return;
    }
    
    setInterest(found);
  }, [params, router]);

  if (!interest) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <button
        onClick={() => router.push("/dashboard")}
        className="mb-6 text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer"
      >
        ← Back to Dashboard
      </button>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{interest.icon}</span>
          <h1 className="text-3xl font-bold text-gray-900">{interest.label}</h1>
        </div>
        <p className="text-gray-600">{interest.description}</p>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-1">
          <button
            onClick={() => setTab("chat")}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              tab === "chat"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-gray-600 hover:text-gray-900 cursor-pointer"
            }`}
          >
            💬 AI Tutor
          </button>
          <button
            onClick={() => setTab("quiz")}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              tab === "quiz"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-gray-600 hover:text-gray-900 cursor-pointer"
            }`}
          >
            ✏️ Quiz
          </button>
        </div>
      </div>

      <div className="min-h-96">
        {tab === "chat" ? (
          <Chat topic={interest.id} topicLabel={interest.label} />
        ) : (
          <Quiz topic={interest.id} topicLabel={interest.label} />
        )}
      </div>
    </div>
  );
}
