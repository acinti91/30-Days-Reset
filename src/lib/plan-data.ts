export interface DayInput {
  actionIndex: number;
  type: "text" | "number" | "textarea";
  label: string;
  placeholder?: string;
  unit?: string;
}

export interface Day {
  day: number;
  title: string;
  focus: string[];
  actions: string[];
  coachIntro: string;
  inputs?: DayInput[];
}

export const HABIT_INTRO_DAY: Record<string, number> = {
  phone_out_bedroom: 1,
  morning_phone_free: 2,
  boredom_minutes: 2,
  phone_free_walk: 3,
  evening_journal: 2,
  meditation_minutes: 5,
};

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
        title: "The Phone-Free Bedroom",
        focus: ["Establish the phone-free bedroom", "Notice every urge to check your phone"],
        actions: [
          "Buy or find an alarm clock — your phone no longer lives in the bedroom",
          "Set a phone charging station outside your bedroom tonight",
          "Each time you reach for your phone, pause and note what triggered the urge",
        ],
        coachIntro: "Welcome to Day 1. This entire week is about one word: **awareness**. You're not trying to be perfect, you're not quitting your phone forever — you're learning to see clearly how it shapes your days, your sleep, your mood, and your attention.\n\nToday we start with the **single most impactful change** you can make: getting your phone out of the bedroom. Research consistently shows that having a phone within arm's reach at night disrupts sleep quality even when you don't use it — the mere possibility of a notification keeps part of your brain on alert.\n\nYour bedroom is where your brain **recovers, consolidates memories, and resets its dopamine receptors**. Protecting that space is the foundation everything else in this program builds on.\n\nThe other actions today are simple: **notice your urges** and sit in brief silence. Don't judge what you find — just observe. You're building the muscle of noticing, and that muscle will carry you through the next thirty days.",
      },
      {
        day: 2,
        title: "Protect Your First Hour",
        focus: ["Phone-free first hour", "Build the morning container"],
        actions: [
          "Create a morning sequence: water, stretch, breathe, eat",
          "Write about how last night felt without the phone in your bedroom",
          "Choose your phone charging station's permanent spot — make it a ritual",
        ],
        coachIntro: "Yesterday you reclaimed your bedroom. Today you reclaim your morning.\n\n**The first hour after waking is when your brain is most impressionable** — cortisol is naturally elevated, and your prefrontal cortex is still coming online. If the first thing you do is scroll, you're handing that vulnerable window to algorithms designed to hook you.\n\nInstead, you'll build a **simple morning sequence** that belongs to you. Water, movement, breath, food — in whatever order feels right.\n\nTake a moment to write about how last night felt without the phone in your bedroom. Even a few sentences captures something you'll forget later — **the rawness of early change is worth recording**.\n\nFinally, choose a permanent spot for your phone's charging station. Making it a fixed location turns a decision into a ritual, and **rituals are easier to maintain than rules**.",
      },
      {
        day: 3,
        title: "The Notification Audit",
        focus: ["Notification audit", "Deepen boredom tolerance"],
        actions: [
          "Turn off ALL non-essential notifications (keep calls and genuine messages)",
          "Remove social media apps from home screen — bury them in folders",
        ],
        coachIntro: "Every notification is a tiny interruption, and research shows it takes an average of **23 minutes to fully regain focus** after one. Multiply that across dozens of daily alerts and you begin to see where your attention goes.\n\nToday you audit every notification on your phone and **silence everything that isn't a real human needing you right now**.\n\nThen go further: move social media apps off your home screen entirely. Bury them in folders or a second page. **Out of sight changes the default.** When the app isn't staring at you every time you unlock your phone, you break the automatic reach-and-tap loop.\n\nIt might feel like a small change, but small frictions compound. That's the point.",
      },
      {
        day: 4,
        title: "Grayscale & Urge Surfing",
        focus: ["Grayscale mode", "Urge surfing practice"],
        actions: [
          "Switch your phone to grayscale/accessibility mode",
          "When an urge to scroll arises, set a 2-minute timer and just breathe",
          "Write down your three biggest phone triggers",
        ],
        coachIntro: "App designers use **color strategically** — red notification badges trigger urgency, bright icons draw your eye. Switching to grayscale removes that lever entirely. Your phone becomes a tool instead of a slot machine.\n\nMany people report that **grayscale alone reduces screen time by 15-20%**.\n\nToday you also practice **urge surfing**: when the impulse to scroll hits, you don't fight it and you don't obey it. You set a two-minute timer and breathe. Most urges peak and pass within 90 seconds if you don't act on them.\n\nYou're also writing down your **top three triggers** — the specific situations or emotions that make you reach for your phone. Naming them takes away some of their power.",
        inputs: [
          { actionIndex: 2, type: "textarea", label: "Your three biggest phone triggers", placeholder: "1. When I feel...\n2. When I'm...\n3. After I..." },
        ],
      },
      {
        day: 5,
        title: "Know Your Baseline",
        focus: ["Screen time baseline", "Introduce meditation"],
        actions: [
          "Check your screen time stats — write the number down without judgment",
          "Phone-free lunch — eat slowly, taste the food",
        ],
        coachIntro: "Today you add a powerful new daily habit: **meditation**. You've been sitting with boredom, which is passive — meditation is active. You're deliberately **training your attention** to stay where you put it instead of chasing every shiny thought.\n\nEven ten minutes a day **strengthens the prefrontal cortex**, the part of your brain that says \"no\" to impulses.\n\nYou're also recording your **screen time baseline**. Don't judge the number — just write it down. In ten days you'll check again, and the comparison will show you something no amount of willpower can: **objective proof** that your relationship with your phone is changing.\n\nAnd today, try eating lunch without your phone. No scrolling, no videos — just food. When you eat without screens, you actually taste what you're eating, and you notice when you're full. It's a **small act of presence** that trains the same muscle as everything else this week.",
        inputs: [
          { actionIndex: 0, type: "number", label: "Screen time", placeholder: "e.g. 4.5", unit: "hours" },
        ],
      },
      {
        day: 6,
        title: "The Social Media Fast",
        focus: ["Social media fast begins", "Physical movement"],
        actions: [
          "No social media today — at all. Log out if needed.",
          "Replace scrolling time with 30 minutes of physical movement",
        ],
        coachIntro: "Social media platforms employ thousands of engineers whose job is to **maximize your time on screen**. Infinite scroll, variable reward schedules, social validation loops — these aren't features, they're hooks.\n\nToday you step away from **all of it**.\n\nThe discomfort you may feel is real and it's important. It's the gap between the stimulation your brain has been trained to expect and the **natural satisfaction of an unmediated life**.\n\nPhysical movement is today's antidote — it produces dopamine through effort rather than consumption, and that kind of dopamine actually **leaves you feeling better afterward**, not emptier.",
      },
      {
        day: 7,
        title: "Rest & Reflect",
        focus: ["Week 1 reflection", "Rest"],
        actions: [
          "Continue social media fast",
          "Long phone-free walk (30+ minutes) — notice textures, sounds, smells",
          "Write a letter to yourself about what you've observed this week",
        ],
        coachIntro: "**One full week.** You've moved your phone out of the bedroom, reclaimed your mornings, silenced notifications, walked without a screen, gone grayscale, started meditating, and began a social media fast. That is a remarkable amount of change in seven days.\n\nToday is for **consolidation, not more pushing**. The long walk is meditative, not athletic.\n\nThe letter you write to yourself is a **time capsule** — when you read it on Day 30, you'll see how far you've come. Be honest about what's been hard, what surprised you, and what you're starting to feel differently about.\n\n**Rest is not the absence of progress; it's where progress solidifies.**",
        inputs: [
          { actionIndex: 2, type: "textarea", label: "Your letter to yourself", placeholder: "Dear me, this week I..." },
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
        title: "Rediscover Analog",
        focus: ["Two-hour phone-free block", "Rediscover analog pleasure"],
        actions: [
          "Designate a 2-hour block today where your phone is off or in another room",
          "During that time: read a physical book, draw, cook, or build something",
        ],
        coachIntro: "Welcome to Week 2. Last week was about **separation** — creating distance between you and your phone. This week is about **substitution**: filling the space you've opened with things that genuinely nourish you.\n\nThe void left by less screen time can feel uncomfortable, almost like hunger. That discomfort is **your brain rewiring**, and it's a sign things are working.\n\nToday you take a big step: a **full two-hour block** with your phone off or in another room. This is longer than anything you've done so far, and the point isn't to white-knuckle through it.\n\nThe point is to **rediscover what you actually enjoy** when screens aren't an option. Reading, cooking, drawing, building, playing music — these analog pleasures produce a slower, steadier kind of satisfaction that your brain has been starved of.\n\nPay attention to what you reach for naturally. That instinct is telling you something important about **who you are underneath the scroll**.",
      },
      {
        day: 9,
        title: "Eating Without Screens",
        focus: ["Meal without screens", "Extend morning routine"],
        actions: [
          "Eat at least two meals today with zero screens",
          "Extend phone-free morning to 90 minutes",
        ],
        coachIntro: "Eating is one of the most ancient pleasures we have, yet most of us **barely taste our food** because we're watching something while we eat.\n\nScreen-free meals force you to actually be in your body — to notice flavors, textures, the feeling of hunger becoming fullness. It's a **small act of presence** that ripples outward.\n\nYou're also extending your phone-free morning to **90 minutes**. By now the first 60 should feel more natural. Stretching to 90 deepens the container and gives you more time to settle into your own thoughts before the world's demands arrive.",
      },
      {
        day: 10,
        title: "One-Third Milestone",
        focus: ["One-third milestone", "Conversation practice"],
        actions: [
          "Celebrate quietly: you are one-third through",
          "Have one in-person conversation where neither person checks their phone",
        ],
        coachIntro: "**Ten days.** One-third of the way through. Pause and let that land — you have ten consecutive days of choosing differently under your belt. That's not a streak on a screen; that's a **pattern forming in your brain**.\n\nToday's focus is relational. Phones fracture conversations — even a phone face-down on a table **reduces the depth of connection** between two people (researchers call this the \"iPhone effect\").\n\nYour action today is to have one conversation where **neither person checks their phone**. Notice the difference: the eye contact, the pauses, the feeling of being fully heard.\n\nThis is what connection felt like before we all started splitting our attention.",
      },
      {
        day: 11,
        title: "News Fast & Nature",
        focus: ["News fast", "Nature time"],
        actions: [
          "No news consumption today — no articles, no feeds, no push alerts",
          "Spend 30+ minutes in nature without your phone",
          "Notice: what did you actually miss by not reading the news?",
        ],
        coachIntro: "News creates a **constant low-grade anxiety** by making distant events feel immediate and personal. The 24-hour news cycle is designed to keep you checking — \"what happened now?\" is just another form of compulsive refreshing.\n\nToday you test what happens when you **step away from it entirely**.\n\nBy tonight, ask yourself honestly: what did you actually miss? Almost certainly **nothing that affected your daily life**.\n\nMeanwhile, the 30 minutes you spend in nature will do something news never can — it will **lower your cortisol, calm your nervous system**, and remind your body what it feels like to exist without urgency.",
      },
      {
        day: 12,
        title: "Create, Don't Consume",
        focus: ["Creative output", "Evening wind-down"],
        actions: [
          "Make something today: write, cook, draw, garden, play music",
          "Create an evening wind-down ritual: dim lights, herbal tea, gentle stretching",
          "Phone goes to charging station by 9 PM",
        ],
        coachIntro: "There's a fundamental difference between **consuming and creating**. Scrolling, watching, reading feeds — these are passive. Your brain receives but doesn't produce, and over time that passivity dulls your sense of agency.\n\n**Making something reverses the flow.** When you write, cook, draw, or play music, you engage different neural circuits — ones that leave you feeling energized rather than depleted.\n\nTonight you also design your **evening wind-down ritual**. Sleep researchers consistently find that the hour before bed determines sleep quality.\n\nDim lights, warm beverages, gentle movement — these signal to your brain that **it's safe to power down**. This ritual will protect your nights for the rest of the reset and beyond.",
      },
      {
        day: 13,
        title: "Boredom as a Portal",
        focus: ["Boredom as a portal", "Extend phone-free blocks"],
        actions: [
          "Sit with boredom for 25 minutes today — no input, no distraction",
          "Extend your phone-free block to 3 hours",
          "After the boredom sit, write down any ideas or memories that surfaced",
        ],
        coachIntro: "By now you've been sitting with boredom for almost two weeks, and something may be shifting. The early sits felt restless, maybe uncomfortable.\n\nBut boredom, when you stop running from it, **becomes a portal**. Your mind begins generating its own content — memories you'd forgotten, ideas that connect in new ways, a sense of spaciousness that feels almost luxurious.\n\nToday's 25-minute sit is the longest yet. You're also extending your phone-free block to **three hours**. This isn't about deprivation — it's about discovering that you can be fully alive for three hours without any digital input at all.\n\nJournal what comes up. **The thoughts that emerge from extended boredom are often the most honest ones you'll have.**",
        inputs: [
          { actionIndex: 2, type: "textarea", label: "Ideas or memories that surfaced", placeholder: "During the boredom sit, I noticed..." },
        ],
      },
      {
        day: 14,
        title: "Halfway Checkpoint",
        focus: ["Week 2 reflection", "Halfway preparation"],
        actions: [
          "Halfway through tomorrow — write about your journey so far",
          "Long analog activity: hike, museum, library, workshop",
          "Check screen time — compare to Day 5 baseline",
        ],
        coachIntro: "**Two weeks complete** — you're about to cross the halfway mark.\n\nBefore anything else, take a few minutes to **write about your journey so far**. What's changed? What surprised you? What's still hard? Putting two weeks of transformation into words makes the progress concrete — and gives you something to look back on when motivation dips.\n\nThen check your screen time and compare the number to your Day 5 baseline. Most people see a **30-50% reduction** by this point. That's not willpower — that's your brain genuinely wanting less stimulation because it's starting to find satisfaction elsewhere.\n\nThe analog activity today should be something **immersive** — a hike, a museum, a library afternoon, a workshop. Give yourself permission to lose track of time in something real. Tomorrow begins the third week, the hardest stretch. **Today, refill your reserves.**",
        inputs: [
          { actionIndex: 0, type: "textarea", label: "Your journey so far", placeholder: "Over the past two weeks..." },
          { actionIndex: 2, type: "number", label: "Screen time now", placeholder: "e.g. 2.5", unit: "hours" },
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
        title: "The Half-Day Sabbath",
        focus: ["Halfway celebration", "Half-day sabbath"],
        actions: [
          "Morning: phone off until noon. Six hours of analog living.",
          "Do something that brings genuine joy — not consumption, but creation or connection",
        ],
        coachIntro: "Welcome to Week 3 — and congratulations, **you're halfway through**.\n\nThis is the hardest stretch of the reset. The novelty of the first week is gone, the structured progress of the second week is behind you, and the finish line still feels far away. **Motivation naturally dips here.** That's normal, and it's why this week is designed to challenge and integrate rather than introduce new habits.\n\nToday you celebrate the halfway mark with a **half-day digital sabbath** — phone off from waking until noon. Six hours of analog living. This isn't a test of endurance; it's a preview of what **sustainable freedom** from your phone actually feels like.\n\nFill those hours with something that brings genuine joy: not consumption, but creation, connection, or quiet presence.\n\nThe question in tonight's journal — **\"Who are you becoming?\"** — matters more than it might seem. You're not just changing a habit; you're changing your relationship with stimulation, attention, and time itself.",
      },
      {
        day: 16,
        title: "Relationship Inventory",
        focus: ["Relationship inventory", "Intentional communication"],
        actions: [
          "List the people you've been connecting with via phone vs. in person",
          "Reach out to one person for an in-person meeting this week",
          "Practice being fully present in one conversation today",
        ],
        coachIntro: "We use our phones constantly to \"stay connected,\" but studies show that **heavy phone users often feel lonelier** than light users.\n\nThe connection phones offer is wide but shallow — likes, comments, quick texts. **Real connection requires presence, vulnerability, and uninterrupted attention.**\n\nToday you take an honest inventory of who you've been connecting with through your phone versus in person. Then you **reach out to one person** and arrange something face to face.\n\nThis isn't about judging your social life — it's about noticing where your relational energy has been going and **redirecting some of it toward depth**.",
        inputs: [
          { actionIndex: 0, type: "textarea", label: "Phone vs. in-person connections", placeholder: "Phone: ...\nIn person: ..." },
        ],
      },
      {
        day: 17,
        title: "The Art of Single-Tasking",
        focus: ["Work boundaries", "Single-tasking"],
        actions: [
          "Close all unnecessary browser tabs. Work on one thing at a time.",
          "Set specific times for checking email (e.g., 10 AM, 2 PM, 5 PM)",
          "Notice how single-tasking affects your energy and focus",
        ],
        coachIntro: "Your phone trained you to multitask, but neuroscience is clear: **the brain doesn't multitask**. It switches rapidly between tasks, and each switch costs energy, accuracy, and time.\n\nStudies show that chronic multitaskers are actually **worse at filtering irrelevant information** — the opposite of what you'd expect.\n\nToday you practice **single-tasking**: one browser tab, one task, full attention. You also batch your email into specific windows instead of checking constantly.\n\nThis approach often feels slower at first but produces **more and better work** by the end of the day. Notice how your energy feels different when your attention isn't being fragmented every few minutes.",
      },
      {
        day: 18,
        title: "Know Your Triggers",
        focus: ["Trigger mapping", "Response planning"],
        actions: [
          "Map your top 5 digital triggers (boredom, anxiety, FOMO, habit, loneliness)",
          "For each trigger, write one alternative response",
          "Mentally rehearse your alternative responses during today's walk",
        ],
        coachIntro: "Every compulsive phone check starts with a **trigger** — an emotion, a situation, a bodily sensation that you've learned to soothe with your screen. The five most common are boredom, anxiety, FOMO, habit, and loneliness.\n\nToday you **map yours**.\n\nThis isn't just self-awareness for its own sake. For each trigger, you write one **specific alternative response**. Bored? Pick up a book. Anxious? Three deep breaths.\n\nThe goal is to **pre-decide** so that in the moment, you don't have to rely on willpower — you just follow the plan.\n\nOn your phone-free walk, mentally rehearse these alternatives. **Visualization primes your brain to execute when it counts.**",
        inputs: [
          { actionIndex: 0, type: "textarea", label: "Your top 5 triggers", placeholder: "1. Boredom\n2. Anxiety\n3. ...\n4. ...\n5. ..." },
          { actionIndex: 1, type: "textarea", label: "Alternative responses", placeholder: "Bored → Pick up a book\nAnxious → Three deep breaths\n..." },
        ],
      },
      {
        day: 19,
        title: "Comfort With Silence",
        focus: ["Comfort with silence", "Extended meditation"],
        actions: [
          "Try 30 minutes of complete silence today — no music, no podcasts, nothing",
          "Cook a meal in silence, focusing entirely on the process",
          "Write down what silence taught you today",
        ],
        coachIntro: "For most of human history, **silence was the default**. Now it's so rare that it can feel genuinely uncomfortable. We fill every gap — earbuds on walks, podcasts while cooking, music while working.\n\nToday you **reclaim silence as a resource**, not a void.\n\nThirty minutes of complete silence is today's anchor practice, and cooking a meal without any audio input is a powerful complement. When there's nothing to listen to, **you start listening to yourself** — your thoughts, your body, the sounds of the world around you.\n\nTonight's journal prompt invites you to articulate what silence is teaching you. Many people discover that **their best thinking happens in quiet**.",
        inputs: [
          { actionIndex: 2, type: "textarea", label: "What silence taught you", placeholder: "In the silence, I discovered..." },
        ],
      },
      {
        day: 20,
        title: "Prepare for Sabbath",
        focus: ["Two-thirds milestone", "Full-day sabbath prep"],
        actions: [
          "Two-thirds complete. Acknowledge what you've built.",
          "Tomorrow is a full digital sabbath — prepare today",
          "Stock up: books, art supplies, ingredients for cooking, walking shoes",
        ],
        coachIntro: "**Twenty days in** — two-thirds of the reset complete. Tomorrow is a full digital sabbath, and today is preparation day.\n\nThe difference between a sabbath that feels freeing and one that feels like a prison is **preparation**. If you wake up tomorrow with nothing to do and no phone, you'll feel trapped. If you wake up with books stacked, ingredients ready, walking shoes by the door, and a friend to visit — you'll feel free.\n\n**Stock your analog toolkit today.** Think about what you genuinely want to do with an entire day of uninterrupted, un-mediated living.\n\nThis is also a good moment to acknowledge what you've built over twenty days. The habits, the awareness, the growing ease with silence — **none of that is small**.",
      },
      {
        day: 21,
        title: "Full Digital Sabbath",
        focus: ["Full digital sabbath", "Deep analog day"],
        actions: [
          "Phone OFF from wake to sleep. Full day without digital input.",
          "Fill the day with physical, creative, social, or contemplative activities",
          "Before bed, write about this day by candlelight or lamplight",
        ],
        coachIntro: "This is the culmination of three weeks of practice. **A full day — wake to sleep — without your phone.** Three weeks ago, this might have felt impossible. Now you have the boredom tolerance, the analog hobbies, the morning and evening rituals, the meditation practice, and the self-awareness to handle it.\n\nDon't try to make this day productive. **Let it be slow, physical, and present.** Cook something elaborate. Walk somewhere beautiful. Have a real conversation. Sit and do nothing for a while.\n\nThe 30-minute meditation today can be your anchor point.\n\nBefore bed, write about this day by candlelight or lamplight — no screens, even for journaling. You're proving to yourself that a full day of analog living **isn't just survivable; it's rich**.",
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
        title: "Design Your Policy",
        focus: ["Design your digital policy", "Boundary architecture"],
        actions: [
          "Write your personal 'phone use policy' — when, how long, what for",
          "Decide which apps earn their place back and which stay deleted",
          "Share your policy with someone who supports you",
        ],
        coachIntro: "Welcome to the final week. The first three weeks were about **breaking patterns and building awareness**. This week is about **architecture** — designing the systems, structures, and identity that will carry these changes beyond Day 30.\n\nWithout this week, a reset is just a detox that fades. With it, you're building **a new way of living**.\n\nToday you write your **personal digital policy**. This isn't a list of rigid rules — it's a clear set of intentions. When will you use your phone? For how long? What for? Which apps have earned their place, and which stay deleted?\n\nThink of it as a **constitution for your digital life**. Writing it down makes it real, and sharing it with someone who supports you makes it accountable.\n\nThe apps you let back in should pass a simple test: **does this genuinely serve my life, or does it just fill time?**",
        inputs: [
          { actionIndex: 0, type: "textarea", label: "Your phone use policy", placeholder: "I will use my phone for...\nI will not use my phone for...\nTime limits: ..." },
        ],
      },
      {
        day: 23,
        title: "Build Accountability",
        focus: ["Accountability structures", "Community"],
        actions: [
          "Set up accountability: a friend, a partner, a weekly check-in",
          "Consider if any online communities genuinely serve your growth",
        ],
        coachIntro: "Research on behavior change is unanimous on one point: **social support is the strongest predictor** of whether a new habit sticks. People who go it alone relapse at much higher rates than those who have even one accountability partner.\n\nToday you **build that structure**. It could be a friend who checks in weekly, a partner who shares the commitment, or a small group that meets regularly.\n\nYou also honestly evaluate your online communities — some genuinely support growth, while others are just **another form of consumption dressed up as connection**.\n\nThe journal question tonight asks what relationships have improved during this reset. The answer usually reveals **who your real support network is**.",
      },
      {
        day: 24,
        title: "Engineer Your Environment",
        focus: ["Environmental design", "Friction engineering"],
        actions: [
          "Re-organize your phone: only essential apps on home screen",
          "Add friction to tempting apps: log out, use website versions, set time limits",
          "Design your physical environment to support focus (remove TVs from bedroom, etc.)",
        ],
        coachIntro: "**Willpower is a depletable resource** — it's weakest when you're tired, stressed, or emotional, which is exactly when you're most likely to reach for your phone.\n\n**Environment design** solves this by making the right choice the easy choice and the wrong choice hard.\n\nToday you re-engineer your phone: only essential apps on the home screen, tempting apps buried or deleted, time limits set, auto-play disabled.\n\nYou also look at your **physical space** — is there a TV in your bedroom? Are chargers in the wrong places? Every small friction point you add **protects future-you** from present-moment weakness.\n\nThe goal is a phone that's useful but boring, and **a home that invites presence**.",
      },
      {
        day: 25,
        title: "Finalize Your Rituals",
        focus: ["Morning ritual finalization", "Evening ritual finalization"],
        actions: [
          "Write down your ideal morning ritual — the one you want to keep forever",
          "Write down your ideal evening wind-down",
          "Practice both rituals today with full intention",
        ],
        coachIntro: "Over the past three and a half weeks, you've experimented with morning and evening routines. Some elements stuck, others didn't. Today you **formalize both** — writing down the exact sequence you want to keep as permanent practice.\n\nYour morning ritual is the container that **protects your first hour**. Your evening ritual is the wind-down that **protects your sleep**. Together they bookend each day with intention.\n\nWrite them down specifically: not \"do some stretching\" but \"5 minutes of stretching in the living room before coffee.\" **Specificity turns aspirations into habits.**\n\nPractice both today with full attention — this is the dress rehearsal for the rest of your life.",
        inputs: [
          { actionIndex: 0, type: "textarea", label: "Your ideal morning ritual", placeholder: "1. Wake up at...\n2. ...\n3. ..." },
          { actionIndex: 1, type: "textarea", label: "Your ideal evening wind-down", placeholder: "1. At 9 PM...\n2. ...\n3. ..." },
        ],
      },
      {
        day: 26,
        title: "Who You're Becoming",
        focus: ["Identity narrative", "Values alignment"],
        actions: [
          "Write a short paragraph: 'I am the kind of person who...'",
          "List your top 5 values. How does your phone use align (or not)?",
          "Phone-free dinner with someone you care about",
        ],
        coachIntro: "The most powerful predictor of lasting behavior change isn't motivation or willpower — **it's identity**. When you see yourself as \"someone who doesn't scroll mindlessly,\" the decision is already made before the trigger arrives.\n\nYou don't have to resist because **the behavior simply isn't who you are**.\n\nToday you write your identity narrative: **\"I am the kind of person who...\"** This isn't positive thinking — it's aligning your self-image with the evidence of the last 26 days.\n\nYou also check your values against your phone use. When there's a gap between what you value and how you spend your time, **that gap is where dissatisfaction lives**.\n\nTonight's phone-free dinner is a chance to practice being the person you've described.",
        inputs: [
          { actionIndex: 0, type: "textarea", label: "I am the kind of person who...", placeholder: "I am the kind of person who..." },
          { actionIndex: 1, type: "textarea", label: "Your top 5 values", placeholder: "1. ...\n2. ...\n3. ...\n4. ...\n5. ..." },
        ],
      },
      {
        day: 27,
        title: "Stress Test",
        focus: ["Stress test", "Resilience planning"],
        actions: [
          "Today, intentionally face a trigger situation without reaching for your phone",
          "Write a 'relapse protocol' — what to do when you slip",
          "Write a comparison: how you handle discomfort now vs. 27 days ago",
        ],
        coachIntro: "For the past four weeks you've been building new neural pathways while avoiding situations that test them. Today you **deliberately face a trigger** — not to prove something, but to see how your response has changed.\n\nWalk toward the situation that used to make you grab your phone and **notice what happens in your body and mind**. You might be surprised by how different it feels.\n\nYou're also writing your **relapse protocol**. This is crucial. Slips will happen — a stressful day, a boring evening, a moment of weakness. Having a pre-written plan turns a potential spiral into **a brief detour**: put the phone down, take three breaths, journal what triggered it, and start fresh tomorrow.\n\nFinally, write a comparison: how you handle discomfort now versus 27 days ago. **Seeing the contrast in your own words** makes the transformation undeniable — and gives you evidence to hold onto when old patterns whisper that nothing has really changed.",
        inputs: [
          { actionIndex: 1, type: "textarea", label: "Your relapse protocol", placeholder: "When I slip, I will:\n1. Put the phone down\n2. Take three breaths\n3. ..." },
          { actionIndex: 2, type: "textarea", label: "Then vs. now", placeholder: "27 days ago I would... Now I..." },
        ],
      },
      {
        day: 28,
        title: "Gratitude & Letting Go",
        focus: ["Gratitude practice", "Letting go"],
        actions: [
          "Write down 10 things this reset has given you",
          "Write down what you're releasing — the habits, the compulsions, the noise",
          "Long phone-free walk — a walking meditation of gratitude",
        ],
        coachIntro: "Gratitude isn't just a feel-good exercise — neuroimaging studies show it **literally changes which neural pathways fire by default**. Regular gratitude practice shifts your brain from scanning for threats to noticing what's already working.\n\nToday you write down **ten specific things** this reset has given you.\n\nYou're also practicing the equally important skill of **letting go**. Write down what you're releasing: the compulsive checking, the endless scrolling, the background anxiety of always being available.\n\n**Naming what you release makes the release concrete.**\n\nThe walking meditation of gratitude tonight ties both practices together — you're walking away from old patterns and toward the life you've been building.",
        inputs: [
          { actionIndex: 0, type: "textarea", label: "10 things this reset has given you", placeholder: "1. ...\n2. ...\n3. ..." },
          { actionIndex: 1, type: "textarea", label: "What you're releasing", placeholder: "I'm letting go of..." },
        ],
      },
      {
        day: 29,
        title: "The Final Sabbath",
        focus: ["Final digital sabbath", "Preparation for re-entry"],
        actions: [
          "One more full day without your phone",
          "Spend time in activities that now feel natural and nourishing",
          "Write a letter to your future self for when things get hard",
        ],
        coachIntro: "Your **final digital sabbath**. Notice how different this one feels compared to Day 21. The first time was a challenge to survive. This time it should feel closer to **a choice** — something you do because the alternative is less appealing than it used to be.\n\nFill this day with the activities that now feel natural and nourishing — the ones you discovered over the past four weeks. Cooking, walking, reading, creating, connecting. **These aren't substitutes for your phone anymore; they're your life.**\n\nThe most important action today is the **letter to your future self**. Write it for the hardest moment you'll face after this reset ends — a boring Sunday, a stressful week, a lonely evening when scrolling feels like the only option.\n\nYour own words, written from a place of strength and clarity, will be **the most powerful thing you can reach for** in that moment. Be specific, be honest, be kind to the person you'll be.",
        inputs: [
          { actionIndex: 2, type: "textarea", label: "Letter to your future self", placeholder: "Dear future me, when you're tempted to..." },
        ],
      },
      {
        day: 30,
        title: "Completion",
        focus: ["Completion", "New beginning"],
        actions: [
          "You made it. Read your Day 1 journal entry and sit with the distance traveled.",
          "Write your 'going forward' commitment — not rules, but intentions",
          "Celebrate in a way that feels true to who you've become",
        ],
        coachIntro: "**Day 30.** You did something that most people only talk about wanting to do. Thirty consecutive days of intentional, disciplined, honest work on your relationship with technology.\n\nThat deserves to be acknowledged — **not loudly, but deeply**.\n\nRead your Day 1 journal entry first thing today. The distance between who wrote that entry and who is reading it now is **the entire point of this reset**.\n\nThen sit with the longest meditation of the program. Let everything you've learned settle.\n\nYour \"going forward\" commitment isn't a list of rules. It's a set of **intentions grounded in who you've become**. Write it as a letter to yourself, not as a contract.\n\nAnd celebrate tonight — not with consumption, but in a way that feels true to the person you are now. A quiet dinner, a long walk, a conversation with someone who matters. **You've earned every bit of this.**",
        inputs: [
          { actionIndex: 1, type: "textarea", label: "Your going forward commitment", placeholder: "Going forward, I commit to..." },
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
