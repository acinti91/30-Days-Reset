"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { DayInput } from "@/lib/plan-data";

interface Props {
  input: DayInput;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  comparisonValue?: string | null;
}

export default function ActionInput({ input, value, onChange, disabled, comparisonValue }: Props) {
  const [text, setText] = useState(value);
  const [saved, setSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Sync from parent when value changes externally
  useEffect(() => {
    setText(value);
  }, [value]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [text]);

  const handleBlur = useCallback(() => {
    if (text !== value) {
      onChange(text);
      setSaved(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setSaved(false), 2000);
    }
  }, [text, value, onChange]);

  return (
    <div className="ml-9 space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs text-text-secondary">{input.label}</label>
        {saved && (
          <span className="text-xs text-accent animate-fade-in flex items-center gap-1">
            <svg className="w-3 h-3 animate-check-draw" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M5 13l4 4L19 7" />
            </svg>
            Saved
          </span>
        )}
      </div>

      {comparisonValue && (
        <p className="text-xs text-text-secondary italic">
          Your Day 5 baseline: {comparisonValue} hours
        </p>
      )}

      {input.type === "textarea" ? (
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          disabled={disabled}
          rows={3}
          className="w-full bg-surface rounded-xl px-4 py-3 text-sm text-foreground border border-surface-light focus:outline-none focus:ring-1 focus:ring-accent resize-none leading-relaxed disabled:opacity-50"
          placeholder={input.placeholder ?? "..."}
        />
      ) : input.type === "number" ? (
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="0.1"
            min="0"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleBlur}
            disabled={disabled}
            className="w-24 bg-surface rounded-xl px-4 py-3 text-sm text-foreground border border-surface-light focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
            placeholder={input.placeholder ?? "0"}
          />
          {input.unit && (
            <span className="text-sm text-text-secondary">{input.unit}</span>
          )}
        </div>
      ) : (
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          disabled={disabled}
          className="w-full bg-surface rounded-xl px-4 py-3 text-sm text-foreground border border-surface-light focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
          placeholder={input.placeholder ?? "..."}
        />
      )}
    </div>
  );
}
