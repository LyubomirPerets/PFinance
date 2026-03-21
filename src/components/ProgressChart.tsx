"use client";

import { Interest } from "@/lib/interests";
import { QuizResult } from "@/lib/gamification";

interface ProgressChartProps {
  interests: Interest[];
  history: QuizResult[];
}

function avgScore(history: QuizResult[], topicId: string): number | null {
  const results = history.filter((r) => r.topicId === topicId && r.total > 0);
  if (results.length === 0) return null;
  return Math.round(results.reduce((s, r) => s + r.score, 0) / results.length);
}

function barColor(score: number): string {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-yellow-500";
  return "bg-red-500";
}

function scoreLabel(score: number): string {
  if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

export default function ProgressChart({ interests, history }: ProgressChartProps) {
  const topicsWithData = interests.filter((i) => avgScore(history, i.id) !== null);
  if (topicsWithData.length === 0) return null;

  return (
    <div className="mb-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        Quiz Performance
      </h2>
      <div className="space-y-3">
        {topicsWithData.map((interest) => {
          const score = avgScore(history, interest.id)!;
          const attempts = history.filter((r) => r.topicId === interest.id && r.total > 0).length;
          return (
            <div key={interest.id} className="flex items-center gap-3">
              <span className="text-lg w-6 shrink-0">{interest.icon}</span>
              <span className="w-28 shrink-0 text-sm text-slate-600 dark:text-slate-300 truncate">
                {interest.label}
              </span>
              <div className="flex-1 h-3 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${barColor(score)}`}
                  style={{ width: `${score}%` }}
                />
              </div>
              <span className={`w-12 text-right text-sm font-semibold shrink-0 ${scoreLabel(score)}`}>
                {score}%
              </span>
              <span className="w-14 text-right text-xs text-slate-400 dark:text-slate-500 shrink-0">
                {attempts} {attempts === 1 ? "quiz" : "quizzes"}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex gap-4 text-xs text-slate-400 dark:text-slate-500">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />80%+ Advanced</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block" />60–79% Intermediate</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />Below 60% Beginner</span>
      </div>
    </div>
  );
}
