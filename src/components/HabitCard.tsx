"use client";

import { useState, useRef } from "react";

interface Props {
  label: string;
  field: string;
  value: number;
  mode: "boolean" | "numeric";
  unit?: string;
  streak: number;
  onChange: (field: string, value: number) => void;
}

export default function HabitCard({ label, field, value, mode, unit, streak, onChange }: Props) {
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(String(value || ""));
  const inputRef = useRef<HTMLInputElement>(null);
  const completed = value > 0;

  const handleBooleanTap = () => {
    onChange(field, value === 1 ? 0 : 1);
  };

  const handleNumericTap = () => {
    setLocalValue(String(value || ""));
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleNumericBlur = () => {
    setEditing(false);
    const num = Math.max(0, Number(localValue) || 0);
    onChange(field, num);
  };

  return (
    <button
      type="button"
      onClick={mode === "boolean" ? handleBooleanTap : editing ? undefined : handleNumericTap}
      className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all duration-150 min-h-[56px] active:scale-[0.98] ${
        completed
          ? "border-accent/30 bg-accent/5"
          : "border-surface-light bg-surface"
      }`}
    >
      {/* Check circle */}
      <div
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
          completed ? "bg-accent border-accent" : "border-text-secondary/50"
        }`}
      >
        {completed && (
          <svg className="w-3.5 h-3.5 text-background" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      {/* Label */}
      <span className={`text-sm flex-1 text-left ${completed ? "text-foreground" : "text-text-secondary"}`}>
        {label}
      </span>

      {/* Done indicator */}
      {completed && mode === "boolean" && (
        <span className="text-xs text-accent font-medium">Done</span>
      )}

      {/* Numeric input or value */}
      {mode === "numeric" && (
        editing ? (
          <input
            ref={inputRef}
            type="number"
            min={0}
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={handleNumericBlur}
            onKeyDown={(e) => e.key === "Enter" && inputRef.current?.blur()}
            onClick={(e) => e.stopPropagation()}
            className="w-16 bg-surface-light rounded-lg px-2 py-1 text-sm text-foreground text-center focus:outline-none focus:ring-1 focus:ring-accent"
          />
        ) : (
          value > 0 && (
            <span className="text-xs text-text-secondary">
              {value}{unit}
            </span>
          )
        )
      )}

      {/* Streak badge */}
      {streak > 0 && !editing && (
        <span className="inline-flex items-center gap-1 text-xs text-accent">
          🔥 {streak}
        </span>
      )}
    </button>
  );
}
