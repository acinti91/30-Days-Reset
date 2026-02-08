export interface Day {
  day: number;
  focus: string[];
  actions: string[];
}

export interface Week {
  week: number;
  theme: string;
  rationale: string;
  days: Day[];
  milestones: string[];
}

export const planData: Week[] = [
  {
    week: 1,
    theme: "Awareness & Separation",
    rationale:
      "The first week is about creating physical distance from your devices and building awareness of your impulses. You are not trying to be perfect — you are trying to see clearly.",
    milestones: [
      "Phone sleeps outside the bedroom every night",
      "Morning routine established without phone",
      "First 10-minute boredom sit completed",
    ],
    days: [
      {
        day: 1,
        focus: ["Establish the phone-free bedroom", "Notice every urge to check your phone"],
        actions: [
          "Buy or find an alarm clock — your phone no longer lives in the bedroom",
          "Set a phone charging station outside your bedroom tonight",
          "Each time you reach for your phone, pause and note what triggered the urge",
          "5 minutes of sitting in silence before bed",
        ],
      },
      {
        day: 2,
        focus: ["Phone-free first hour", "Build the morning container"],
        actions: [
          "Do not touch your phone for the first 60 minutes after waking",
          "Create a morning sequence: water, stretch, breathe, eat",
          "Journal one paragraph about how yesterday felt without the phone in bed",
          "10 minutes of boredom sitting — no input, just presence",
        ],
      },
      {
        day: 3,
        focus: ["Notification audit", "Deepen boredom tolerance"],
        actions: [
          "Turn off ALL non-essential notifications (keep calls and genuine messages)",
          "Remove social media apps from home screen — bury them in folders",
          "15 minutes of boredom sitting",
          "Take a 20-minute walk without your phone",
        ],
      },
      {
        day: 4,
        focus: ["Grayscale mode", "Urge surfing practice"],
        actions: [
          "Switch your phone to grayscale/accessibility mode",
          "When an urge to scroll arises, set a 2-minute timer and just breathe",
          "15 minutes boredom sitting",
          "Write down your three biggest phone triggers",
        ],
      },
      {
        day: 5,
        focus: ["Screen time baseline", "Introduce meditation"],
        actions: [
          "Check your screen time stats — write the number down without judgment",
          "Begin a 10-minute guided meditation (use a non-phone device if possible)",
          "Phone-free lunch — eat slowly, taste the food",
          "15 minutes boredom sitting",
        ],
      },
      {
        day: 6,
        focus: ["Social media fast begins", "Physical movement"],
        actions: [
          "No social media today — at all. Log out if needed.",
          "Replace scrolling time with 30 minutes of physical movement",
          "10-minute meditation",
          "Evening journal: What did you notice without social media?",
        ],
      },
      {
        day: 7,
        focus: ["Week 1 reflection", "Rest"],
        actions: [
          "Continue social media fast",
          "Long phone-free walk (30+ minutes) — notice textures, sounds, smells",
          "10-minute meditation",
          "Write a letter to yourself about what you've observed this week",
        ],
      },
    ],
  },
  {
    week: 2,
    theme: "Deepening & Substitution",
    rationale:
      "Now that you've created distance, fill the space intentionally. This week introduces analog pleasures and longer periods of digital silence. The void will feel uncomfortable — that discomfort is your brain rewiring.",
    milestones: [
      "Two-hour daily phone-free window established",
      "Analog hobby re-engaged",
      "Social media still absent or minimal",
    ],
    days: [
      {
        day: 8,
        focus: ["Two-hour phone-free block", "Rediscover analog pleasure"],
        actions: [
          "Designate a 2-hour block today where your phone is off or in another room",
          "During that time: read a physical book, draw, cook, or build something",
          "15-minute meditation",
          "Journal about what you chose to do and how it felt",
        ],
      },
      {
        day: 9,
        focus: ["Meal without screens", "Extend morning routine"],
        actions: [
          "Eat at least two meals today with zero screens",
          "Extend phone-free morning to 90 minutes",
          "15-minute meditation",
          "20 minutes boredom sitting",
        ],
      },
      {
        day: 10,
        focus: ["One-third milestone", "Conversation practice"],
        actions: [
          "Celebrate quietly: you are one-third through",
          "Have one in-person conversation today where neither person checks their phone",
          "15-minute meditation",
          "Write about what's getting easier and what's still hard",
        ],
      },
      {
        day: 11,
        focus: ["News fast", "Nature time"],
        actions: [
          "No news consumption today — no articles, no feeds, no push alerts",
          "Spend 30+ minutes in nature without your phone",
          "15-minute meditation",
          "Notice: what did you actually miss by not reading the news?",
        ],
      },
      {
        day: 12,
        focus: ["Creative output", "Evening wind-down"],
        actions: [
          "Make something today: write, cook, draw, garden, play music",
          "Create an evening wind-down ritual: dim lights, herbal tea, gentle stretching",
          "15-minute meditation",
          "Phone goes to charging station by 9 PM",
        ],
      },
      {
        day: 13,
        focus: ["Boredom as a portal", "Extend phone-free blocks"],
        actions: [
          "Sit with boredom for 25 minutes today — no input, no distraction",
          "Extend your phone-free block to 3 hours",
          "15-minute meditation",
          "Journal: What ideas or memories surfaced during boredom?",
        ],
      },
      {
        day: 14,
        focus: ["Week 2 reflection", "Halfway preparation"],
        actions: [
          "Halfway through tomorrow — write about your journey so far",
          "Long analog activity: hike, museum, library, workshop",
          "15-minute meditation",
          "Check screen time — compare to Day 5 baseline",
        ],
      },
    ],
  },
  {
    week: 3,
    theme: "Integration & Challenge",
    rationale:
      "The middle stretch. Motivation may dip. This week tests your resolve with longer disconnections and helps you integrate these practices into daily life rather than treating them as temporary restrictions.",
    milestones: [
      "Half-day digital sabbath completed",
      "Phone use feels more intentional than compulsive",
      "Sleep quality noticeably improved",
    ],
    days: [
      {
        day: 15,
        focus: ["Halfway celebration", "Half-day sabbath"],
        actions: [
          "Morning: phone off until noon. Six hours of analog living.",
          "Do something that brings genuine joy — not consumption, but creation or connection",
          "20-minute meditation",
          "Evening journal: Who are you becoming?",
        ],
      },
      {
        day: 16,
        focus: ["Relationship inventory", "Intentional communication"],
        actions: [
          "List the people you've been connecting with via phone vs. in person",
          "Reach out to one person for an in-person meeting this week",
          "20-minute meditation",
          "Practice being fully present in one conversation today",
        ],
      },
      {
        day: 17,
        focus: ["Work boundaries", "Single-tasking"],
        actions: [
          "Close all unnecessary browser tabs. Work on one thing at a time.",
          "Set specific times for checking email (e.g., 10 AM, 2 PM, 5 PM)",
          "20-minute meditation",
          "Notice how single-tasking affects your energy and focus",
        ],
      },
      {
        day: 18,
        focus: ["Trigger mapping", "Response planning"],
        actions: [
          "Map your top 5 digital triggers (boredom, anxiety, FOMO, habit, loneliness)",
          "For each trigger, write one alternative response",
          "20-minute meditation",
          "Phone-free walk, practicing your alternative responses mentally",
        ],
      },
      {
        day: 19,
        focus: ["Comfort with silence", "Extended meditation"],
        actions: [
          "Try 30 minutes of complete silence today — no music, no podcasts, nothing",
          "25-minute meditation",
          "Cook a meal in silence, focusing entirely on the process",
          "Journal about what silence teaches you",
        ],
      },
      {
        day: 20,
        focus: ["Two-thirds milestone", "Full-day sabbath prep"],
        actions: [
          "Two-thirds complete. Acknowledge what you've built.",
          "Tomorrow is a full digital sabbath — prepare today",
          "20-minute meditation",
          "Stock up: books, art supplies, ingredients for cooking, walking shoes",
        ],
      },
      {
        day: 21,
        focus: ["Full digital sabbath", "Deep analog day"],
        actions: [
          "Phone OFF from wake to sleep. Full day without digital input.",
          "Fill the day with physical, creative, social, or contemplative activities",
          "30-minute meditation or silent sit",
          "Before bed, write about this day by candlelight or lamplight",
        ],
      },
    ],
  },
  {
    week: 4,
    theme: "Sustainability & Identity",
    rationale:
      "The final week. You are not going back to how things were — you are designing how things will be. This week builds the systems and identity that will carry you beyond Day 30.",
    milestones: [
      "Personal digital use policy drafted",
      "New identity narrative written",
      "Sustainable daily practices locked in",
    ],
    days: [
      {
        day: 22,
        focus: ["Design your digital policy", "Boundary architecture"],
        actions: [
          "Write your personal 'phone use policy' — when, how long, what for",
          "Decide which apps earn their place back and which stay deleted",
          "20-minute meditation",
          "Share your policy with someone who supports you",
        ],
      },
      {
        day: 23,
        focus: ["Accountability structures", "Community"],
        actions: [
          "Set up accountability: a friend, a partner, a weekly check-in",
          "Consider if any online communities genuinely serve your growth",
          "20-minute meditation",
          "Journal: What relationships have improved during this reset?",
        ],
      },
      {
        day: 24,
        focus: ["Environmental design", "Friction engineering"],
        actions: [
          "Re-organize your phone: only essential apps on home screen",
          "Add friction to tempting apps: log out, use website versions, set time limits",
          "20-minute meditation",
          "Design your physical environment to support focus (remove TVs from bedroom, etc.)",
        ],
      },
      {
        day: 25,
        focus: ["Morning ritual finalization", "Evening ritual finalization"],
        actions: [
          "Write down your ideal morning ritual — the one you want to keep forever",
          "Write down your ideal evening wind-down",
          "20-minute meditation",
          "Practice both rituals today with full intention",
        ],
      },
      {
        day: 26,
        focus: ["Identity narrative", "Values alignment"],
        actions: [
          "Write a short paragraph: 'I am the kind of person who...'",
          "List your top 5 values. How does your phone use align (or not)?",
          "20-minute meditation",
          "Phone-free dinner with someone you care about",
        ],
      },
      {
        day: 27,
        focus: ["Stress test", "Resilience planning"],
        actions: [
          "Today, intentionally face a trigger situation without reaching for your phone",
          "Write a 'relapse protocol' — what to do when you slip",
          "20-minute meditation",
          "Journal: How do you handle discomfort now vs. 27 days ago?",
        ],
      },
      {
        day: 28,
        focus: ["Gratitude practice", "Letting go"],
        actions: [
          "Write down 10 things this reset has given you",
          "Write down what you're releasing — the habits, the compulsions, the noise",
          "25-minute meditation",
          "Long phone-free walk — a walking meditation of gratitude",
        ],
      },
      {
        day: 29,
        focus: ["Final digital sabbath", "Preparation for re-entry"],
        actions: [
          "One more full day without your phone",
          "Spend time in activities that now feel natural and nourishing",
          "30-minute meditation",
          "Write a letter to your future self for when things get hard",
        ],
      },
      {
        day: 30,
        focus: ["Completion", "New beginning"],
        actions: [
          "You made it. Sit with that quietly.",
          "Read your Day 1 journal entry. Notice the distance traveled.",
          "30-minute meditation",
          "Write your 'going forward' commitment — not rules, but intentions",
          "Celebrate in a way that feels true to who you've become",
        ],
      },
    ],
  },
];

export function getDayData(dayNumber: number): { day: Day; week: Week } | undefined {
  for (const week of planData) {
    const day = week.days.find((d) => d.day === dayNumber);
    if (day) return { day, week };
  }
  return undefined;
}

export function getWeekForDay(dayNumber: number): Week | undefined {
  return planData.find((w) => w.days.some((d) => d.day === dayNumber));
}
