"use client";

import { useState, useEffect } from "react";
import { getDayData } from "@/lib/plan-data";
import type { CheckIn } from "@/lib/db";
import CheckInModal from "./CheckInModal";

interface Props {
  currentDay: number;
  onSaveCheckIn: (data: Omit<CheckIn, "id" | "created_at">) => void;
  onOpenChat: () => void;
}

export default function TodayView({ currentDay, onSaveCheckIn, onOpenChat }: Props) {
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [existingCheckIn, setExistingCheckIn] = useState<CheckIn | null>(null);
  const dayData = getDayData(currentDay);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetch(`/api/checkin?date=${today}`)
      .then((r) => r.json())
      .then((data) => setExistingCheckIn(data));
  }, [today]);

  if (!dayData) return null;

  const { day, week } = dayData;
  const progress = ((currentDay - 1) / 30) * 100;

  return (
    <div className="px-5 pt-8 pb-28 max-w-lg mx-auto space-y-8">
      {/* Day Header */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h1 className="font-serif text-4xl font-light">
            Day <span className="text-accent">{currentDay}</span>
          </h1>
          <span className="text-text-secondary text-sm">{currentDay}/30</span>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-surface-light rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-text-secondary text-sm">
          Week {week.week}: {week.theme}
        </p>
      </div>

      {/* Focus */}
      <div className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-text-secondary">
          Today&apos;s Focus
        </h2>
        {day.focus.map((f, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
            <p className="text-foreground text-sm leading-relaxed">{f}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-text-secondary">
          Actions
        </h2>
        <div className="space-y-2">
          {day.actions.map((action, i) => (
            <div
              key={i}
              className="bg-surface rounded-xl p-4 border border-surface-light"
            >
              <p className="text-sm text-foreground leading-relaxed">{action}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Check-in status */}
      {existingCheckIn && (
        <div className="bg-surface rounded-xl p-4 border border-accent/20">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            <span className="text-sm text-accent">Checked in today</span>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowCheckIn(true)}
          className="flex-1 bg-accent hover:bg-accent-muted text-background font-medium py-3 rounded-full transition-colors text-sm"
        >
          {existingCheckIn ? "Update Check-In" : "Check In"}
        </button>
        <button
          onClick={onOpenChat}
          className="bg-surface-light hover:bg-surface border border-surface-light text-foreground px-5 py-3 rounded-full transition-colors text-sm"
        >
          Talk to Coach
        </button>
      </div>

      {showCheckIn && (
        <CheckInModal
          date={today}
          existing={existingCheckIn}
          onSave={(data) => {
            onSaveCheckIn(data);
            setExistingCheckIn({ ...data, id: existingCheckIn?.id } as CheckIn);
          }}
          onClose={() => setShowCheckIn(false)}
        />
      )}
    </div>
  );
}
