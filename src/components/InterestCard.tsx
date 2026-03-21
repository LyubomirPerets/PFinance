"use client";

import { Interest } from "@/lib/interests";

interface InterestCardProps {
  interest: Interest;
  selected: boolean;
  onToggle: (id: string) => void;
}

export default function InterestCard({
  interest,
  selected,
  onToggle,
}: InterestCardProps) {
  return (
    <button
      onClick={() => onToggle(interest.id)}
      className={`relative flex flex-col items-start gap-2 rounded-xl border-2 p-5 text-left transition-all duration-200 cursor-pointer
        ${
          selected
            ? "border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100"
            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
        }`}
    >
      <div
        className={`absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded border-2 transition-colors
        ${
          selected
            ? "border-emerald-500 bg-emerald-500"
            : "border-gray-300 bg-white"
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
      <div>
        <h3 className="font-semibold text-gray-900">{interest.label}</h3>
        <p className="mt-1 text-sm text-gray-500">{interest.description}</p>
      </div>
    </button>
  );
}
