import { Award, Crown, Flame, Lock, Trophy } from "lucide-react";
import WeekStrip from "./WeekStrip";
import Panel from "../ui/Panel";
import ProgressBar from "../ui/ProgressBar";

export const BADGE_LADDER = [
  { id: "streak_7", days: 7, name: "7-Day Streak", icon: Flame },
  { id: "streak_30", days: 30, name: "30-Day Streak", icon: Award },
  { id: "streak_100", days: 100, name: "100-Day Streak", icon: Crown }
];

export default function StreakCard({ streak }) {
  const current = streak?.current || 0;
  const longest = streak?.longest || 0;
  const done = streak?.dailyQuizDone;
  const next = streak?.nextBadge;

  const earned = new Set();

  if (streak?.badges) {
    for (let i = 0; i < streak.badges.length; i++) {
      earned.add(streak.badges[i].id);
    }
  }

  let headline = "No streak yet";

  if (current === 1) {
    headline = "1 day streak";
  } else if (current > 1) {
    headline = `${current} day streak`;
  }

  let subtitle = "Take today's daily quiz to light the first day.";

  if (done) {
    subtitle = "Today's quiz is done. Your streak is safe.";
  } else if (current > 0) {
    subtitle = "Take today's daily quiz to keep it alive.";
  }

  const progress = next ? Math.min(1, longest / next.days) : 1;

  return (
    <Panel className="sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl ${
              current
                ? "bg-streak text-white"
                : "bg-line text-muted"
            }`}
          >
            <Flame size={30} />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-muted">
              Daily streak
            </p>

            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {headline}
            </h2>

            <p className="mt-1 text-sm text-muted">{subtitle}</p>

            <p className="mt-1.5 text-xs font-semibold text-muted">
              Longest streak: {longest} day{longest === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-5 lg:items-end">
          <WeekStrip current={current} status={streak?.status} />

          {next && (
            <div className="w-full sm:w-60">
              <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
                <span className="text-muted">Next: {next.name}</span>
                <span className="text-muted">
                  {longest}/{next.days}
                </span>
              </div>

              <ProgressBar value={progress * 100} />

              <p className="mt-1.5 text-[11px] font-semibold text-muted">
                {next.remaining} more day
                {next.remaining === 1 ? "" : "s"} to unlock
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 border-t border-line pt-5">
        <div className="mb-3 flex items-center gap-2">
          <Trophy size={16} className="text-primary" />

          <h3 className="text-sm font-bold text-ink">Badges</h3>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {BADGE_LADDER.map((badge) => {
            const isEarned = earned.has(badge.id);
            const Icon = badge.icon;

            return (
              <div
                key={badge.id}
                className={`flex items-center gap-3 rounded-[14px] border p-3 ${
                  isEarned
                    ? "border-streak/40 bg-streak/10"
                    : "border-line bg-bg"
                }`}
              >
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-[10px] ${
                    isEarned
                      ? "bg-streak text-white"
                      : "bg-line text-muted"
                  }`}
                >
                  <Icon size={17} />
                </span>

                <div className="min-w-0">
                  <p
                    className={`truncate text-sm font-bold ${
                      isEarned ? "text-streak" : "text-muted"
                    }`}
                  >
                    {badge.name}
                  </p>

                  <p className="text-[11px] font-semibold text-muted">
                    {isEarned ? "Unlocked" : `${badge.days} day streak`}
                  </p>
                </div>

                {!isEarned && (
                  <Lock size={14} className="ml-auto shrink-0 text-muted" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Panel>
  );
}
