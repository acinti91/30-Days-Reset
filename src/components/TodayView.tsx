"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { getDayData, HABIT_INTRO_DAY } from "@/lib/plan-data";
import type { DayInput } from "@/lib/plan-data";
import type { CheckIn } from "@/lib/db";
import { getAllStreaks } from "@/lib/streaks";
import MorningReview from "./MorningReview";
import HabitCard from "./HabitCard";
import ActionInput from "./ActionInput";
import EveningReflection from "./EveningReflection";

interface Props {
  currentDay: number;
  viewingDay: number | null;
  startDate: string;
  allCheckIns: CheckIn[];
  onSaveCheckIn: (data: Omit<CheckIn, "id" | "created_at">) => void;
  onOpenChat: () => void;
  onDayChange: (day: number | null) => void;
  userName?: string | null;
  gapInfo?: { missedDays: number; lastActiveDay: number } | null;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const HABITS = [
  { field: "phone_out_bedroom", label: "Phone slept outside bedroom", mode: "boolean" as const, info: "Sleeping without your phone breaks the cycle of checking it first and last thing. It protects your most restorative hours from dopamine triggers." },
  { field: "morning_phone_free", label: "First hour phone-free", mode: "boolean" as const, info: "The first hour sets your brain's tone for the day. Avoiding screens lets your natural focus and motivation systems wake up undisturbed." },
  { field: "boredom_minutes", label: "Practice 10 minutes of boredom", mode: "boolean" as const, info: "Sitting with nothing to do rebuilds your tolerance for low stimulation — the core skill behind a dopamine reset." },
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
  proud: "",
};

function CloseYourDay({
  completedCount,
  totalCount,
  displayDay,
  displayDate,
  onSave,
}: {
  completedCount: number;
  totalCount: number;
  displayDay: number;
  displayDate: string;
  onSave: () => void;
}) {
  const storageKey = `day-closed-${displayDate}`;
  const [phase, setPhase] = useState<"idle" | "summary" | "closed">(() => {
    if (typeof window === "undefined") return "idle";
    return sessionStorage.getItem(storageKey) ? "closed" : "idle";
  });

  // Reset phase when day changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    setPhase(sessionStorage.getItem(storageKey) ? "closed" : "idle");
  }, [storageKey]);

  const handleClose = useCallback(() => {
    onSave();
    setPhase("summary");
    sessionStorage.setItem(storageKey, "1");
    setTimeout(() => setPhase("closed"), 2500);
  }, [onSave, storageKey]);

  if (completedCount === 0 && phase === "idle") return null;

  if (phase === "summary") {
    return (
      <div className="animate-fade-up-in text-center space-y-2 py-4">
        <div className="flex items-center justify-center gap-2">
          <svg className="w-5 h-5 text-accent animate-check-draw" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-foreground font-medium">Day {displayDay} complete</span>
        </div>
        <p className="text-text-secondary text-sm">{completedCount} of {totalCount} completed</p>
      </div>
    );
  }

  if (phase === "closed") {
    return (
      <div className="text-center py-3">
        <span className="text-text-secondary text-sm flex items-center justify-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M5 13l4 4L19 7" />
          </svg>
          Day closed
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={handleClose}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-accent hover:bg-accent-muted text-background text-sm font-medium transition-all active:scale-[0.98]"
    >
      Close your day
    </button>
  );
}

