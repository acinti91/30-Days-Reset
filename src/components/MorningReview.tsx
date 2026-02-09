"use client";

import { useState, useRef } from "react";
import type { CheckIn } from "@/lib/db";
import { getQuoteForDay } from "@/lib/stoic-quotes";

interface Props {
  currentDay: number;
  yesterday: CheckIn | null;
  streaks: Record<string, number>;
  onDismiss: () => void;
  onSaveYesterday: (habits: Record<string, number>) => void;
}

const HABIT_LABELS: Record<string, { label: string; mode: "boolean" | "numeric"; unit?: string }> = {
  phone_out_bedroom: { label: "Phone out of bedroom", mode: "boolean" },
  morning_phone_free: { label: "Phone-free morning", mode: "boolean" },
  boredom_minutes: { label: "Boredom practice", mode: "numeric", unit: "m" },
  meditation_minutes: { label: "Meditation", mode: "numeric", unit: "m" },
  phone_free_walk: { label: "Phone-free walk", mode: "boolean" },
  evening_journal: { label: "Evening journal", mode: "boolean" },
};

const HABIT_KEYS = Object.keys(HABIT_LABELS);

export default function MorningReview({ currentDay, yesterday, streaks, onDismiss, onSaveYesterday }: Props) {
  const activeStreaks = Object.entries(streaks).filter(([, v]) => v > 0);
  const quote = getQuoteForDay(currentDay);

  // Local state for yesterday's habits — initialized from prop or defaults
  const [habits, setHabits] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    for (const key of HABIT_KEYS) {
      const val = yesterday?.[key as keyof CheckIn];
      init[key] = typeof val === "number" ? val : 0;
    }
    return init;
  });

  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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
    onSaveYesterday(habits);
    onDismiss();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 animate-fade-in">
      <div className="px-5 max-w-md w-full space-y-8 text-center">
        <div className="space-y-3">
          <p className="text-text-secondary text-sm">Good morning</p>
          <h1 className="font-serif text-5xl font-light">
            Day <span className="text-accent">{currentDay}</span>
          </h1>
          <p className="text-text-secondary text-sm italic leading-relaxed">
            &ldquo;{quote.text}&rdquo;
            <br />
            <span className="text-xs not-italic">&mdash; {quote.author}</span>
          </p>
        </div>

        {/* Yesterday's habits — interactive */}
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-text-secondary text-xs uppercase tracking-widest">
              Yesterday&apos;s habits
            </p>
            <div className="space-y-1.5">
              {HABIT_KEYS.map((key) => {
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
                    {done ? (
                      <svg className="w-4 h-4 text-accent shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="9" />
                      </svg>
                    )}
                    <span>{label}</span>
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
                      mode === "numeric" && done && (
                        <span className="text-text-secondary text-xs">
                          {val}{unit}
                        </span>
                      )
                    )}
                  </button>
                );
              })}
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
                      {HABIT_LABELS[key]?.label.split(" ")[0]}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleDismiss}
          className="bg-accent hover:bg-accent-muted text-background font-medium py-3 px-8 rounded-full transition-colors text-sm"
        >
          Begin Day {currentDay}
        </button>
      </div>
    </div>
  );
}
