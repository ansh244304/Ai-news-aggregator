import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Flame,
  Target,
  Timer,
  Trophy,
  XCircle
} from "lucide-react";
import { formatDuration } from "../../utils/format";

export default function QuizResultPage() {
  const { state: data = {} } = useLocation();

  const streak = data.streak;
  const newBadges = streak?.newBadges || [];
  const percentage = data.percentage || 0;
  const score = data.score || 0;
  const totalQuestions = data.totalQuestions || 0;
  const correct = data.correctAnswers || 0;
  const incorrect = Math.max(0, totalQuestions - correct);
  const timeTaken = data.timeTakenSeconds;

  const tone =
    percentage >= 80
      ? "text-success"
      : percentage >= 50
        ? "text-primary"
        : "text-danger";

  const verdict =
    percentage >= 80
      ? "Excellent work. Keep this momentum going."
      : percentage >= 50
        ? "Good effort. Revise the ones you missed."
        : "Worth another pass. Read the explanations and retry.";

  return (
    <div className="px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-2xl">
        {/* ================= HEADER ================= */}

        <header className="text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            Result
          </span>

          <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Quiz Completed
          </h1>

          <p className="mt-1.5 text-sm text-muted">{verdict}</p>
        </header>

        {/* ================= SCORE ================= */}

        <section className="mt-6 rounded-2xl border border-line bg-card p-6 text-center sm:p-8">
          <div
            className={`mx-auto grid h-32 w-32 place-items-center rounded-full border-8 border-current font-display text-3xl font-bold ${tone}`}
          >
            {percentage}%
          </div>

          <p className="mt-4 text-lg font-bold text-ink">
            {score}/{totalQuestions} correct
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-[14px] bg-bg p-3">
              <CheckCircle2 size={16} className="mx-auto text-success" />
              <p className="mt-1.5 font-display text-lg font-bold text-ink">
                {correct}
              </p>
              <p className="text-[11px] font-semibold text-muted">Correct</p>
            </div>

            <div className="rounded-[14px] bg-bg p-3">
              <XCircle size={16} className="mx-auto text-danger" />
              <p className="mt-1.5 font-display text-lg font-bold text-ink">
                {incorrect}
              </p>
              <p className="text-[11px] font-semibold text-muted">Incorrect</p>
            </div>

            <div className="rounded-[14px] bg-bg p-3">
              <Target size={16} className="mx-auto text-primary" />
              <p className="mt-1.5 font-display text-lg font-bold text-ink">
                {totalQuestions}
              </p>
              <p className="text-[11px] font-semibold text-muted">Total</p>
            </div>

            <div className="rounded-[14px] bg-bg p-3">
              <Timer size={16} className="mx-auto text-muted" />
              <p className="mt-1.5 font-display text-lg font-bold text-ink">
                {timeTaken ? formatDuration(timeTaken) : "—"}
              </p>
              <p className="text-[11px] font-semibold text-muted">
                Time Taken
              </p>
            </div>
          </div>
        </section>

        {/* ================= STREAK ================= */}

        {streak && (
          <section className="mt-4 flex items-center gap-4 rounded-2xl border border-line bg-card p-5">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] bg-streak text-white">
              <Flame size={24} />
            </div>

            <div>
              <p className="text-base font-bold text-ink">
                {streak.current} day streak
              </p>

              <p className="text-sm text-muted">
                Longest: {streak.longest} day
                {streak.longest === 1 ? "" : "s"}
              </p>
            </div>

            <Link
              to="/briefing"
              className="ml-auto inline-flex h-11 shrink-0 items-center rounded-[10px] border border-line px-4 text-sm font-semibold text-ink transition duration-150 hover:border-primary hover:text-primary"
            >
              Daily Briefing
            </Link>
          </section>
        )}

        {/* ================= BADGES ================= */}

        {newBadges.length > 0 && (
          <section className="mt-4 rounded-2xl border border-streak/40 bg-streak/10 p-6 text-center">
            <Trophy size={32} className="mx-auto text-streak" />

            <h2 className="mt-2 font-display text-lg font-bold text-streak">
              Badge unlocked
            </h2>

            {newBadges.map((badge) => (
              <p
                key={badge.id}
                className="mt-1 text-sm font-medium text-ink"
              >
                {badge.name} — {badge.description}
              </p>
            ))}

            <Link
              to="/briefing"
              className="mt-4 inline-flex h-11 items-center gap-2 rounded-[10px] bg-primary px-4 text-sm font-semibold text-primary-fg transition duration-150 hover:brightness-110"
            >
              See your badges
              <ArrowRight size={15} />
            </Link>
          </section>
        )}

        {/* ================= ACTIONS ================= */}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/dashboard"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[10px] bg-primary px-5 text-sm font-semibold text-primary-fg transition duration-150 hover:brightness-110"
          >
            Go to Dashboard
            <ArrowRight size={15} />
          </Link>

          <Link
            to="/news"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[10px] border border-line bg-card px-5 text-sm font-semibold text-ink transition duration-150 hover:border-primary hover:text-primary"
          >
            More News
          </Link>
        </div>
      </div>
    </div>
  );
}
