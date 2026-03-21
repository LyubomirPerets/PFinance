"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { recordQuiz, Trophy } from "@/lib/gamification";
import TrophyModal from "./TrophyModal";

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface QuizData {
  questions: Question[];
}

interface QuizProps {
  topic: string;
  topicLabel: string;
}

function calculateScore(questions: Question[], answers: number[]): { score: number; correct: number } {
  const correct = answers.filter((a, i) => a === questions[i].correct).length;
  return { score: Math.round((correct / questions.length) * 100), correct };
}

function scoreColor(score: number): string {
  if (score === 100) return "text-yellow-400";
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-blue-400";
  return "text-red-400";
}

function generateButtonLabel(loading: boolean, hasError: boolean): string {
  if (loading) return "Generating Quiz...";
  if (hasError) return "Try Again";
  return "Generate Quiz";
}

export default function Quiz({ topic, topicLabel }: QuizProps) {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [newTrophies, setNewTrophies] = useState<Trophy[]>([]);
  const [finalScore, setFinalScore] = useState(0);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [xpToast, setXpToast] = useState<number | null>(null);

  const generateQuiz = async () => {
    setLoading(true);
    setQuizError(null);
    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topicLabel, difficulty }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        setQuizError(data.error || "Failed to generate quiz. Please try again.");
      } else {
        setQuiz(data);
        setAnswers(new Array(data.questions.length).fill(-1));
        setCurrentQuestion(0);
        setShowResults(false);
        setNewTrophies([]);
      }
    } catch {
      const msg = navigator.onLine
        ? "Could not reach the server. Please try again."
        : "You're offline. Check your connection and try again.";
      setQuizError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const finishQuiz = () => {
    if (!quiz) return;
    const { score, correct } = calculateScore(quiz.questions, answers);
    const { xp, trophies: unlocked } = recordQuiz(topic, score, correct, quiz.questions.length);
    setFinalScore(score);
    setNewTrophies(unlocked);
    setXpToast(xp);
    setTimeout(() => setXpToast(null), 2500);

    if (score >= 80) {
      confetti({
        particleCount: score === 100 ? 200 : 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#10b981", "#34d399", "#6ee7b7", "#fbbf24", "#f59e0b"],
      });
    }

    setShowResults(true);
  };

  if (!quiz) {
    return (
      <div className="rounded-lg border border-slate-700 bg-slate-900 p-8 text-center">
        <h3 className="text-xl font-semibold text-white mb-4">Test Your Knowledge</h3>
        <p className="text-slate-400 mb-6">
          Generate an AI-powered quiz about {topicLabel} to test your understanding.
        </p>

        <div className="mb-6 flex justify-center gap-2">
          {(["easy", "medium", "hard"] as const).map((level) => {
            const activeColors: Record<string, string> = {
              easy: "bg-blue-600 text-white",
              medium: "bg-yellow-600 text-white",
              hard: "bg-red-600 text-white",
            };
            const activeClass = activeColors[level];
            const className = `rounded-lg px-5 py-2 text-sm font-medium capitalize transition-colors cursor-pointer ${
              difficulty === level ? activeClass : "border border-slate-600 text-slate-400 hover:border-slate-500"
            }`;
            return (
              <button key={level} onClick={() => setDifficulty(level)} className={className}>
                {level}
              </button>
            );
          })}
        </div>

        {quizError && (
          <p className="mb-4 rounded-lg border border-red-500/40 bg-red-900/30 px-4 py-3 text-sm text-red-300">
            {quizError}
          </p>
        )}
        <button
          onClick={generateQuiz}
          disabled={loading}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 disabled:bg-slate-700 transition-colors font-medium cursor-pointer"
        >
          {generateButtonLabel(loading, !!quizError)}
        </button>
      </div>
    );
  }

  if (showResults) {
    const { score, correct } = calculateScore(quiz.questions, answers);
    const color = scoreColor(score);

    return (
      <>
        {xpToast !== null && (
          <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 animate-bounce rounded-full border border-emerald-500/40 bg-emerald-900 px-6 py-2.5 text-sm font-bold text-emerald-300 shadow-xl">
            +{xpToast} XP
          </div>
        )}
        {newTrophies.length > 0 && (
          <TrophyModal trophies={newTrophies} topicLabel={topicLabel} score={finalScore} onClose={() => setNewTrophies([])} />
        )}
        <div className="rounded-lg border border-slate-700 bg-slate-900 p-8">
          <h3 className="text-2xl font-bold text-white mb-6">Quiz Results</h3>

          <div className="mb-8 text-center">
            <div className={`text-5xl font-bold mb-2 ${color}`}>
              {score}%
            </div>
            <p className="text-slate-300">
              You got {correct} out of {quiz.questions.length} questions correct!
            </p>
            {score === 100 && (
              <p className="mt-2 text-yellow-400 font-medium">🏆 Perfect score!</p>
            )}
            {score >= 80 && score < 100 && (
              <p className="mt-2 text-emerald-400 font-medium">🎉 Great job!</p>
            )}
          </div>

          <div className="space-y-6 mb-8">
            {quiz.questions.map((q, index) => (
              <div key={index} className="border border-slate-700 rounded-lg p-4 bg-slate-800">
                <p className="font-semibold text-white mb-2">
                  Question {index + 1}: {q.question}
                </p>
                <p className="text-sm mb-3">
                  <span className="font-medium text-slate-300">Your answer:</span>{" "}
                  <span
                    className={
                      answers[index] === q.correct ? "text-emerald-400" : "text-red-400"
                    }
                  >
                    {q.options[answers[index]] || "Not answered"}
                  </span>
                </p>
                {answers[index] !== q.correct && (
                  <p className="text-sm text-emerald-400 mb-2">
                    <span className="font-medium">Correct answer:</span>{" "}
                    {q.options[q.correct]}
                  </p>
                )}
                <p className="text-sm text-slate-300 bg-slate-700 p-3 rounded">
                  {q.explanation}
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setQuiz(null)}
              className="flex-1 px-6 py-2 bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 transition-colors font-medium cursor-pointer border border-slate-600"
            >
              Generate New Quiz
            </button>
            <button
              onClick={() => { setCurrentQuestion(0); setShowResults(false); }}
              className="flex-1 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors font-medium cursor-pointer"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      </>
    );
  }

  const question = quiz.questions[currentQuestion];
  const answered = answers[currentQuestion] !== -1;

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900 p-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-white">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </h3>
          <div className="text-sm text-slate-400">
            {answered ? "✓ Answered" : "○ Not answered"}
          </div>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all"
            style={{
              width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-white mb-6">
        {question.question}
      </h2>

      <div className="space-y-3 mb-8">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all cursor-pointer ${
              answers[currentQuestion] === index
                ? "border-emerald-500 bg-slate-800"
                : "border-slate-700 bg-slate-800 hover:border-slate-600"
            }`}
          >
            <div className="flex items-center">
              <div
                className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  answers[currentQuestion] === index
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-slate-600 bg-slate-700"
                }`}
              >
                {answers[currentQuestion] === index && (
                  <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
                )}
              </div>
              <span className="text-slate-100">{option}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="px-6 py-2 bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 disabled:bg-slate-700 disabled:text-slate-600 transition-colors font-medium cursor-pointer border border-slate-600"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={!answered}
          className="flex-1 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-600 transition-colors font-medium cursor-pointer"
        >
          {currentQuestion === quiz.questions.length - 1 ? "See Results" : "Next"}
        </button>
      </div>
    </div>
  );
}
