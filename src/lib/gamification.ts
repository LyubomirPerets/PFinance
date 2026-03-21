export interface QuizResult {
  topicId: string;
  score: number; // 0-100
  correct: number;
  total: number;
  timestamp: number;
}

export interface Trophy {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export interface GameState {
  xp: number;
  history: QuizResult[];
  trophies: string[];
}

export const TROPHIES: Trophy[] = [
  {
    id: "first-quiz",
    label: "First Steps",
    description: "Completed your first quiz",
    icon: "🎓",
  },
  {
    id: "perfect-score",
    label: "Perfect Score",
    description: "Got 100% on a quiz",
    icon: "💯",
  },
  {
    id: "high-achiever",
    label: "High Achiever",
    description: "Scored 80%+ three times",
    icon: "🏆",
  },
  {
    id: "explorer",
    label: "Explorer",
    description: "Completed quizzes on 3 different topics",
    icon: "🗺️",
  },
  {
    id: "scholar",
    label: "Scholar",
    description: "Completed quizzes on 5 different topics",
    icon: "📜",
  },
];

const LEVEL_NAMES = [
  "Novice",
  "Apprentice",
  "Scholar",
  "Expert",
  "Master",
  "Legend",
];
const XP_PER_LEVEL = 200;

export function getLevel(xp: number) {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const capped = Math.min(level, LEVEL_NAMES.length);
  const progress = xp % XP_PER_LEVEL;
  return {
    level: capped,
    name: LEVEL_NAMES[capped - 1],
    progress,
    xpForNext: XP_PER_LEVEL,
  };
}

export function calcXp(score: number, correct: number): number {
  const base = 50;
  const perCorrect = correct * 10;
  const perfectBonus = score === 100 ? 50 : 0;
  return base + perCorrect + perfectBonus;
}

export type Mastery = "Beginner" | "Intermediate" | "Advanced";

export function getTopicMastery(
  history: QuizResult[],
  topicId: string
): Mastery | null {
  const results = history.filter((r) => r.topicId === topicId);
  if (results.length === 0) return null;
  const avg = results.reduce((s, r) => s + r.score, 0) / results.length;
  if (avg >= 80) return "Advanced";
  if (avg >= 60) return "Intermediate";
  return "Beginner";
}

function loadState(): GameState {
  if (typeof window === "undefined")
    return { xp: 0, history: [], trophies: [] };
  try {
    const raw = localStorage.getItem("pfinance-game");
    return raw ? JSON.parse(raw) : { xp: 0, history: [], trophies: [] };
  } catch {
    return { xp: 0, history: [], trophies: [] };
  }
}

function saveState(state: GameState) {
  localStorage.setItem("pfinance-game", JSON.stringify(state));
}

/** Records a quiz result, awards XP, checks trophies.
 *  Returns newly unlocked trophies. */
export function recordQuiz(
  topicId: string,
  score: number,
  correct: number,
  total: number
): Trophy[] {
  const state = loadState();
  const earned = calcXp(score, correct);
  const result: QuizResult = {
    topicId,
    score,
    correct,
    total,
    timestamp: Date.now(),
  };

  state.xp += earned;
  state.history.push(result);

  const newTrophies = checkTrophies(state);
  newTrophies.forEach((t) => state.trophies.push(t.id));

  saveState(state);
  return newTrophies;
}

function checkTrophies(state: GameState): Trophy[] {
  const already = new Set(state.trophies);
  const unlocked: Trophy[] = [];

  const award = (id: string) => {
    if (!already.has(id)) {
      const t = TROPHIES.find((t) => t.id === id);
      if (t) unlocked.push(t);
    }
  };

  if (state.history.length >= 1) award("first-quiz");
  if (state.history.some((r) => r.score === 100)) award("perfect-score");
  if (state.history.filter((r) => r.score >= 80).length >= 3)
    award("high-achiever");

  const uniqueTopics = new Set(state.history.map((r) => r.topicId));
  if (uniqueTopics.size >= 3) award("explorer");
  if (uniqueTopics.size >= 5) award("scholar");

  return unlocked;
}

export function loadGameState(): GameState {
  return loadState();
}
