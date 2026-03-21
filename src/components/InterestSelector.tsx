"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PERSONAL_FINANCE_INTERESTS } from "@/lib/interests";
import InterestCard from "./InterestCard";

export default function InterestSelector() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const router = useRouter();

  function handleToggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleContinue() {
    localStorage.setItem(
      "pfinance-interests",
      JSON.stringify(Array.from(selected))
    );
    router.push("/assess");
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Welcome to PFinance
        </h1>
        <p className="mt-3 text-lg text-slate-500 dark:text-slate-400">
          Your AI-powered personal finance tutor. Pick the topics you want to
          learn about.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 auto-rows-max">
        {PERSONAL_FINANCE_INTERESTS.map((interest) => (
          <InterestCard
            key={interest.id}
            interest={interest}
            selected={selected.has(interest.id)}
            onToggle={handleToggle}
          />
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center gap-3">
        <button
          onClick={handleContinue}
          disabled={selected.size === 0}
          className={`rounded-lg px-8 py-3 text-lg font-semibold text-white transition-all duration-200
            ${
              selected.size > 0
                ? "bg-emerald-600 hover:bg-emerald-500 shadow-lg hover:shadow-xl cursor-pointer"
                : "bg-slate-300 dark:bg-slate-700 cursor-not-allowed"
            }`}
        >
          Continue ({selected.size} selected)
        </button>
        {selected.size === 0 && (
          <p className="text-sm text-slate-400 dark:text-slate-500">
            Select at least one topic to continue
          </p>
        )}
      </div>
    </div>
  );
}
