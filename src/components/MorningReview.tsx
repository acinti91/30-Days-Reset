"use client";

import { useState, useEffect, useRef } from "react";
import type { CheckIn } from "@/lib/db";
import { getQuoteForDay } from "@/lib/stoic-quotes";
import { HABIT_INTRO_DAY } from "@/lib/plan-data";

interface Props {
  currentDay: number;
  yesterday: CheckIn | null;
  streaks: Record<string, number>;
  yesterdayActions: string[];
  yesterdayActionCompletions: Record<number, number>;
  onDismiss: () => void;
  onSaveYesterday: (data: { habits: Record<string, number>; reflections: { hardest: string; noticed: string; proud: string } }) => void;
}

const HABIT_LABELS: Record<string, { label: string; mode: "boolean" | "numeric"; unit?: string }> = {
  phone_out_bedroom: { label: "Phone out of bedroom", mode: "boolean" },
  morning_phone_free: { label: "Phone-free morning", mode: "boolean" },
  boredom_minutes: { label: "Practice 10 minutes of boredom", mode: "boolean" },
  meditation_minutes: { label: "Meditation", mode: "numeric", unit: "m" },
  phone_free_walk: { label: "Phone-free walk", mode: "boolean" },
  evening_journal: { label: "Evening journal", mode: "boolean" },
};

const STREAK_SHORT_LABELS: Record<string, string> = {
  phone_out_bedroom: "Phone out",
  morning_phone_free: "Phone-free AM",
  boredom_minutes: "Boredom",
  meditation_minutes: "Meditation",
  phone_free_walk: "Phone-free walk",
  evening_journal: "Journal",
};

const HABIT_KEYS = Object.keys(HABIT_LABELS);

