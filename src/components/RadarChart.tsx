"use client";

import { useMemo } from "react";
import { Interest } from "@/lib/interests";
import { QuizResult } from "@/lib/gamification";

interface RadarChartProps {
  interests: Interest[];
  history: QuizResult[];
}

// ── Geometry ──────────────────────────────────────────────────────────────────

const W = 560;
const H = 560;
const CX = W / 2;
const CY = H / 2;
const INNER_R = 24;   // dead-zone circle at center
const OUTER_R = 148;  // 100 % ring radius
const LABEL_R = 200;  // where icons + scores sit

const RINGS = [0.25, 0.5, 0.75, 1.0] as const;

function pt(angle: number, r: number) {
  return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
}

function scoreToR(score: number) {
  return INNER_R + (OUTER_R - INNER_R) * (score / 100);
}

function scoreHex(score: number) {
  if (score >= 80) return "#10b981";  // emerald
  if (score >= 60) return "#eab308";  // yellow
  return "#ef4444";                   // red
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function RadarChart({ interests, history }: RadarChartProps) {
  const N = interests.length;

  const data = useMemo(() => {
    return interests.map((interest, i) => {
      // Start from the top, go clockwise
      const angle = (2 * Math.PI * i) / N - Math.PI / 2;

      const topicHistory = history
        .filter((r) => r.topicId === interest.id && r.total > 0)
        .sort((a, b) => a.timestamp - b.timestamp);

      const avg =
        topicHistory.length > 0
          ? topicHistory.reduce((s, r) => s + r.score, 0) / topicHistory.length
          : null;

      const mainR = avg !== null ? scoreToR(avg) : INNER_R;
      const main = pt(angle, mainR);
      const label = pt(angle, LABEL_R);
      const outerEdge = pt(angle, OUTER_R + 6);

      // Recent quiz dots along this spoke (last 5)
      const dots = topicHistory.slice(-5).map((r) => ({
        ...pt(angle, scoreToR(r.score)),
        score: r.score,
        color: scoreHex(r.score),
      }));

      return { interest, angle, avg, main, label, outerEdge, dots };
    });
  }, [interests, history, N]);

  // Polygon connecting all average-score tips
  const polygon = data.map((d) => `${d.main.x},${d.main.y}`).join(" ");
  const hasAnyData = data.some((d) => d.avg !== null);

  return (
    <div className="mb-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
      <h2 className="mb-1 text-sm font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        Knowledge Radar
      </h2>
      {!hasAnyData && (
        <p className="mb-4 text-xs text-slate-400 dark:text-slate-500">
          Complete quizzes to fill in your radar.
        </p>
      )}

      <div className="flex justify-center">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full max-w-sm"
          style={{ overflow: "visible" }}
        >
          {/* ── Ring guides ── */}
          {RINGS.map((f) => {
            const r = INNER_R + (OUTER_R - INNER_R) * f;
            return (
              <circle
                key={f}
                cx={CX}
                cy={CY}
                r={r}
                fill="none"
                stroke="currentColor"
                strokeOpacity={f === 1.0 ? 0.18 : 0.07}
                strokeWidth={f === 1.0 ? 1.5 : 1}
                strokeDasharray={f < 1.0 ? "3 5" : undefined}
              />
            );
          })}

          {/* Ring % labels (only on outer ring, top position) */}
          {[25, 50, 75].map((pct) => {
            const r = INNER_R + (OUTER_R - INNER_R) * (pct / 100);
            return (
              <text
                key={pct}
                x={CX + 4}
                y={CY - r + 4}
                fontSize="9"
                fill="currentColor"
                fillOpacity={0.3}
                dominantBaseline="hanging"
              >
                {pct}%
              </text>
            );
          })}

          {/* ── Spoke guides ── */}
          {data.map((d, i) => (
            <line
              key={i}
              x1={CX}
              y1={CY}
              x2={d.outerEdge.x}
              y2={d.outerEdge.y}
              stroke="currentColor"
              strokeOpacity={0.09}
              strokeWidth={1}
            />
          ))}

          {/* ── Polygon fill ── */}
          <polygon
            points={polygon}
            fill="#10b981"
            fillOpacity={hasAnyData ? 0.1 : 0}
            stroke="#10b981"
            strokeWidth={hasAnyData ? 2 : 0}
            strokeOpacity={0.55}
            strokeLinejoin="round"
          />

          {/* ── Quiz-history dots along each spoke ── */}
          {data.map((d) =>
            d.dots.map((dot, j) => (
              <circle
                key={`${d.interest.id}-${j}`}
                cx={dot.x}
                cy={dot.y}
                r={3.5}
                fill={dot.color}
                opacity={0.35 + (j / Math.max(d.dots.length - 1, 1)) * 0.5}
              />
            ))
          )}

          {/* ── Average-score tip dots ── */}
          {data.map((d, i) => (
            <circle
              key={i}
              cx={d.main.x}
              cy={d.main.y}
              r={d.avg !== null ? 6 : 4}
              fill={d.avg !== null ? scoreHex(d.avg) : "currentColor"}
              fillOpacity={d.avg !== null ? 1 : 0.25}
              stroke="white"
              strokeWidth={1.5}
              strokeOpacity={d.avg !== null ? 0.8 : 0}
            />
          ))}

          {/* ── Labels: emoji + score ── */}
          {data.map((d, i) => {
            const cos = Math.cos(d.angle);
            const anchor =
              cos > 0.25 ? "start" : cos < -0.25 ? "end" : "middle";

            // Nudge emoji slightly away from center for tight top/bottom slots
            const emojiY = d.label.y - 10;
            const scoreY = d.label.y + 16;

            return (
              <g key={i}>
                {/* Emoji */}
                <text
                  x={d.label.x}
                  y={emojiY}
                  textAnchor={anchor}
                  dominantBaseline="middle"
                  fontSize="22"
                >
                  {d.interest.icon}
                </text>

                {/* Score or dash */}
                <text
                  x={d.label.x}
                  y={scoreY}
                  textAnchor={anchor}
                  dominantBaseline="middle"
                  fontSize="11"
                  fontWeight="600"
                  fill={d.avg !== null ? scoreHex(d.avg) : "currentColor"}
                  fillOpacity={d.avg !== null ? 1 : 0.3}
                >
                  {d.avg !== null ? `${Math.round(d.avg)}%` : "—"}
                </text>
              </g>
            );
          })}

          {/* Center circle */}
          <circle
            cx={CX}
            cy={CY}
            r={INNER_R}
            fill="currentColor"
            fillOpacity={0.04}
            stroke="currentColor"
            strokeOpacity={0.12}
            strokeWidth={1}
          />
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-2 flex justify-center flex-wrap gap-4 text-xs text-slate-400 dark:text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          80 %+ Advanced
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />
          60–79 % Intermediate
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
          Below 60 % Beginner
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-slate-400 inline-block opacity-40" />
          Dots = individual quiz scores
        </span>
      </div>
    </div>
  );
}
