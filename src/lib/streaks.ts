import type { CheckIn } from "./db";

type HabitField = keyof Omit<CheckIn, "id" | "date" | "hardest" | "noticed" | "created_at">;

export function calculateStreak(
  checkIns: CheckIn[],
  habitField: HabitField,
  currentDate: string
): number {
  // Build a map of date → check-in for fast lookup
  const byDate = new Map(checkIns.map((c) => [c.date, c]));

  // Start from yesterday and walk backwards
  let streak = 0;
  const date = new Date(currentDate + "T12:00:00");
  date.setDate(date.getDate() - 1); // start at yesterday

  while (true) {
    const key = date.toISOString().split("T")[0];
    const checkIn = byDate.get(key);
    if (!checkIn || !checkIn[habitField]) break;
    streak++;
    date.setDate(date.getDate() - 1);
  }

  return streak;
}

export function getAllStreaks(
  checkIns: CheckIn[],
  currentDate: string
): Record<HabitField, number> {
  const fields: HabitField[] = [
    "phone_out_bedroom",
    "morning_phone_free",
    "boredom_minutes",
    "meditation_minutes",
    "phone_free_walk",
    "evening_journal",
  ];

  const result = {} as Record<HabitField, number>;
  for (const field of fields) {
    result[field] = calculateStreak(checkIns, field, currentDate);
  }
  return result;
}
