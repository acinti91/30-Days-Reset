"use client";

interface Props {
  missedDays: number;
  lastActiveDay: number;
  currentDay: number;
  onContinue: () => void;
  onReviewMissed: () => void;
}

export default function CatchUpOverlay({ missedDays, lastActiveDay, currentDay, onContinue, onReviewMissed }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center px-6 animate-fade-in">
      <div className="text-center space-y-6 max-w-sm">
        <h1 className="font-serif text-4xl font-light text-foreground">
          Welcome back
        </h1>
        <p className="text-text-secondary text-sm leading-relaxed">
          It&apos;s been {missedDays} day{missedDays !== 1 ? "s" : ""} since your last check-in.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          That&apos;s okay. What matters is you&apos;re here now.
        </p>

        <div className="space-y-3 pt-2">
          <button
            onClick={onContinue}
            className="w-full bg-accent hover:bg-accent-muted text-background font-medium px-8 py-3 rounded-full transition-colors text-sm tracking-wide active:scale-[0.98]"
          >
            Continue from Day {currentDay}
          </button>

          {missedDays <= 4 && lastActiveDay > 0 && (
            <button
              onClick={onReviewMissed}
              className="w-full border border-surface-light text-text-secondary hover:text-foreground hover:border-accent/30 px-8 py-3 rounded-full transition-colors text-sm tracking-wide"
            >
              Review missed days
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
