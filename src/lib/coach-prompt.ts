const HABIT_LABELS: Record<string, string> = {
  phone_out_bedroom: "Phone out of bedroom",
  morning_phone_free: "Phone-free morning",
  boredom_minutes: "Practice 10 minutes of boredome",
  meditation_minutes: "Meditation (min)",
  phone_free_walk: "Phone-free walk",
  evening_journal: "Evening journal",
};

const ACTION_RESPONSE_LABELS: Record<string, Record<number, string>> = {
  "4": { 2: "Phone triggers" },
  "5": { 0: "Screen time baseline" },
  "7": { 2: "Letter to self (Week 1)" },
  "13": { 2: "Ideas from boredom" },
  "14": { 0: "Journey reflection", 2: "Screen time (Day 14)" },
  "16": { 0: "Connection inventory" },
  "18": { 0: "Top 5 triggers", 1: "Alternative responses" },
  "19": { 2: "Silence lessons" },
  "22": { 0: "Phone use policy" },
  "25": { 0: "Morning ritual", 1: "Evening ritual" },
  "26": { 0: "Identity narrative", 1: "Top 5 values" },
  "27": { 1: "Relapse protocol", 2: "Then vs. now" },
  "28": { 0: "Gratitude list", 1: "Releasing" },
  "29": { 2: "Letter to future self" },
  "30": { 1: "Going forward commitment" },
};

function detectGaps(allCheckIns: Record<string, unknown>[]): string {
  if (allCheckIns.length < 2) return "";

  const gaps: string[] = [];
  const dates = allCheckIns.map((ci) => ci.date as string).sort();

  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1] + "T12:00:00");
    const curr = new Date(dates[i] + "T12:00:00");
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays > 1) {
      gaps.push(`  [Gap: ${diffDays - 1} day${diffDays - 1 > 1 ? "s" : ""} missed between ${dates[i - 1]} and ${dates[i]}]`);
    }
  }

  return gaps.length ? "\n" + gaps.join("\n") : "";
}

function formatCheckInHistory(allCheckIns: Record<string, unknown>[]): string {
  if (!allCheckIns.length) return "";

  const gapAnnotations = detectGaps(allCheckIns);

  const lines = allCheckIns.map((ci) => {
    const habits = Object.entries(HABIT_LABELS)
      .filter(([key]) => ci[key])
      .map(([key, label]) => {
        const val = ci[key];
        return typeof val === "number" && val > 1 ? `${label}: ${val}` : label;
      });

    const parts = [`  ${ci.date}:`];
    if (habits.length) parts.push(`    Habits: ${habits.join(", ")}`);
    if (ci.hardest) parts.push(`    Hardest: ${ci.hardest}`);
    if (ci.noticed) parts.push(`    Noticed: ${ci.noticed}`);
    return parts.join("\n");
  });

  return `\n\nCHECK-IN HISTORY (full journey so far):\n${lines.join("\n")}${gapAnnotations}`;
}

export function formatActionResponses(
  responses: { day_number: number; action_index: number; response_text: string }[]
): string {
  if (!responses.length) return "";

  const lines = responses.map((r) => {
    const label =
      ACTION_RESPONSE_LABELS[String(r.day_number)]?.[r.action_index] ??
      `Day ${r.day_number} action ${r.action_index}`;
    return `  ${label}: ${r.response_text}`;
  });

  return `\n\nUSER'S WRITTEN RESPONSES (their own words — reference when contextually relevant):\n${lines.join("\n")}`;
}

export function getCoachSystemPrompt(
  dayNumber: number,
  weekTheme: string,
  allCheckIns?: Record<string, unknown>[],
  actionResponses?: { day_number: number; action_index: number; response_text: string }[]
): string {
  const historyContext = allCheckIns?.length ? formatCheckInHistory(allCheckIns) : "";
  const responsesContext = actionResponses?.length ? formatActionResponses(actionResponses) : "";

  return `You are a calm, wise coach guiding someone through a 30-day dopamine reset. Your name is simply "Coach."

CONTEXT:
- They are on Day ${dayNumber} of 30
- Current week theme: "${weekTheme}"
- This is a personal journey to reclaim attention, reduce phone/social media dependency, and reconnect with slower, deeper experiences
- You have access to their full check-in history below. Reference past entries when relevant — notice patterns, growth, recurring struggles, and celebrate progress over time.${historyContext}${responsesContext}

YOUR STYLE:
- Sound like a thoughtful friend, not a therapist or self-help guru.
- Speak gently but directly. No toxic positivity.
- Be real and human. It's okay to be slightly playful or poetic.
- Use short paragraphs. Breathe between thoughts.
- Draw from stoic philosophy, mindfulness practice, and neuroscience when relevant.
- Validate struggle without enabling avoidance.
- Ask one thoughtful question when appropriate, rather than lecturing.
- Keep responses concise (2-4 short paragraphs typically).
- Prefer flowing prose over lists.
- You may use metaphors drawn from nature, craftsmanship, or contemplative traditions.
- Use **bold** to emphasize the single most important phrase or insight in each response. Typically 1-2 bold phrases per reply, no more — just the key takeaway.

IMPORTANT:
- If they express real distress or mention mental health crises, gently suggest professional support.
- Never shame them for slipping. Frame setbacks as data, not failure.
- Celebrate small wins genuinely.
- Remember: silence and boredom are the medicine, not the problem.
- If you notice gaps in their check-in history, acknowledge warmly but briefly.
- Never ask "what happened?" unless they bring it up.
- Frame coming back as the win: "You're here, and that's what counts."
- Focus on present momentum, not missed days.`;
}
