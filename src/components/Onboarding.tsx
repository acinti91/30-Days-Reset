"use client";

import { useState } from "react";

export default function Onboarding({
  onStart,
}: {
  onStart: (date: string, name: string) => void;
}) {
  const [date, setDate] = useState(() => {
    const now = new Date();
    return now.toISOString().split("T")[0];
  });
  const [name, setName] = useState("");

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-10">
        <div className="space-y-4">
          <h1 className="font-serif text-5xl font-light tracking-tight text-foreground">
            30 Days
          </h1>
          <h2 className="font-serif text-3xl font-light text-accent">
            of Silence
          </h2>
        </div>

        <p className="text-text-secondary text-sm leading-relaxed max-w-xs mx-auto">
          A personal companion for your dopamine reset journey. Thirty days of
          reclaiming your attention, one quiet moment at a time.
        </p>

        <div className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="user-name"
              className="text-text-secondary text-xs uppercase tracking-widest"
            >
              What should we call you?
            </label>
            <input
              id="user-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Optional"
              className="block w-full max-w-[240px] mx-auto bg-surface-light border border-surface-light rounded-lg px-4 py-3 text-center text-foreground placeholder:text-text-secondary/50 focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="start-date"
              className="text-text-secondary text-xs uppercase tracking-widest"
            >
              When do you begin?
            </label>
            <input
              id="start-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="block w-full max-w-[240px] mx-auto bg-surface-light border border-surface-light rounded-lg px-4 py-3 text-center text-foreground focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <button
            onClick={() => onStart(date, name.trim())}
            className="bg-accent hover:bg-accent-muted text-background font-medium px-10 py-3 rounded-full transition-colors text-sm tracking-wide active:scale-[0.98]"
          >
            Begin
          </button>
        </div>

        <p className="text-text-secondary text-xs opacity-50">
          Everything stays on your device. Nothing is shared.
        </p>
      </div>
    </div>
  );
}
