"use client";

import { useState } from "react";
import { Interest } from "@/lib/interests";

interface InterestCardProps {
  interest: Interest;
  selected: boolean;
  onToggle: (id: string) => void;
}

const getTooltipText = (id: string) => {
  const tooltips: Record<string, string> = {
    budgeting: "Learn how to create and manage budgets to control your spending effectively.",
    saving: "Master strategies to save money and build wealth over time.",
    investing: "Understand stocks, bonds, ETFs, and how to build a diversified portfolio.",
    debt: "Learn debt management strategies and how to pay off loans efficiently.",
    taxes: "Navigate tax planning and maximize your deductions and credits.",
    retirement: "Plan for retirement with strategies for 401(k)s, IRAs, and long-term savings.",
    credit: "Discover how credit scores work and strategies to improve yours.",
    insurance: "Learn about health, auto, life, and property insurance to protect yourself.",
    "real-estate": "Understand mortgages, home buying, renting, and property investment basics.",
    "side-income": "Explore freelancing, passive income streams, and side hustle opportunities.",
    "financial-literacy": "Master core financial concepts that every adult should know.",
    crypto: "Learn about Bitcoin, blockchain, and digital asset fundamentals.",
  };
  return tooltips[id] || "";
};

export default function InterestCard({
  interest,
  selected,
  onToggle,
}: InterestCardProps) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        zIndex: isHovering ? 50 : 1,
        isolation: "isolate",
      }}
    >
      <button
        onClick={() => onToggle(interest.id)}
        className={`relative flex flex-col items-start gap-2 rounded-xl border-2 p-5 text-left cursor-pointer w-full transition-all
          ${
            selected || isHovering
              ? "border-emerald-500 bg-emerald-50 dark:bg-slate-800 shadow-lg shadow-emerald-500/50"
              : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
          }`}
        style={{
          transform: isHovering ? "scale(1.5)" : "scale(1)",
          transformOrigin: "center center",
          willChange: "transform",
        }}
      >
        <div
          className={`absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded border-2 transition-colors duration-300
          ${
            selected || isHovering
              ? "border-emerald-500 bg-emerald-500"
              : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
          }`}
        >
          {selected && (
            <svg
              className="h-3 w-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
        <span className="text-2xl">{interest.icon}</span>
        <div className="w-full">
          <h3 className="font-semibold text-slate-900 dark:text-white">{interest.label}</h3>
          {isHovering && (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {getTooltipText(interest.id)}
            </p>
          )}
        </div>
      </button>
    </div>
  );
}
