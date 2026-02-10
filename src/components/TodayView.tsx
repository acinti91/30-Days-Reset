"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { getDayData, HABIT_INTRO_DAY } from "@/lib/plan-data";
import type { CheckIn } from "@/lib/db";
import { getAllStreaks } from "@/lib/streaks";
import MorningReview from "./MorningReview";
import HabitCard from "./HabitCard";
import EveningReflection from "./EveningReflection";

interface Props {
  currentDay: number;
  viewingDay: number | null;
  startDate: string;
  allCheckIns: CheckIn[];
  onSaveCheckIn: (data: Omit<CheckIn, "id" | "created_at">) => void;
  onOpenChat: () => void;
  onDayChange: (day: number | null) => void;
}

const HABITS = [
  { field: "phone_out_bedroom", label: "Phone slept outside bedroom", mode: "boolean" as const, info: "Sleeping without your phone breaks the cycle of checking it first and last thing. It protects your most restorative hours from dopamine triggers." },
  { field: "morning_phone_free", label: "First hour phone-free", mode: "boolean" as const, info: "The first hour sets your brain's tone for the day. Avoiding screens lets your natural focus and motivation systems wake up undisturbed." },
  { field: "boredom_minutes", label: "Practice 10 minutes of boredome", mode: "numeric" as const, unit: "m", info: "Sitting with nothing to do rebuilds your tolerance for low stimulation — the core skill behind a dopamine reset." },
  { field: "meditation_minutes", label: "Meditation", mode: "numeric" as const, unit: "m", info: "Even a few minutes of focused attention strengthens the prefrontal cortex, giving you more control over impulses and cravings." },
  { field: "phone_free_walk", label: "Phone-free walk", mode: "boolean" as const, info: "Walking without input lets your mind wander and process. It's one of the fastest ways to lower baseline dopamine and reduce anxiety." },
  { field: "evening_journal", label: "Evening journal", mode: "boolean" as const, info: "Reflecting on your day consolidates learning and self-awareness. Writing what was hard and what shifted accelerates the reset." },
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

function SaveProgress({ completedCount, totalCount }: { completedCount: number; totalCount: number }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (saved) {
      const t = setTimeout(() => setSaved(false), 2000);
      return () => clearTimeout(t);
    }
  }, [saved]);

  if (completedCount === 0) return null;

  return (
    <button
      onClick={() => setSaved(true)}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-accent hover:bg-accent-muted text-background text-sm font-medium transition-all active:scale-[0.98]"
    >
      {saved ? (
        <>
          <svg className="w-4 h-4 text-background" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-background font-medium">Progress saved!</span>
        </>
      ) : (
        <span className="text-background">Save progress</span>
      )}
    </button>
  );
}

