"use client";

import { useState } from "react";
import type { CheckIn } from "@/lib/db";

interface Props {
  date: string;
  existing?: CheckIn | null;
  onSave: (data: Omit<CheckIn, "id" | "created_at">) => void;
  onClose: () => void;
}

export default function CheckInModal({ date, existing, onSave, onClose }: Props) {
  const [form, setForm] = useState({
    phone_out_bedroom: existing?.phone_out_bedroom ?? 0,
    morning_phone_free: existing?.morning_phone_free ?? 0,
    boredom_minutes: existing?.boredom_minutes ?? 0,
    meditation_minutes: existing?.meditation_minutes ?? 0,
    phone_free_walk: existing?.phone_free_walk ?? 0,
    evening_journal: existing?.evening_journal ?? 0,
    hardest: existing?.hardest ?? "",
    noticed: existing?.noticed ?? "",
  });

  const toggle = (key: keyof typeof form) => {
    if (typeof form[key] === "number" && key !== "boredom_minutes" && key !== "meditation_minutes") {
      setForm((f) => ({ ...f, [key]: f[key] === 1 ? 0 : 1 }));
    }
  };

  const handleSubmit = () => {
    onSave({ date, ...form });
    onClose();
  };

  const CheckBox = ({ label, field }: { label: string; field: keyof typeof form }) => (
    <button
      type="button"
      onClick={() => toggle(field)}
      className="flex items-center gap-3 w-full text-left py-2"
    >
      <div
        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          form[field] === 1
            ? "bg-accent border-accent"
            : "border-text-secondary"
        }`}
      >
        {form[field] === 1 && (
          <svg className="w-3 h-3 text-background" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-sm text-foreground">{label}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-surface rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[85dvh] overflow-y-auto p-6 space-y-5">
        <div className="flex justify-between items-center">
          <h2 className="font-serif text-2xl font-light">Daily Check-In</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-foreground p-1">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-text-secondary text-xs">{date}</p>

        <div className="space-y-1">
          <CheckBox label="Phone slept outside bedroom" field="phone_out_bedroom" />
          <CheckBox label="Phone-free morning" field="morning_phone_free" />
          <CheckBox label="Phone-free walk" field="phone_free_walk" />
          <CheckBox label="Evening journal" field="evening_journal" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-text-secondary">Boredom minutes</label>
            <input
              type="number"
              min={0}
              value={form.boredom_minutes}
              onChange={(e) => setForm((f) => ({ ...f, boredom_minutes: Number(e.target.value) }))}
              className="w-full bg-surface-light rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-text-secondary">Meditation minutes</label>
            <input
              type="number"
              min={0}
              value={form.meditation_minutes}
              onChange={(e) => setForm((f) => ({ ...f, meditation_minutes: Number(e.target.value) }))}
              className="w-full bg-surface-light rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-text-secondary">What was hardest today?</label>
          <textarea
            value={form.hardest}
            onChange={(e) => setForm((f) => ({ ...f, hardest: e.target.value }))}
            rows={2}
            className="w-full bg-surface-light rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent resize-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-text-secondary">What did you notice?</label>
          <textarea
            value={form.noticed}
            onChange={(e) => setForm((f) => ({ ...f, noticed: e.target.value }))}
            rows={2}
            className="w-full bg-surface-light rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent resize-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-accent hover:bg-accent-muted text-background font-medium py-3 rounded-full transition-colors text-sm"
        >
          Save Check-In
        </button>
      </div>
    </div>
  );
}
