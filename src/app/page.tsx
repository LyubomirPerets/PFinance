import InterestSelector from "@/components/InterestSelector";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="w-full max-w-4xl px-6 pt-20 pb-10 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />{" "}
          AI-powered learning
        </div>
        <h1 className="mt-4 text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
          Master your{" "}
          <span className="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
            finances
          </span>
        </h1>
        <p className="mt-5 text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Your personal AI tutor for personal finance. Learn at your own pace,
          test your knowledge, and track your progress.
        </p>
        <div className="mt-8 flex justify-center gap-8 text-sm text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 dark:text-emerald-400">✓</span> AI-powered explanations
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 dark:text-emerald-400">✓</span> Adaptive quizzes
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 dark:text-emerald-400">✓</span> Track your progress
          </div>
        </div>
      </div>

      <div className="w-full border-t border-slate-200 dark:border-slate-800 pt-10">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-8">
          Choose your topics to get started
        </p>
        <InterestSelector />
      </div>
    </main>
  );
}
