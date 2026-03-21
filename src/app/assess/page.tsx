"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PERSONAL_FINANCE_INTERESTS, Interest } from "@/lib/interests";
import { seedMastery, Mastery } from "@/lib/gamification";

type Level = Mastery | null;

const LEVEL_OPTIONS: { value: Mastery; label: string; description: string; style: string }[] = [
  {
    value: "Beginner",
    label: "New to this",
    description: "I've never really learned about it",
    style: "border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  },
  {
    value: "Intermediate",
    label: "Know the basics",
    description: "I have a rough idea but gaps in my knowledge",
    style: "border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-300",
  },
  {
    value: "Advanced",
    label: "Pretty confident",
    description: "I understand it well and want a challenge",
    style: "border-yellow-500 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
  },
];

export default function AssessPage() {
  const router = useRouter();
  const [interests, setInterests] = useState<Interest[]>([]);
  const [levels, setLevels] = useState<Record<string, Level>>({});

  useEffect(() => {
    const stored = localStorage.getItem("pfinance-interests");
    if (!stored) { router.push("/"); return; }
    const ids: string[] = JSON.parse(stored);
    const matched = PERSONAL_FINANCE_INTERESTS.filter((i) => ids.includes(i.id));
    if (matched.length === 0) { router.push("/"); return; }
    setInterests(matched);
    const initial: Record<string, Level> = {};
    matched.forEach((i) => { initial[i.id] = null; });
    setLevels(initial);
  }, [router]);

  const handleContinue = () => {
    Object.entries(levels).forEach(([topicId, mastery]) => {
      if (mastery) seedMastery(topicId, mastery);
    });
    router.push("/dashboard");
  };

  if (interests.length === 0) return null;

  const anySelected = Object.values(levels).some((v) => v !== null);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          Step 2 of 2
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          How well do you know each topic?
        </h1>
        <p className="mt-3 text-lg text-slate-500 dark:text-slate-400">
          This helps us set the right difficulty from the start. You can always change it later.
        </p>
      </div>

      <div className="space-y-6">
        {interests.map((interest) => {
          const selected = levels[interest.id];
          return (
            <div
              key={interest.id}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{interest.icon}</span>
                <h2 className="font-semibold text-slate-900 dark:text-white">{interest.label}</h2>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {LEVEL_OPTIONS.map((opt) => {
                  const isSelected = selected === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() =>
                        setLevels((prev) => ({
                          ...prev,
                          [interest.id]: isSelected ? null : opt.value,
                        }))
                      }
                      className={`rounded-lg border-2 px-4 py-3 text-left transition-all cursor-pointer ${
                        isSelected
                          ? opt.style
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                    >
                      <p className={`text-sm font-semibold ${isSelected ? "" : "text-slate-700 dark:text-slate-200"}`}>
                        {opt.label}
                      </p>
                      <p className={`text-xs mt-0.5 ${isSelected ? "opacity-80" : "text-slate-400 dark:text-slate-500"}`}>
                        {opt.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 flex flex-col items-center gap-3">
        <button
          onClick={handleContinue}
          className="rounded-lg bg-emerald-600 px-8 py-3 text-lg font-semibold text-white hover:bg-emerald-500 shadow-lg hover:shadow-xl transition-all cursor-pointer"
        >
          {anySelected ? "Let's go! →" : "Skip & start fresh →"}
        </button>
        {!anySelected && (
          <p className="text-sm text-slate-400 dark:text-slate-500">
            No ratings? No problem — we'll start everything at medium difficulty.
          </p>
        )}
      </div>
    </div>
  );
}