export default function MorningReview({ currentDay, yesterday, streaks, yesterdayActions, yesterdayActionCompletions, onDismiss, onSaveYesterday }: Props) {
  const activeStreaks = Object.entries(streaks).filter(([, v]) => v > 0);
  const quote = getQuoteForDay(currentDay);

  // Only show habits that were active yesterday (currentDay - 1)
  const yesterdayDay = currentDay - 1;
  const activeHabitKeys = HABIT_KEYS.filter(
    (key) => (HABIT_INTRO_DAY[key] ?? 1) <= yesterdayDay
  );

  // Local state for yesterday's habits — initialized from prop or defaults
  const [habits, setHabits] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    for (const key of activeHabitKeys) {
      const val = yesterday?.[key as keyof CheckIn];
      init[key] = typeof val === "number" ? val : 0;
    }
    return init;
  });

  // Local state for yesterday's reflections
  const [reflections, setReflections] = useState({
    hardest: yesterday?.hardest ?? "",
    noticed: yesterday?.noticed ?? "",
    proud: yesterday?.proud ?? "",
  });

  // Sync habits when yesterday prop loads asynchronously
  useEffect(() => {
    if (!yesterday) return;
    setHabits(() => {
      const init: Record<string, number> = {};
      for (const key of activeHabitKeys) {
        const val = yesterday[key as keyof CheckIn];
        init[key] = typeof val === "number" ? val : 0;
      }
      return init;
    });
    setReflections({
      hardest: yesterday.hardest ?? "",
      noticed: yesterday.noticed ?? "",
      proud: yesterday.proud ?? "",
    });
  }, [yesterday, activeHabitKeys]);

  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Saving state for CTA confirmation
  const [saving, setSaving] = useState(false);

  const toggleBoolean = (key: string) => {
    setHabits((prev) => ({ ...prev, [key]: prev[key] === 1 ? 0 : 1 }));
  };

  const startNumericEdit = (key: string) => {
    setEditValue(String(habits[key] || ""));
    setEditingField(key);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const finishNumericEdit = (key: string) => {
    const num = Math.max(0, Number(editValue) || 0);
    setHabits((prev) => ({ ...prev, [key]: num }));
    setEditingField(null);
  };

  const handleDismiss = () => {
    setSaving(true);
    onSaveYesterday({ habits, reflections });
    setTimeout(() => {
      onDismiss();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pb-12 bg-background/95 animate-fade-in">
      <div className="pt-12 px-5 max-w-md w-full space-y-8 text-center">
        <div className="space-y-3">
          <p className="text-text-secondary text-sm">Good morning</p>
          <h1 className="font-serif text-5xl font-light">
            Day <span className="text-accent">{currentDay - 1}</span> Review
          </h1>
          <p className="text-text-secondary text-sm italic leading-relaxed">
            &ldquo;{quote.text}&rdquo;
            <br />
            <span className="text-xs not-italic">&mdash; {quote.author}</span>
          </p>
          <p className="text-text-secondary text-sm">
            Before starting today, let&apos;s review what you did yesterday.
          </p>
        </div>

        <div className="space-y-6">
          {/* Yesterday's actions — read-only review */}
          {yesterdayActions.length > 0 && (
            <div className="space-y-2">
              <p className="text-text-secondary text-xs uppercase tracking-widest">
                Yesterday&apos;s actions
              </p>
              <div className="space-y-1.5">
                {yesterdayActions.map((action, i) => {
                  const done = (yesterdayActionCompletions[i] ?? 0) > 0;
                  return (
                    <div
                      key={i}
                      className={`w-full flex items-center gap-2 text-sm py-2.5 px-3 rounded-lg ${
                        done
                          ? "text-foreground bg-accent/5"
                          : "text-text-secondary/60"
                      }`}
                    >
                      <span className="text-left flex-1">{action}</span>
                      {done && (
                        <span className="text-xs text-accent font-medium shrink-0">Done</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Yesterday's habits — interactive */}
          <div className="space-y-2">
            <p className="text-text-secondary text-xs uppercase tracking-widest">
              Yesterday&apos;s habits
            </p>
            <div className="space-y-1.5">
              {activeHabitKeys.map((key) => {
                const { label, mode, unit } = HABIT_LABELS[key];
                const val = habits[key];
                const done = val > 0;
                const isEditing = editingField === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      if (mode === "boolean") toggleBoolean(key);
                      else if (!isEditing) startNumericEdit(key);
                    }}
                    className={`w-full flex items-center gap-2 justify-center text-sm py-2.5 px-3 rounded-lg transition-colors ${
                      done
                        ? "text-foreground bg-accent/5"
                        : "text-text-secondary/60 hover:bg-surface-light"
                    }`}
                  >
                    <span className="flex-1 text-left">{label}</span>
                    {mode === "numeric" && isEditing ? (
                      <input
                        ref={inputRef}
                        type="number"
                        min={0}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => finishNumericEdit(key)}
                        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.blur()}
                        onClick={(e) => e.stopPropagation()}
                        className="w-20 bg-surface-light rounded-lg px-2 py-1 text-sm text-foreground text-center focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    ) : (
                      done && (
                        <span className="text-xs text-accent font-medium">Done</span>
                      )
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Yesterday's reflections — editable */}
          <div className="space-y-2">
            <p className="text-text-secondary text-xs uppercase tracking-widest">
              Yesterday&apos;s reflections
            </p>
            <div className="space-y-3 text-left">
              <div className="space-y-1">
                <label className="text-text-secondary text-xs">What was hardest</label>
                <textarea
                  value={reflections.hardest}
                  onChange={(e) => setReflections((prev) => ({ ...prev, hardest: e.target.value }))}
                  placeholder="What was the hardest part of yesterday?"
                  rows={2}
                  className="w-full bg-surface-light rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-text-secondary/40 focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-text-secondary text-xs">What felt different</label>
                <textarea
                  value={reflections.noticed}
                  onChange={(e) => setReflections((prev) => ({ ...prev, noticed: e.target.value }))}
                  placeholder="What did you notice or what felt different?"
                  rows={2}
                  className="w-full bg-surface-light rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-text-secondary/40 focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-text-secondary text-xs">What I&apos;m proud of</label>
                <textarea
                  value={reflections.proud}
                  onChange={(e) => setReflections((prev) => ({ ...prev, proud: e.target.value }))}
                  placeholder="What are you proud of from yesterday?"
                  rows={2}
                  className="w-full bg-surface-light rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-text-secondary/40 focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Streaks */}
          {activeStreaks.length > 0 && (
            <div className="space-y-2">
              <p className="text-text-secondary text-xs uppercase tracking-widest">
                Active Streaks
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {activeStreaks.map(([key, count]) => (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1.5 bg-surface rounded-full px-3 py-1 text-sm"
                  >
                    <span className="text-accent">🔥</span>
                    <span className="text-foreground">{count}</span>
                    <span className="text-text-secondary text-xs">
                      {STREAK_SHORT_LABELS[key] ?? HABIT_LABELS[key]?.label}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleDismiss}
          disabled={saving}
          className="bg-accent hover:bg-accent-muted text-background font-medium py-3 px-8 rounded-full transition-colors text-sm disabled:opacity-70"
        >
          {saving ? (
            <span className="inline-flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 13l4 4L19 7" />
              </svg>
              Saved!
            </span>
          ) : (
            <>Save &amp; Begin Day {currentDay}</>
          )}
        </button>
      </div>
    </div>
  );
}
