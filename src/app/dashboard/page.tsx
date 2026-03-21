"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PERSONAL_FINANCE_INTERESTS, Interest } from "@/lib/interests";
import {
  loadGameState,
  getLevel,
  getTopicMastery,
  TROPHIES,
  GameState,
  Mastery,
} from "@/lib/gamification";

const MASTERY_STYLES: Record<Mastery, { label: string; classes: string }> = {
  Beginner: {
    label: "Beginner",
    classes: "bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/30",
  },
  Intermediate: {
    label: "Intermediate",
    classes: "bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30",
  },
  Advanced: {
    label: "Advanced",
    classes: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-300 border border-yellow-500/30",
  },
};

export default function Dashboard() {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [game, setGame] = useState<GameState | null>(null);
  const [currentTopic, setCurrentTopic] = useState<Interest | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const router = useRouter();

  const handleReset = () => {
    localStorage.removeItem("pfinance-game");
    localStorage.removeItem("pfinance-current-topic");
    setGame({ xp: 0, history: [], trophies: [] });
    setCurrentTopic(null);
    setConfirmReset(false);
  };

  useEffect(() => {
    const stored = localStorage.getItem("pfinance-interests");
    if (!stored) {
      router.push("/");
      return;
    }
    const ids: string[] = JSON.parse(stored);
    const matched = PERSONAL_FINANCE_INTERESTS.filter((i) => ids.includes(i.id));
    if (matched.length === 0) {
      router.push("/");
      return;
    }
    setInterests(matched);
    setGame(loadGameState());

    const currentId = localStorage.getItem("pfinance-current-topic");
    if (currentId) {
      const found = PERSONAL_FINANCE_INTERESTS.find((i) => i.id === currentId);
      setCurrentTopic(found ?? null);
    }
  }, [router]);

  if (interests.length === 0) return null;

  const level = game ? getLevel(game.xp) : null;
  const earnedTrophies = game
    ? TROPHIES.filter((t) => game.trophies.includes(t.id))
    : [];

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Your Dashboard</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Pick a topic to start learning with your AI tutor.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {confirmReset ? (
            <>
              <span className="text-sm text-slate-500 dark:text-slate-400">Wipe all progress?</span>
              <button
                onClick={handleReset}
                className="rounded-lg border border-red-500/50 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                Yes, reset
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setConfirmReset(true)}
                className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:border-red-500/50 transition-colors cursor-pointer"
              >
                Reset Progress
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("pfinance-interests");
                  router.push("/");
                }}
                className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Change Interests
              </button>
            </>
          )}
        </div>
      </div>

      {/* In progress */}
      {currentTopic && (
        <div className="mb-5 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{currentTopic.icon}</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-500">
                In Progress
              </p>
              <p className="font-semibold text-slate-900 dark:text-white">{currentTopic.label}</p>
            </div>
          </div>
          <Link
            href={`/learn/${currentTopic.id}`}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
          >
            Continue →
          </Link>
        </div>
      )}

      {/* XP / Level bar */}
      {level && (
        <div className="mb-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                {level.level}
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{level.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{game!.xp} XP total</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {level.progress} / {level.xpForNext} XP to next level
              </p>
            </div>
          </div>
          <div className="w-full rounded-full bg-slate-200 dark:bg-slate-700 h-3">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500"
              style={{
                width: `${(level.progress / level.xpForNext) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Trophies */}
      {earnedTrophies.length > 0 && (
        <div className="mb-8 rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-yellow-600 dark:text-yellow-400">
            Trophies
          </h2>
          <div className="flex flex-wrap gap-3">
            {earnedTrophies.map((t) => (
              <div
                key={t.id}
                className="group flex items-center gap-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-2.5 transition-all duration-200 hover:bg-yellow-500/20 hover:border-yellow-500/50 cursor-default"
              >
                <span className="text-2xl">{t.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">{t.label}</p>
                  <p className="max-h-0 overflow-hidden text-xs text-yellow-600/70 dark:text-yellow-200/70 transition-all duration-200 group-hover:max-h-10 group-hover:mt-0.5">
                    {t.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Topic cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {interests.map((interest) => {
          const mastery = game ? getTopicMastery(game.history, interest.id) : null;
          const masteryStyle = mastery ? MASTERY_STYLES[mastery] : null;

          return (
            <div
              key={interest.id}
              className="group flex flex-col gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all hover:shadow-md hover:border-emerald-500/50"
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl">{interest.icon}</span>
                {masteryStyle && (
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${masteryStyle.classes}`}
                  >
                    {masteryStyle.label}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {interest.label}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{interest.description}</p>
              <Link
                href={`/learn/${interest.id}`}
                className="mt-auto self-start rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors inline-block"
              >
                {mastery ? "Continue Learning" : "Start Learning"}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
