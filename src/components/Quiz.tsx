"use client";

import { useState } from "react";

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

export default function Quiz({ topic, topicLabel }: QuizProps) {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  const generateQuiz = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topicLabel }),
      });

      const data = await response.json();
      if (data.error) {
        alert(`Error: ${data.error}`);
      } else {
        setQuiz(data);
        setAnswers(new Array(data.questions.length).fill(-1));
        setCurrentQuestion(0);
        setShowResults(false);
      }
    } catch (error) {
      alert("Failed to generate quiz. Please try again.");
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
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    if (!quiz) return 0;
    let correct = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correct) correct++;
    });
    return Math.round((correct / quiz.questions.length) * 100);
  };

  if (!quiz) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Test Your Knowledge
        </h3>
        <p className="text-gray-600 mb-6">
          Generate an AI-powered quiz about {topicLabel} to test your understanding.
        </p>
        <button
          onClick={generateQuiz}
          disabled={loading}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 transition-colors font-medium cursor-pointer"
        >
          {loading ? "Generating Quiz..." : "Generate Quiz"}
        </button>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Quiz Results</h3>

        <div className="mb-8 text-center">
          <div className="text-5xl font-bold text-emerald-600 mb-2">
            {score}%
          </div>
          <p className="text-gray-600">
            You got {answers.filter((a, i) => a === quiz.questions[i].correct).length} out of{" "}
            {quiz.questions.length} questions correct!
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {quiz.questions.map((q, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <p className="font-semibold text-gray-900 mb-2">
                Question {index + 1}: {q.question}
              </p>
              <p className="text-sm mb-3">
                <span className="font-medium">Your answer:</span>{" "}
                <span
                  className={
                    answers[index] === q.correct
                      ? "text-emerald-600"
                      : "text-red-600"
                  }
                >
                  {q.options[answers[index]] || "Not answered"}
                </span>
              </p>
              {answers[index] !== q.correct && (
                <p className="text-sm text-emerald-600 mb-2">
                  <span className="font-medium">Correct answer:</span>{" "}
                  {q.options[q.correct]}
                </p>
              )}
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                {q.explanation}
              </p>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setQuiz(null)}
            className="flex-1 px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium cursor-pointer"
          >
            Generate New Quiz
          </button>
          <button
            onClick={() => setCurrentQuestion(0)}
            className="flex-1 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium cursor-pointer"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const answered = answers[currentQuestion] !== -1;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </h3>
          <div className="text-sm text-gray-600">
            {answered
              ? "✓ Answered"
              : "○ Not answered"}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-emerald-600 h-2 rounded-full transition-all"
            style={{
              width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {question.question}
      </h2>

      <div className="space-y-3 mb-8">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all cursor-pointer ${
              answers[currentQuestion] === index
                ? "border-emerald-600 bg-emerald-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex items-center">
              <div
                className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  answers[currentQuestion] === index
                    ? "border-emerald-600 bg-emerald-600"
                    : "border-gray-300"
                }`}
              >
                {answers[currentQuestion] === index && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <span className="text-gray-900">{option}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition-colors font-medium cursor-pointer"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={!answered}
          className="flex-1 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 transition-colors font-medium cursor-pointer"
        >
          {currentQuestion === quiz.questions.length - 1
            ? "See Results"
            : "Next"}
        </button>
      </div>
    </div>
  );
}
