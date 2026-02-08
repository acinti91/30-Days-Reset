"use client";

const emergencySteps = [
  "Close the app you're about to open. Right now.",
  "Take 5 deep breaths. In for 4, hold for 4, out for 6.",
  "Name the feeling underneath the urge. Boredom? Anxiety? Loneliness?",
  "Set a 10-minute timer. Do nothing until it rings.",
  "If you still want to scroll after 10 minutes, go for a walk instead.",
];

const tools = [
  {
    title: "The 2-Minute Rule",
    description:
      "When an urge hits, set a 2-minute timer. Simply breathe and observe the urge without acting on it. Most urges peak and pass within 90 seconds.",
  },
  {
    title: "Urge Surfing",
    description:
      "Notice where the urge lives in your body. Describe its shape, temperature, intensity. Watch it rise, crest, and fall — like a wave. You don't have to ride it.",
  },
  {
    title: "5-4-3-2-1 Grounding",
    description:
      "Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. This pulls you back into the physical world and out of the digital pull.",
  },
  {
    title: "The Tomorrow Test",
    description:
      "Ask: 'Will I be glad I scrolled for an hour when I wake up tomorrow?' The answer is almost always no. Act from your tomorrow self.",
  },
  {
    title: "Boredom Protocol",
    description:
      "Boredom is not a problem — it's a signal that your brain is ready for deeper thought. Sit with it. The creative ideas, the memories, the insights — they live on the other side of boredom.",
  },
  {
    title: "Evening Wind-Down",
    description:
      "90 minutes before bed: dim all lights, phone to charging station (outside bedroom), herbal tea, gentle stretching or reading. Your sleep is the foundation of everything.",
  },
];

const recommendations = [
  { name: "One Sec", desc: "Adds a breathing pause before opening distracting apps" },
  { name: "Forest", desc: "Gamified focus timer that grows virtual trees" },
  { name: "Insight Timer", desc: "Free meditation library with thousands of guided sessions" },
  { name: "Physical alarm clock", desc: "Replace your phone alarm to keep it out of the bedroom" },
  { name: "A paper notebook", desc: "For morning pages, evening journals, and urge tracking" },
];

export default function ToolkitView() {
  return (
    <div className="px-5 pt-8 pb-28 max-w-lg mx-auto space-y-8">
      <h1 className="font-serif text-3xl font-light">Toolkit</h1>
      <p className="text-text-secondary text-sm leading-relaxed">
        Reference tools and protocols for when you need them most.
      </p>

      {/* Emergency card */}
      <div className="bg-accent/10 border border-accent/30 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="currentColor">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
          </svg>
          <h2 className="font-serif text-xl text-accent">About to Relapse?</h2>
        </div>
        <div className="space-y-2">
          {emergencySteps.map((step, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="text-accent text-sm font-medium shrink-0 w-5">
                {i + 1}.
              </span>
              <p className="text-sm text-foreground leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tools */}
      <div className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-text-secondary">
          Protocols
        </h2>
        <div className="space-y-2">
          {tools.map((tool) => (
            <div
              key={tool.title}
              className="bg-surface rounded-xl p-4 border border-surface-light space-y-2"
            >
              <h3 className="font-serif text-lg font-light text-foreground">
                {tool.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {tool.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended tools */}
      <div className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-text-secondary">
          Recommended Tools
        </h2>
        <div className="space-y-2">
          {recommendations.map((rec) => (
            <div
              key={rec.name}
              className="bg-surface rounded-xl p-4 border border-surface-light"
            >
              <h3 className="text-sm font-medium text-foreground">{rec.name}</h3>
              <p className="text-xs text-text-secondary mt-1">{rec.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reminder */}
      <div className="text-center py-6 space-y-2">
        <p className="font-serif text-lg text-text-secondary italic">
          &ldquo;The quieter you become, the more you can hear.&rdquo;
        </p>
        <p className="text-xs text-text-secondary">— Ram Dass</p>
      </div>
    </div>
  );
}
