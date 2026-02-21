"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Props {
  hardest: string;
  noticed: string;
  proud: string;
  onSave: (field: "hardest" | "noticed" | "proud", value: string) => void;
}

function AutoTextarea({
  label,
  value,
  placeholder,
  onSave,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onSave: (value: string) => void;
}) {
  const [text, setText] = useState(value);
  const [saved, setSaved] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Sync from parent when value changes externally
  useEffect(() => {
    setText(value);
  }, [value]);

  // Auto-resize
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  }, [text]);

  const handleBlur = useCallback(() => {
    if (text !== value) {
      onSave(text);
      setSaved(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setSaved(false), 2000);
    }
  }, [text, value, onSave]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs text-text-secondary">{label}</label>
        {saved && (
          <span className="text-xs text-accent animate-fade-in flex items-center gap-1">
            <svg className="w-3 h-3 animate-check-draw" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M5 13l4 4L19 7" />
            </svg>
            Saved
          </span>
        )}
      </div>
      <textarea
        ref={ref}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        rows={2}
        className="w-full bg-surface rounded-xl px-4 py-3 text-sm text-foreground border border-surface-light focus:outline-none focus:ring-1 focus:ring-accent resize-none leading-relaxed"
        placeholder={placeholder ?? "..."}
      />
    </div>
  );
}

export default function EveningReflection({ hardest, noticed, proud, onSave }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-xs uppercase tracking-widest text-text-secondary">
        Evening Reflection
      </h2>
      <AutoTextarea
        label="What was hardest today?"
        value={hardest}
        placeholder="The hardest moment was when..."
        onSave={(v) => onSave("hardest", v)}
      />
      <AutoTextarea
        label="What felt different from yesterday?"
        value={noticed}
        placeholder="Today I noticed..."
        onSave={(v) => onSave("noticed", v)}
      />
      <AutoTextarea
        label="What are you proud of today?"
        value={proud}
        placeholder="I'm proud that I..."
        onSave={(v) => onSave("proud", v)}
      />
    </div>
  );
}
