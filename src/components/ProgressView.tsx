"use client";

import { useState } from "react";
import type { CheckIn } from "@/lib/db";

function getCompletionPercent(checkIn: CheckIn): number {
  const booleans = [
    checkIn.phone_out_bedroom,
    checkIn.morning_phone_free,
    checkIn.phone_free_walk,
    checkIn.evening_journal,
  ];
  const boolCount = booleans.filter((v) => v === 1).length;
  const hasMeditation = checkIn.meditation_minutes > 0 ? 1 : 0;
  const hasBoredom = checkIn.boredom_minutes > 0 ? 1 : 0;
  return (boolCount + hasMeditation + hasBoredom) / 6;
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const width = 200;
  const height = 40;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - (v / max) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-10">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getDayNumber(entryDate: string, startDate: string): number {
  const start = new Date(startDate + "T12:00:00");
  const entry = new Date(entryDate + "T12:00:00");
  return Math.round((entry.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

export default function ProgressView({
  currentDay,
  checkIns,
  startDate,
}: {
  currentDay: number;
  checkIns: CheckIn[];
  startDate: string;
}) {
  const checkInMap = new Map(checkIns.map((c) => [c.date, c]));
  const meditationData = checkIns.map((c) => c.meditation_minutes);
  const boredomData = checkIns.map((c) => c.boredom_minutes);
  const journals = checkIns.filter((c) => c.hardest || c.noticed || c.proud);
  const [expandedJournal, setExpandedJournal] = useState<string | null>(null);

  return (
    <div className="px-5 pt-8 pb-28 max-w-lg mx-auto space-y-8">
      <h1 className="font-serif text-3xl font-light">Progress</h1>

      {/* 30-day grid */}
      <div className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-text-secondary">
          Completion Grid
        </h2>
        <div className="grid grid-cols-10 gap-1.5">
          {Array.from({ length: 30 }, (_, i) => {
            const dayNum = i + 1;
            const isFuture = dayNum > currentDay;
            // Find check-in for this day number by computing its date
            const allDates = checkIns.map((c) => c.date).sort();
            let opacity = 0;
            if (!isFuture) {
              // Try to find a check-in for this day
              const matchedCheckIn = allDates[i] ? checkInMap.get(allDates[i]) : undefined;
              opacity = matchedCheckIn ? getCompletionPercent(matchedCheckIn) : 0;
            }

            return (
              <div
                key={dayNum}
                className={`aspect-square rounded-sm ${
                  isFuture ? "bg-surface-light" : "bg-accent"
                }`}
                style={{
                  opacity: isFuture ? 0.2 : Math.max(0.15, opacity),
                }}
                title={`Day ${dayNum}`}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] text-text-secondary">
          <span>Day 1</span>
          <span>Day 30</span>
        </div>
      </div>

      {/* Sparklines */}
      {meditationData.length > 1 && (
        <div className="space-y-2">
          <h2 className="text-xs uppercase tracking-widest text-text-secondary">
            Meditation Minutes
          </h2>
          <div className="bg-surface rounded-xl p-4 border border-surface-light">
            <Sparkline data={meditationData} color="#D4A853" />
            <p className="text-right text-xs text-text-secondary mt-1">
              Total: {meditationData.reduce((a, b) => a + b, 0)} min
            </p>
          </div>
        </div>
      )}

      {boredomData.length > 1 && (
        <div className="space-y-2">
          <h2 className="text-xs uppercase tracking-widest text-text-secondary">
            Boredom Sitting Minutes
          </h2>
          <div className="bg-surface rounded-xl p-4 border border-surface-light">
            <Sparkline data={boredomData} color="#B8943F" />
            <p className="text-right text-xs text-text-secondary mt-1">
              Total: {boredomData.reduce((a, b) => a + b, 0)} min
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-surface rounded-xl p-3 border border-surface-light text-center">
          <p className="font-serif text-xl text-accent">{checkIns.length}</p>
          <p className="text-xs text-text-secondary mt-1">Check-ins</p>
        </div>
        <div className="bg-surface rounded-xl p-3 border border-surface-light text-center">
          <p className="font-serif text-xl text-accent">{currentDay}</p>
          <p className="text-xs text-text-secondary mt-1">Current Day</p>
        </div>
        <div className="bg-surface rounded-xl p-3 border border-surface-light text-center">
          <p className="font-serif text-xl text-accent">{30 - currentDay}</p>
          <p className="text-xs text-text-secondary mt-1">Days Left</p>
        </div>
      </div>

      {/* Journal entries */}
      {journals.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-text-secondary">
            Journal Entries
          </h2>
          <div className="space-y-2">
            {journals.map((entry) => {
              const dayNum = getDayNumber(entry.date, startDate);
              const isExpanded = expandedJournal === entry.date;
              const previewText = entry.hardest || entry.noticed || entry.proud || "";
              const preview = previewText.length > 60 ? previewText.slice(0, 60) + "..." : previewText;

              return (
                <button
                  key={entry.date}
                  type="button"
                  onClick={() => setExpandedJournal(isExpanded ? null : entry.date)}
                  className="w-full bg-surface rounded-xl border border-surface-light text-left transition-all hover:ring-1 hover:ring-accent/30 cursor-pointer"
                >
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-serif text-sm text-accent shrink-0">Day {dayNum}</span>
                      {!isExpanded && (
                        <span className="text-xs text-text-secondary truncate">{preview}</span>
                      )}
                    </div>
                    <svg
                      className={`w-4 h-4 text-text-secondary shrink-0 ml-2 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-2 border-t border-surface-light pt-3">
                      {entry.hardest && (
                        <div>
                          <p className="text-xs text-accent mb-0.5">What was hardest</p>
                          <p className="text-sm text-foreground">{entry.hardest}</p>
                        </div>
                      )}
                      {entry.noticed && (
                        <div>
                          <p className="text-xs text-accent mb-0.5">What felt different</p>
                          <p className="text-sm text-foreground">{entry.noticed}</p>
                        </div>
                      )}
                      {entry.proud && (
                        <div>
                          <p className="text-xs text-accent mb-0.5">What I&apos;m proud of</p>
                          <p className="text-sm text-foreground">{entry.proud}</p>
                        </div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