export default function TodayView({ currentDay, viewingDay, startDate, allCheckIns, onSaveCheckIn, onOpenChat, onDayChange, userName, gapInfo }: Props) {
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

  // Action responses state (for day-specific text inputs)
  const [actionResponses, setActionResponses] = useState<Record<number, string>>({});

  // Day 5 screen time baseline for Day 14 comparison
  const [day5ScreenTime, setDay5ScreenTime] = useState<string | null>(null);

  // Local check-in state — the single source of truth for the displayed day
  const [localCheckIn, setLocalCheckIn] = useState<Omit<CheckIn, "id" | "created_at">>({
    date: displayDate,
    ...DEFAULT_CHECKIN,
  });

  // Edit mode for past days
  const [editing, setEditing] = useState(false);

  // Coach intro expanded state
  const [introExpanded, setIntroExpanded] = useState(false);

  // Whether this past day has an existing check-in
  const hasExistingCheckIn = useMemo(
    () => allCheckIns.some((c) => c.date === displayDate),
    [allCheckIns, displayDate]
  );

  // Reset editing when switching days; auto-enable for empty past days
  useEffect(() => {
    if (isPastDay && !allCheckIns.some((c) => c.date === displayDate)) {
      setEditing(true);
    } else {
      setEditing(false);
    }
  }, [displayDay, isPastDay, allCheckIns, displayDate]);

  // Morning review visibility (only for current day)
  const [showMorningReview, setShowMorningReview] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem(`morning-review-dismissed-${today}`);
  });

  // Day N begins interstitial
  const [showDayBegins, setShowDayBegins] = useState(false);

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
        proud: existing.proud ?? "",
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
      .then((rows: { action_index: number; completed: number; response_text?: string | null }[]) => {
        const compMap: Record<number, number> = {};
        const respMap: Record<number, string> = {};
        rows.forEach((r) => {
          compMap[r.action_index] = r.completed;
          if (r.response_text) respMap[r.action_index] = r.response_text;
        });
        setActionCompletions(compMap);
        setActionResponses(respMap);
      })
      .catch(() => {});
  }, [displayDate, displayDay]);

  // Fetch Day 5 screen time baseline when viewing Day 14
  useEffect(() => {
    if (displayDay !== 14) { setDay5ScreenTime(null); return; }
    fetch("/api/actions/response?day=5&action=0")
      .then((r) => r.json())
      .then((data: { response: string | null }) => setDay5ScreenTime(data.response))
      .catch(() => {});
  }, [displayDay]);

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
      if (isPastDay && !editing) return;
      setLocalCheckIn((prev) => {
        const next = { ...prev, [field]: value };
        onSaveCheckIn(next);
        return next;
      });
    },
    [onSaveCheckIn, isPastDay, editing]
  );

  const handleActionToggle = useCallback(
    (field: string, value: number) => {
      if (isPastDay && !editing) return;
      const actionIndex = Number(field);
      setActionCompletions((prev) => ({ ...prev, [actionIndex]: value }));
      fetch("/api/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: displayDate, dayNumber: displayDay, actionIndex, completed: value }),
      }).catch(() => {});
    },
    [displayDate, displayDay, isPastDay, editing]
  );

  const handleActionResponse = useCallback(
    (actionIndex: number, value: string) => {
      setActionResponses((prev) => ({ ...prev, [actionIndex]: value }));
      fetch("/api/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: displayDate,
          dayNumber: displayDay,
          actionIndex,
          completed: actionCompletions[actionIndex] ?? 1,
          responseText: value,
        }),
      }).catch(() => {});
    },
    [displayDate, displayDay, actionCompletions]
  );

  const handleReflectionSave = useCallback(
    (field: "hardest" | "noticed" | "proud", value: string) => {
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
    setShowDayBegins(true);
    window.scrollTo(0, 0);
    setTimeout(() => setShowDayBegins(false), 3200);
  }, [today]);

  // Save yesterday's habits, reflections, and actions from morning review
  const handleSaveYesterday = useCallback(
    (data: { habits: Record<string, number>; reflections: { hardest: string; noticed: string; proud: string }; actions: Record<number, number> }) => {
      const d = new Date(today + "T12:00:00");
      d.setDate(d.getDate() - 1);
      const yDate = d.toISOString().split("T")[0];
      const yDay = currentDay - 1;
      onSaveCheckIn({
        date: yDate,
        phone_out_bedroom: data.habits.phone_out_bedroom ?? 0,
        morning_phone_free: data.habits.morning_phone_free ?? 0,
        boredom_minutes: data.habits.boredom_minutes ?? 0,
        meditation_minutes: data.habits.meditation_minutes ?? 0,
        phone_free_walk: data.habits.phone_free_walk ?? 0,
        evening_journal: data.habits.evening_journal ?? 0,
        hardest: data.reflections.hardest,
        noticed: data.reflections.noticed,
        proud: data.reflections.proud,
      });
      // Save action completions for yesterday
      for (const [indexStr, completed] of Object.entries(data.actions)) {
        fetch("/api/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: yDate, dayNumber: yDay, actionIndex: Number(indexStr), completed }),
        }).catch(() => {});
      }
    },
    [onSaveCheckIn, today, currentDay]
  );

  // Save current check-in (for CloseYourDay)
  const handleSaveCurrentCheckIn = useCallback(() => {
    onSaveCheckIn(localCheckIn);
  }, [onSaveCheckIn, localCheckIn]);

  if (!dayData) return null;

  const { day, week } = dayData;
  const progress = ((displayDay - 1) / 30) * 100;

  // Count completed habits + actions for today
  const encouragements: Record<number, string> = {
    1: "This is where it starts. You're ready.",
    2: "You came back. That's already a win.",
    3: "Three days in. The foundation is forming.",
    4: "You're building something real here.",
    5: "Five days. Your brain is starting to notice.",
    6: "Almost a week. Stay with it.",
    7: "One full week. Look how far you've come.",
    8: "Week two begins. You're in this now.",
    9: "The hard part gets easier from here.",
    10: "Double digits. You're doing this.",
    11: "Eleven days of choosing differently.",
    12: "The middle stretch. This is where it counts.",
    13: "You're halfway to something powerful.",
    14: "Two full weeks. That takes real commitment.",
    15: "Fifteen days. The shift is happening.",
    16: "You're deeper into this than most people get.",
    17: "Keep going. The momentum is yours.",
    18: "Eighteen days of rewiring. Feel the difference.",
    19: "Almost three weeks. You're not the same person.",
    20: "Twenty days. This is who you're becoming.",
    21: "Three full weeks. Your new baseline is forming.",
    22: "The home stretch begins. You've earned this.",
    23: "Twenty-three days of showing up for yourself.",
    24: "You're proving something no one else can.",
    25: "Five days left. Finish what you started.",
    26: "The end is in sight. Stay steady.",
    27: "Three more days. You've got this.",
    28: "Almost there. Every day mattered.",
    29: "Tomorrow is the last day. Breathe that in.",
    30: "Day 30. You made it. Be proud.",
  };
  const encouragement = encouragements[currentDay] ?? "One day at a time. You've got this.";

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
      {/* Morning Review Overlay — outside scrollable container, only from Day 2+ on current day, skip during gap recovery */}
      {!isPastDay && showMorningReview && currentDay >= 2 && !gapInfo && (
        <MorningReview
          currentDay={currentDay}
          yesterday={yesterday}
          streaks={streaks}
          yesterdayActions={yesterdayDayData?.day.actions ?? []}
          yesterdayActionCompletions={yesterdayActionCompletions}
          onDismiss={dismissMorningReview}
          onSaveYesterday={handleSaveYesterday}
        />
      )}

      {/* Day N Begins Interstitial */}
      {showDayBegins && (
        <div className="fixed inset-0 z-40 bg-background flex flex-col items-center justify-center animate-day-begins">
          <h1 className="font-serif text-5xl font-light text-foreground">
            Day <span className="text-accent">{currentDay}</span>
          </h1>
          <p className="text-text-secondary text-lg mt-2">begins</p>
          <p className="text-text-secondary text-base mt-8 max-w-xs text-center leading-relaxed italic">
            {encouragement}
          </p>
        </div>
      )}

      <div className="px-5 pt-8 pb-28 max-w-lg mx-auto space-y-8">
      {/* 1. Greeting + progress line */}
      <div className="flex items-center justify-between">
        <p className="font-serif text-text-secondary text-base font-light">
          {getGreeting()}, Andrea
        </p>
        <div className="flex items-center gap-2.5">
          <div className="w-16 h-[3px] bg-surface-light rounded-full overflow-hidden">
            <div
              className="h-full bg-accent/60 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-text-secondary text-xs">{displayDay}/30</span>
        </div>
      </div>

      {/* 2. Day hero + title */}
      <div className="space-y-1 -mt-4">
        <h1 className="font-serif text-4xl font-light">
          Day <span className="text-accent">{displayDay}</span>
          {isPastDay && <span className="text-text-secondary text-lg ml-2">(past)</span>}
        </h1>
        <p className="text-foreground/70 text-lg font-serif font-light">{day.title}</p>
      </div>

      {/* 3. Narrative — collapsible coach intro + focus points */}
      {day.coachIntro && (() => {
        const paragraphs = day.coachIntro.split("\n\n");
        const preview = paragraphs.slice(0, 2);
        const hasMore = paragraphs.length > 2;
        const shown = introExpanded ? paragraphs : preview;

        const renderParagraph = (paragraph: string, i: number) => (
          <p key={i}>
            {paragraph.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong key={j} className="text-foreground font-medium">{part.slice(2, -2)}</strong>
              ) : (
                <span key={j}>{part}</span>
              )
            )}
          </p>
        );

        return (
          <div className="space-y-3">
            <div className="text-foreground/70 text-[15px] space-y-3" style={{ fontFamily: "var(--font-eb-garamond), serif", lineHeight: 1.75 }}>
              {shown.map(renderParagraph)}
            </div>
            {hasMore && (
              <button
                onClick={() => setIntroExpanded(!introExpanded)}
                className="text-accent text-sm hover:text-accent-muted transition-colors"
              >
                {introExpanded ? "Show less" : "Read more"}
              </button>
            )}
            {/* Focus points */}
            <p className="text-text-secondary/60 text-xs italic">In essence:</p>
            <div className="bg-surface/50 rounded-lg px-4 py-3 space-y-1">
              {day.focus.map((f, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="w-1 h-1 rounded-full bg-accent mt-2 shrink-0" />
                  <p className="text-foreground text-sm">{f}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Focus fallback when no coach intro */}
      {!day.coachIntro && day.focus.length > 0 && (
        <div className="bg-surface/50 rounded-lg px-4 py-3 space-y-1">
          {day.focus.map((f, i) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="w-1 h-1 rounded-full bg-accent mt-2 shrink-0" />
              <p className="text-foreground text-sm">{f}</p>
            </div>
          ))}
        </div>
      )}

      {/* Divider between context and actions */}
      <div className="border-t border-surface-light" />

      {/* Nudge banner for empty past days */}
      {isPastDay && editing && !hasExistingCheckIn && (
        <div className="bg-surface/50 rounded-lg px-4 py-3">
          <p className="text-text-secondary text-sm">
            You missed this day, and that&apos;s okay. You can still fill it in if you like.
          </p>
        </div>
      )}

      {/* 3. Your Actions For Today */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-widest text-text-secondary">
            Your Actions For Today
          </h2>
          <span className="text-xs text-text-secondary">
            {completedActions}/{day.actions.length}
          </span>
        </div>
        <div className="space-y-2">
          {day.actions.map((action, i) => {
            const input = day.inputs?.find((inp: DayInput) => inp.actionIndex === i);
            const showInput = input && (actionCompletions[i] > 0 || actionResponses[i]);
            return (
              <div key={i}>
                <HabitCard
                  field={String(i)}
                  label={action}
                  mode="boolean"
                  value={actionCompletions[i] ?? 0}
                  onChange={handleActionToggle}
                />
                {showInput && (
                  <ActionInput
                    input={input}
                    value={actionResponses[i] ?? ""}
                    onChange={(val) => handleActionResponse(i, val)}
                    disabled={isPastDay && !editing}
                    comparisonValue={displayDay === 14 && i === 2 ? day5ScreenTime : undefined}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Daily Habits */}
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

      {/* 5. Evening Reflection — current day or past day in edit mode */}
      {(!isPastDay || editing) && (
        <EveningReflection
          hardest={localCheckIn.hardest}
          noticed={localCheckIn.noticed}
          proud={localCheckIn.proud}
          onSave={handleReflectionSave}
          extraPrompt={day.reflectionPrompt}
          extraValue={actionResponses[99] ?? ""}
          onSaveExtra={(val) => handleActionResponse(99, val)}
        />
      )}

      {/* 6. Close Your Day — current day only */}
      {!isPastDay && (
        <CloseYourDay
          completedCount={completedCount}
          totalCount={totalCount}
          displayDay={displayDay}
          displayDate={displayDate}
          onSave={handleSaveCurrentCheckIn}
        />
      )}

      {/* 7. Talk to Coach — current day only */}
      {!isPastDay && (
        <button
          onClick={onOpenChat}
          className="w-full bg-surface-light hover:bg-surface border border-surface-light text-text-secondary px-5 py-3 rounded-full transition-colors text-sm -mt-4"
        >
          Talk to Coach about your day
        </button>
      )}

      {/* 8. Edit/Done (past days) */}
      {isPastDay && !editing && (
        <button
          onClick={() => setEditing(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-full border border-surface-light text-text-secondary hover:text-foreground hover:border-accent/30 text-sm transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit your responses
        </button>
      )}
      {isPastDay && editing && (
        <button
          onClick={() => setEditing(false)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-accent hover:bg-accent-muted text-background text-sm font-medium transition-colors cursor-pointer"
        >
          Done editing
        </button>
      )}

      {/* 9. Day Navigation */}
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
