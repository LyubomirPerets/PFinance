"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PERSONAL_FINANCE_INTERESTS, Interest } from "@/lib/interests";

export default function Dashboard() {
  const [interests, setInterests] = useState<Interest[]>([]);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("pfinance-interests");
    if (!stored) {
      router.push("/");
      return;
    }
    const ids: string[] = JSON.parse(stored);
    const matched = PERSONAL_FINANCE_INTERESTS.filter((i) =>
      ids.includes(i.id)
    );
    if (matched.length === 0) {
      router.push("/");
      return;
    }
    setInterests(matched);
  }, [router]);

  if (interests.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Dashboard</h1>
          <p className="mt-1 text-gray-500">
            Pick a topic to start learning with your AI tutor.
          </p>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("pfinance-interests");
            router.push("/");
          }}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          Change Interests
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {interests.map((interest) => (
          <div
            key={interest.id}
            className="group flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-emerald-300"
          >
            <span className="text-3xl">{interest.icon}</span>
            <h2 className="text-xl font-semibold text-gray-900">
              {interest.label}
            </h2>
            <p className="text-sm text-gray-500">{interest.description}</p>
            <Link
              href={`/learn/${interest.id}`}
              className="mt-auto self-start rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors inline-block"
            >
              Start Learning
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
