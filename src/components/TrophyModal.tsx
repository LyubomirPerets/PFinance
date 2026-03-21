"use client";

import { useEffect, useState } from "react";
import { Trophy } from "@/lib/gamification";

interface TrophyModalProps {
  readonly trophies: Trophy[];
  readonly topicLabel: string;
  readonly score: number;
  readonly onClose: () => void;
}

function trophyReason(trophyId: string, topicLabel: string, score: number): string {
  switch (trophyId) {
    case "first-quiz":
      return `You completed your first quiz on ${topicLabel}.`;
    case "perfect-score":
      return `You scored 100% on ${topicLabel}. Flawless!`;
    case "high-achiever":
      return `You've now scored 80%+ three times. Consistently excellent!`;
    case "explorer":
      return `You've now taken quizzes on 3 different topics.`;
    case "scholar":
      return `You've now taken quizzes on 5 different topics. True dedication!`;
    default:
      return "";
  }
}

export default function TrophyModal({ trophies, topicLabel, score, onClose }: TrophyModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Slight delay so the enter animation fires
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 300);
  }

  if (trophies.length === 0) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        visible ? "bg-black/60" : "bg-black/0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`mx-4 w-full max-w-sm rounded-2xl border border-yellow-500/40 bg-slate-900 p-8 shadow-2xl shadow-yellow-500/10 transition-all duration-300 ${
          visible ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-2 text-center text-4xl">🎉</div>
        <h2 className="mb-1 text-center text-2xl font-bold text-white">
          Trophy Unlocked!
        </h2>
        <p className="mb-6 text-center text-sm text-slate-400">
          You earned {trophies.length === 1 ? "a new trophy" : `${trophies.length} new trophies`}
        </p>

        <div className="space-y-3">
          {trophies.map((trophy) => (
            <div
              key={trophy.id}
              className="flex items-center gap-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3"
            >
              <span className="text-3xl">{trophy.icon}</span>
              <div>
                <p className="font-semibold text-yellow-300">{trophy.label}</p>
                <p className="text-sm text-slate-400">
                  {trophyReason(trophy.id, topicLabel, score)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleClose}
          className="mt-6 w-full rounded-lg bg-emerald-600 py-2.5 font-medium text-white hover:bg-emerald-500 transition-colors cursor-pointer"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
}
