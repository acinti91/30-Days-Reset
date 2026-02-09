"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { getDayData } from "@/lib/plan-data";
import type { CheckIn } from "@/lib/db";
import { getAllStreaks } from "@/lib/streaks";
import MorningReview from "./MorningReview";
import HabitCard from "./HabitCard";
import EveningReflection from "./EveningReflection";

interface Props {
  currentDay: number;
  allCheckIns: CheckIn[];
  onSaveCheckIn: (data: Omit<CheckIn, "id" | "created_at">) => void;
  onOpenChat: () => void;
}

const HABITS = [
  { field: "phone_out_bedroom", label: "Phone slept outside bedroom", mode: "boolean" as const },
  { field: "morning_phone_free", label: "Phone-free morning", mode: "boolean" as const },
  { field: "boredom_minutes", label: "Boredom practice", mode: "numeric" as const, unit: "m" },
  { field: "meditation_minutes", label: "Meditation", mode: "numeric" as const, unit: "m" },
  { field: "phone_free_walk", label: "Phone-free walk", mode: "boolean" as const },
  { field: "evening_journal", label: "Evening journal", mode: "boolean" as const },
];

const DEFAULT_CHECKIN: Omit<CheckIn, "id" | "created_at" | "date"> = {
  phone_out_bedroom: 0,
  morning_phone_free: 0,
  boredom_minutes: 0,
  meditation_minutes: 0,
  phone_free_walk: 0,
  evening_journal: 0,
  hardest: "",
  noticed: "",
};

export default function TodayView({ currentDay, allCheckIns, onSaveCheckIn, onOpenChat }: Props) {
  const today = new Date().toISOString().split("T")[0];
  const dayData = getDayData(currentDay);

  // Local check-in state — the single source of truth for the current day
  const [localCheckIn, setLocalCheckIn] = useState<Omit<CheckIn, "id" | "created_at">>({
    date: today,
    ...DEFAULT_CHECKIN,
  });

  // Morning review visibility
  const [showMorningReview, setShowMorningReview] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem(`morning-review-dismissed-${today}`);
  });

  // Initialize local state from existing check-in data
  useEffect(() => {
    const existing = allCheckIns.find((c) => c.date === today);
    if (existing) {
      setLocalCheckIn({
        date: existing.date,
        phone_out_bedroom: existing.phone_out_bedroom,
        morning_phone_free: existing.morning_phone_free,
        boredom_minutes: existing.boredom_minutes,
        meditation_minutes: existing.meditation_minutes,
        phone_free_walk: existing.phone_free_walk,
        evening_journal: existing.evening_journal,
        hardest: existing.hardest,
        noticed: existing.noticed,
      });
      // If already checked in today, don't show morning review
      setShowMorningReview(false);
    }
  }, [allCheckIns, today]);

  // Yesterday's check-in
  const yesterday = useMemo(() => {
    const d = new Date(today + "T12:00:00");
    d.setDate(d.getDate() - 1);
    const yDate = d.toISOString().split("T")[0];
    return allCheckIns.find((c) => c.date === yDate) ?? null;
  }, [allCheckIns, today]);

  // Streaks
  const streaks = useMemo(
    () => getAllStreaks(allCheckIns, today),
    [allCheckIns, today]
  );

  // Save helper — merges a field change into local state and persists the full object
  const handleHabitChange = useCallback(
    (field: string, value: number) => {
      setLocalCheckIn((prev) => {
        const next = { ...prev, [field]: value };
        onSaveCheckIn(next);
        return next;
      });
    },
    [onSaveCheckIn]
  );

  const handleReflectionSave = useCallback(
    (field: "hardest" | "noticed", value: string) => {
      setLocalCheckIn((prev) => {
        const next = { ...prev, [field]: value };
        onSaveCheckIn(next);
        return next;
      });
    },
    [onSaveCheckIn]
  );

  const dismissMorningReview = useCallback(() => {
    sessionStorage.setItem(`morning-review-dismissed-${today}`, "1");
    setShowMorningReview(false);
  }, [today]);

  // Save yesterday's habits from morning review
  const handleSaveYesterday = useCallback(
    (habits: Record<string, number>) => {
      const d = new Date(today + "T12:00:00");
      d.setDate(d.getDate() - 1);
      const yDate = d.toISOString().split("T")[0];
      onSaveCheckIn({
        date: yDate,
        phone_out_bedroom: habits.phone_out_bedroom ?? 0,
        morning_phone_free: habits.morning_phone_free ?? 0,
        boredom_minutes: habits.boredom_minutes ?? 0,
        meditation_minutes: habits.meditation_minutes ?? 0,
        phone_free_walk: habits.phone_free_walk ?? 0,
        evening_journal: habits.evening_journal ?? 0,
        hardest: yesterday?.hardest ?? "",
        noticed: yesterday?.noticed ?? "",
      });
    },
    [onSaveCheckIn, today, yesterday]
  );

  if (!dayData) return null;

  const { day, week } = dayData;
  const progress = ((currentDay - 1) / 30) * 100;

  // Count completed habits for today
  const completedCount = HABITS.filter(
    (h) => (localCheckIn[h.field as keyof typeof localCheckIn] as number) > 0
  ).length;

  return (
    <>
      {/* Morning Review Overlay — outside scrollable container, only from Day 2+ */}
      {showMorningReview && currentDay >= 2 && (
        <MorningReview
          currentDay={currentDay}
          yesterday={yesterday}
          streaks={streaks}
          onDismiss={dismissMorningReview}
          onSaveYesterday={handleSaveYesterday}
        />
      )}

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

      {/* Habits Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-widest text-text-secondary">
            Daily Habits
          </h2>
          <span className="text-xs text-text-secondary">
            {completedCount}/{HABITS.length}
          </span>
        </div>
        <div className="space-y-2">
          {HABITS.map((habit) => (
            <HabitCard
              key={habit.field}
              field={habit.field}
              label={habit.label}
              mode={habit.mode}
              unit={habit.unit}
              value={localCheckIn[habit.field as keyof typeof localCheckIn] as number}
              streak={streaks[habit.field as keyof typeof streaks] ?? 0}
              onChange={handleHabitChange}
            />
          ))}
        </div>
      </div>

      {/* Evening Reflection */}
      <EveningReflection
        hardest={localCheckIn.hardest}
        noticed={localCheckIn.noticed}
        onSave={handleReflectionSave}
      />

      {/* Talk to Coach */}
      <button
        onClick={onOpenChat}
        className="w-full bg-surface-light hover:bg-surface border border-surface-light text-foreground px-5 py-3 rounded-full transition-colors text-sm"
      >
        Talk to Coach
      </button>
      </div>
    </>
  );
}
