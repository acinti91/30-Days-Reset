# App Improvement Plan

> Single source of truth for all planned improvements.
> Last updated: 2026-02-20

---

## Monetization Model

| Tier | Price | Contents |
|------|-------|----------|
| **Basic** | $29.90 | PDF + Poster with Plan |
| **Complete** | $49.90 | Basic + App + Unlimited Support |
| **Premium** | $99.00+ | Complete + 4x 1:1 Sessions + 4 Books |

Goal: drive sales to the $49.90 tier via decoy pricing.

---

## Theme 1: Morning Review is Broken/Confusing

**Status:** P0 — Fix now

The Morning Review overlay shows "Day 5" (today) when the point is reviewing Day 4 (yesterday). It doesn't let you edit yesterday's reflections — only habits. The dismiss button doesn't confirm saves. And it contains today's coach intro, which doesn't belong here. This screen should be purely backward-looking.

- [ ] **1a.** Header should say "Day 4 Review" not "Day 5"
- [ ] **1b.** Yesterday's reflection answers (hardest/noticed) should be editable here, not just habits
- [ ] **1c.** CTA button should read "Save & Begin Day 5" with clear save confirmation
- [ ] **1d.** Remove today's coach intro from Morning Review — it belongs on the Today screen

---

## Theme 2: The Daily Flow Has No Rhythm

**Status:** P1 — Next

The app has no sense of ceremony. You open it, check boxes, type words, and nothing happens. No satisfying save moment, no closing ritual, no new-day feeling. For an app about mindfulness and intentionality, the daily flow should feel like a ritual.

- [ ] **2a.** "Close Your Day" button — deliberate end-of-day action that locks in reflection, shows a brief summary, gives closure
- [ ] **2b.** Save confirmation effect — subtle but satisfying visual feedback (gentle pulse, checkmark, fade)
- [ ] **2c.** New day transition — when Morning Review is dismissed, a brief purposeful "Day N begins" beat
- [ ] **2d.** Midnight auto-refresh — detect date change and prompt "A new day has begun" instead of showing stale content

---

## Theme 3: Today Screen Needs Better Hierarchy

**Status:** P1 — Next (3b is P0)

The Today screen dumps everything at once with no breathing room. No personal greeting. Day descriptions use italics which feel weak. 4-6 actions plus 5-6 habits is overwhelming.

The "what today is about" narrative LEADS the screen. It's the context that gives meaning to the actions below. Without it, people check boxes blindly.

- [ ] **3a.** Screen structure top to bottom: personal greeting ("Good morning, Andrea") → today's narrative/context (what today is about and why) → actions (max 3) → habits → evening reflection
- [ ] **3b.** Cap actions at 3 per day. Habits handle recurring practices — actions should only be the new things for that day. **(P0 — do with content audit)**
- [ ] **3c.** Restyle day descriptions — drop italics, use a muted but readable color with proper weight and contrast

---

## Theme 4: Content Coherence & Quality

**Status:** P0 — Fix now

Actions sometimes duplicate tracked habits (e.g., "15 min boredom sitting" as a Day 4 action when boredom sitting is a habit since Day 2). Day narratives don't always set up the actions. Some days feel overloaded. The story arc has gaps.

- [ ] **4a.** Audit all 30 days: remove any action that duplicates a tracked habit. Actions should only be new, day-specific tasks.
- [ ] **4b.** Ensure each day's focus narrative directly sets up that day's actions. If Day 4 asks you to write triggers, the narrative should explain why triggers matter today.
- [ ] **4c.** Verify each day has max 3 unique actions after removing habit overlaps
- [ ] **4d.** Review the progression arc — does each day build on the previous? Does the narrative read as a continuous story?

---

## Theme 5: Day-Specific Inputs Are Missing

**Status:** P2 — Soon

Some days ask for specific things (Day 4: write triggers, Day 5: note screen time) but the app only has 2 generic reflection fields. No room for day-specific responses. Reflection fields have no placeholder text.

- [ ] **5a.** Add day-specific input fields when a day's action requires writing (e.g., Day 4 trigger list, Day 5 screen time number)
- [ ] **5b.** Add placeholder/prompt text to reflection fields — "Today I noticed..." / "The hardest moment was when..."
- [ ] **5c.** Day 5 screen time capture — at minimum a numeric input; stretch: screenshot upload

---

## Theme 6: Handling Imperfect Usage

**Status:** P2 — Soon

The app assumes perfect linear progression. Real humans skip days, forget, or fall off. The day counter keeps going and missed days are empty voids with no recovery path.

- [ ] **6a.** Skipped day detection — compassionate catch-up flow: "You've been away. That's okay. Pick up where you left off, or restart from Day X?"
- [ ] **6b.** Allow retroactive check-ins — let users fill in past days (currently read-only)
- [ ] **6c.** Coach awareness — AI coach should acknowledge gaps without judgment

---

## Theme 7: Infrastructure & Growth

**Status:** P3 — When ready to sell

Features needed for a product, not the daily experience. Matter for monetization and retention.

- [ ] **7a.** Authentication / sign-in flow
- [ ] **7b.** Public landing page / marketing homepage
- [ ] **7c.** Email system — daily morning reminders, weekly progress summaries, re-engagement for skipped days

---

## Sprint Plan

| Sprint | Focus | Themes |
|--------|-------|--------|
| **1** | Fix what's broken | 1 (Morning Review) + 4 (Content Audit) + 3b (Cap 3 actions) |
| **2** | Make it feel premium | 2 (Daily Rhythm) + 3a/3c (Today Screen) + 5b (Placeholders) |
| **3** | Deepen the experience | 5a/5c (Day-specific inputs) + 6 (Imperfect usage) |
| **4** | Productize | 7 (Auth, landing page, emails) |
