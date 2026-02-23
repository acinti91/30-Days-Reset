"use client";

import { useState } from "react";
import { planData } from "@/lib/plan-data";

interface PlanViewProps {
  currentDay: number;
  onDaySelect?: (day: number) => void;
}

export default function PlanView({ currentDay, onDaySelect }: PlanViewProps) {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(() => {
    const week = planData.find((w) => w.days.some((d) => d.day === currentDay));
    return week?.week ?? 1;
  });

  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  return (
    <div className="px-5 pt-8 pb-28 max-w-lg mx-auto space-y-6">
      <h1 className="font-serif text-3xl font-light">The Plan</h1>
      <p className="text-text-secondary text-sm leading-relaxed">
        Thirty days. Four phases. One quiet revolution.
      </p>

      <div className="space-y-4">
        {planData.map((week) => {
          const isExpanded = expandedWeek === week.week;
          const isCurrentWeek = week.days.some((d) => d.day === currentDay);

          return (
            <div
              key={week.week}
              className={`rounded-xl border transition-colors ${
                isCurrentWeek
                  ? "border-accent/30 bg-surface"
                  : "border-surface-light bg-surface"
              }`}
            >
              <button
                onClick={() => setExpandedWeek(isExpanded ? null : week.week)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-xl font-light">
                      Week {week.week}
                    </h2>
                    {isCurrentWeek && (
                      <span className="text-[10px] uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-accent text-sm mt-1">{week.theme}</p>
                </div>
                <svg
                  className={`w-5 h-5 text-text-secondary transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 space-y-5">
                  <p className="text-text-secondary text-sm leading-relaxed italic">
                    {week.rationale}
                  </p>

                  {/* Milestones */}
                  <div className="space-y-2">
                    <h3 className="text-xs uppercase tracking-widest text-text-secondary">
                      Milestones
                    </h3>
                    {week.milestones.map((m, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <div className="w-1 h-1 rounded-full bg-accent mt-2 shrink-0" />
                        <p className="text-sm text-foreground">{m}</p>
                      </div>
                    ))}
                  </div>

                  {/* Days */}
                  <div className="space-y-3">
                    {week.days.map((day) => {
                      const isPast = day.day < currentDay;
                      const isCurrent = day.day === currentDay;
                      const isUnlocked = isPast || isCurrent;
                      const isDayExpanded = expandedDay === day.day;

                      return (
                        <div
                          key={day.day}
                          onClick={() => setExpandedDay(isDayExpanded ? null : day.day)}
                          className={`rounded-lg p-4 cursor-pointer hover:ring-1 hover:ring-accent/30 transition-all ${
                            isCurrent
                              ? "bg-accent/10 border border-accent/20"
                              : "bg-surface-light"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`font-serif text-lg ${
                                isCurrent
                                  ? "text-accent"
                                  : isPast
                                  ? "text-text-secondary"
                                  : "text-foreground"
                              }`}
                            >
                              Day {day.day}
                            </span>
                            <span className="text-text-secondary text-sm">
                              {day.title}
                            </span>
                            {isPast && (
                              <svg
                                className="w-4 h-4 text-accent/50"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                              </svg>
                            )}
                            <svg
                                className={`w-4 h-4 text-text-secondary ml-auto transition-transform ${isDayExpanded ? "rotate-180" : ""}`}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M6 9l6 6 6-6" />
                              </svg>
                          </div>
                          <div className="space-y-1">
                            {day.focus.map((f, i) => (
                              <p
                                key={i}
                                className={`text-sm ${
                                  isPast ? "text-text-secondary" : "text-foreground"
                                }`}
                              >
                                {f}
                              </p>
                            ))}
                          </div>

                          {/* Expanded actions */}
                          {isDayExpanded && (
                            <div className="mt-3 pt-3 border-t border-surface-light/50 space-y-2" onClick={(e) => e.stopPropagation()}>
                              <p className="text-xs uppercase tracking-widest text-text-secondary">
                                Actions
                              </p>
                              {day.actions.map((action, i) => (
                                <div key={i} className="flex gap-2 items-start">
                                  <div className="w-1 h-1 rounded-full bg-accent/50 mt-2 shrink-0" />
                                  <p className={`text-sm ${isPast ? "text-text-secondary" : "text-foreground"}`}>
                                    {action}
                                  </p>
                                </div>
                              ))}
                              {isUnlocked && onDaySelect && (
                                <button
                                  onClick={() => onDaySelect(day.day)}
                                  className="mt-2 text-accent text-xs hover:text-accent-muted transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                  View Day {day.day} overview
                                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