export default function TodayView({ currentDay, viewingDay, startDate, allCheckIns, onSaveCheckIn, onOpenChat, onDayChange }: Props) {
  const displayDay = viewingDay ?? currentDay;
  const isPastDay = displayDay < currentDay;

  // Compute the calendar date for displayDay from startDate
  const displayDate = useMemo(() => {
    const d = new Date(startDate + "T12:00:00");
    d.setDate(d.getDate() + (displayDay - 1));
    return d.toISOString().split("T")[0];
  }, [startDate, displayDay]);

  const today = new Date().toISOString().split("T")[0];
  const dayData = getDayData(displayDay);

  // Filter habits to only show those unlocked by the current display day
  const activeHabits = HABITS.filter(
    (h) => (HABIT_INTRO_DAY[h.field] ?? 1) <= displayDay
  );

  // Action completions state
  const [actionCompletions, setActionCompletions] = useState<Record<number, number>>({});

  // Local check-in state — the single source of truth for the displayed day
  const [localCheckIn, setLocalCheckIn] = useState<Omit<CheckIn, "id" | "created_at">>({
    date: displayDate,
    ...DEFAULT_CHECKIN,
  });

  // Morning review visibility (only for current day)
  const [showMorningReview, setShowMorningReview] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem(`morning-review-dismissed-${today}`);
  });

  // Initialize local state from existing check-in data
  useEffect(() => {
    const existing = allCheckIns.find((c) => c.date === displayDate);
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
      if (!isPastDay) setShowMorningReview(false);
    } else {
      // Reset to defaults when switching to a day with no check-in
      setLocalCheckIn({ date: displayDate, ...DEFAULT_CHECKIN });
    }
  }, [allCheckIns, displayDate, isPastDay]);

  // Fetch action completions for displayed day
  useEffect(() => {
    fetch(`/api/actions?date=${displayDate}&day=${displayDay}`)
      .then((r) => r.json())
      .then((rows: { action_index: number; completed: number }[]) => {
        const map: Record<number, number> = {};
        rows.forEach((r) => (map[r.action_index] = r.completed));
        setActionCompletions(map);
      })
      .catch(() => {});
  }, [displayDate, displayDay]);

  // Yesterday's action completions (only needed for current day's morning review)
  const [yesterdayActionCompletions, setYesterdayActionCompletions] = useState<Record<number, number>>({});
  const yesterdayDayData = useMemo(() => getDayData(currentDay - 1), [currentDay]);

  useEffect(() => {
    if (isPastDay || currentDay < 2) return;
    const d = new Date(today + "T12:00:00");
    d.setDate(d.getDate() - 1);
    const yDate = d.toISOString().split("T")[0];
    fetch(`/api/actions?date=${yDate}&day=${currentDay - 1}`)
      .then((r) => r.json())
      .then((rows: { action_index: number; completed: number }[]) => {
        const map: Record<number, number> = {};
        rows.forEach((r) => (map[r.action_index] = r.completed));
        setYesterdayActionCompletions(map);
      })
      .catch(() => {});
  }, [today, currentDay, isPastDay]);

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
      if (isPastDay) return;
      setLocalCheckIn((prev) => {
        const next = { ...prev, [field]: value };
        onSaveCheckIn(next);
        return next;
      });
    },
    [onSaveCheckIn, isPastDay]
  );

  const handleActionToggle = useCallback(
    (field: string, value: number) => {
      if (isPastDay) return;
      const actionIndex = Number(field);
      setActionCompletions((prev) => ({ ...prev, [actionIndex]: value }));
      fetch("/api/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: displayDate, dayNumber: displayDay, actionIndex, completed: value }),
      }).catch(() => {});
    },
    [displayDate, displayDay, isPastDay]
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
  const progress = ((displayDay - 1) / 30) * 100;

  // Count completed habits + actions for today
  const completedHabits = activeHabits.filter(
    (h) => (localCheckIn[h.field as keyof typeof localCheckIn] as number) > 0
  ).length;
  const completedActions = dayData
    ? dayData.day.actions.filter((_, i) => actionCompletions[i] > 0).length
    : 0;
  const completedCount = completedHabits + completedActions;
  const totalCount = activeHabits.length + (dayData ? dayData.day.actions.length : 0);

  return (
    <>
      {/* Morning Review Overlay — outside scrollable container, only from Day 2+ on current day */}
      {!isPastDay && showMorningReview && currentDay >= 2 && (
        <MorningReview
          currentDay={currentDay}
          yesterday={yesterday}
          streaks={streaks}
          yesterdayActions={yesterdayDayData?.day.actions ?? []}
          yesterdayActionCompletions={yesterdayActionCompletions}
          todayCoachIntro={dayData?.day.coachIntro ?? ""}
          onDismiss={dismissMorningReview}
          onSaveYesterday={handleSaveYesterday}
        />
      )}

      <div className="px-5 pt-8 pb-28 max-w-lg mx-auto space-y-8">
      {/* Day Header */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h1 className="font-serif text-4xl font-light">
            Day <span className="text-accent">{displayDay}</span>
            {isPastDay && <span className="text-text-secondary text-lg ml-2">(past)</span>}
          </h1>
          <span className="text-text-secondary text-sm">{displayDay}/30</span>
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
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-widest text-text-secondary">
            Actions
          </h2>
          <span className="text-xs text-text-secondary">
            {day.actions.filter((_, i) => actionCompletions[i] > 0).length}/{day.actions.length}
          </span>
        </div>
        <div className="space-y-2">
          {day.actions.map((action, i) => (
            <HabitCard
              key={i}
              field={String(i)}
              label={action}
              mode="boolean"
              value={actionCompletions[i] ?? 0}
              onChange={handleActionToggle}
            />
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
            {completedHabits}/{activeHabits.length}
          </span>
        </div>
        <div className="space-y-2">
          {activeHabits.map((habit) => {
            const isNew = (HABIT_INTRO_DAY[habit.field] ?? 1) === displayDay;
            return (
              <HabitCard
                key={habit.field}
                field={habit.field}
                label={habit.label}
                mode={habit.mode}
                unit={habit.unit}
                info={habit.info}
                isNew={isNew}
                value={localCheckIn[habit.field as keyof typeof localCheckIn] as number}
                streak={streaks[habit.field as keyof typeof streaks] ?? 0}
                onChange={handleHabitChange}
              />
            );
          })}
        </div>
      </div>

      {/* Evening Reflection — current day only */}
      {!isPastDay && (
        <EveningReflection
          hardest={localCheckIn.hardest}
          noticed={localCheckIn.noticed}
          onSave={handleReflectionSave}
        />
      )}

      {/* Save Progress — current day only */}
      {!isPastDay && <SaveProgress completedCount={completedCount} totalCount={totalCount} />}

      {/* Talk to Coach — current day only */}
      {!isPastDay && (
        <button
          onClick={onOpenChat}
          className="w-full bg-surface-light hover:bg-surface border border-surface-light text-text-secondary px-5 py-3 rounded-full transition-colors text-sm -mt-4"
        >
          Talk to Coach about your day
        </button>
      )}

      {/* Prev / Next day navigation */}
      <div className="flex justify-between items-center pt-2">
        {displayDay > 1 ? (
          <button
            onClick={() => onDayChange(displayDay - 1)}
            className="text-text-secondary text-sm hover:text-foreground transition-colors"
          >
            &larr; Day {displayDay - 1}
          </button>
        ) : <span />}
        {displayDay < currentDay ? (
          <button
            onClick={() => onDayChange(displayDay + 1)}
            className="text-text-secondary text-sm hover:text-foreground transition-colors"
          >
            Day {displayDay + 1} &rarr;
          </button>
        ) : <span />}
      </div>
      {isPastDay && (
        <div className="text-center">
          <button
            onClick={() => onDayChange(null)}
            className="text-accent text-sm hover:text-accent-muted transition-colors"
          >
            Back to today &rarr;
          </button>
        </div>
      )}
      </div>
    </>
  );
}
