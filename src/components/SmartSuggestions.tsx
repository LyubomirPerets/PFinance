"use client";

import Link from "next/link";
import { Interest } from "@/lib/interests";
import { GameState, getTopicMastery } from "@/lib/gamification";

interface Suggestion {
  interest: Interest;
  reason: string;
  cta: string;
  accent: string;
}

function buildSuggestions(interests: Interest[], game: GameState): Suggestion[] {
  // No history yet — nothing meaningful to suggest
  if (game.history.filter((r) => r.total > 0).length === 0) return [];

  const results: Suggestion[] = [];

  const notStarted = interests.filter(
    (i) => !game.history.some((r) => r.topicId === i.id)
  );
  const beginner = interests.filter(
    (i) => getTopicMastery(game.history, i.id) === "Beginner"
  );
  const intermediate = interests.filter(
    (i) => getTopicMastery(game.history, i.id) === "Intermediate"
  );

  // Prioritise: not started → beginner → intermediate
  if (notStarted.length > 0) {
    results.push({
      interest: notStarted[0],
      reason: "You haven't explored this topic yet — a great place to start.",
      cta: "Start Learning",
      accent: "emerald",
    });
  }
  if (beginner.length > 0 && results.length < 3) {
    results.push({
      interest: beginner[0],
      reason: "Your scores here are low. A bit more practice will make a big difference.",
      cta: "Keep Practicing",
      accent: "blue",
    });
  }
  if (notStarted.length > 1 && results.length < 3) {
    results.push({
      interest: notStarted[1],
      reason: "Another untouched topic — each one builds your financial foundation.",
      cta: "Start Learning",
      accent: "emerald",
    });
  }
  if (intermediate.length > 0 && results.length < 3) {
    results.push({
      interest: intermediate[0],
      reason: "You're close to mastery here. One more strong quiz and you'll level up.",
      cta: "Level Up",
      accent: "purple",
    });
  }

  return results.slice(0, 3);
}

const ACCENT_CLASSES: Record<string, { border: string; bg: string; text: string; btn: string }> = {
  emerald: {
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/5",
    text: "text-emerald-600 dark:text-emerald-400",
    btn: "bg-emerald-600 hover:bg-emerald-500",
  },
  blue: {
    border: "border-blue-500/30",
    bg: "bg-blue-500/5",
    text: "text-blue-600 dark:text-blue-400",
    btn: "bg-blue-600 hover:bg-blue-500",
  },
  purple: {
    border: "border-purple-500/30",
    bg: "bg-purple-500/5",
    text: "text-purple-600 dark:text-purple-400",
    btn: "bg-purple-600 hover:bg-purple-500",
  },
};

interface SmartSuggestionsProps {
  interests: Interest[];
  game: GameState;
}

export default function SmartSuggestions({ interests, game }: SmartSuggestionsProps) {
  const suggestions = buildSuggestions(interests, game);
  if (suggestions.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        What to study next
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {suggestions.map(({ interest, reason, cta, accent }) => {
          const a = ACCENT_CLASSES[accent];
          return (
            <div
              key={interest.id}
              className={`flex flex-col gap-3 rounded-xl border ${a.border} ${a.bg} p-5`}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{interest.icon}</span>
                <span className={`text-sm font-semibold ${a.text}`}>{interest.label}</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 flex-1">{reason}</p>
              <Link
                href={`/learn/${interest.id}`}
                className={`self-start rounded-lg ${a.btn} px-4 py-1.5 text-sm font-medium text-white transition-colors`}
              >
                {cta} →
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
