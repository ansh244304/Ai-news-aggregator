import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Flame,
  ListChecks,
  Trophy
} from "lucide-react";
import api from "../../api/api";
import Loading from "../../components/common/Loading";
import { formatLongDate } from "../../utils/format";

export default function DailyQuiz() {
  const [quiz, setQuiz] = useState(null);
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const nav = useNavigate();

  useEffect(() => {
    setLoading(true);

    api
      .get("/daily-quiz/today")
      .then(({ data }) => setQuiz(data.data || null))
      .catch((requestError) =>
        setError(
          requestError.response?.data?.message || "Daily quiz unavailable"
        )
      )
      .finally(() => setLoading(false));

    api
      .get("/briefing/today")
      .then(({ data }) => setStreak(data.data?.streak || null))
      .catch(() => setStreak(null));
  }, []);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-line bg-card p-8 text-center">
          <h2 className="font-display text-xl font-bold text-ink">
            Daily quiz unavailable
          </h2>

          <p className="mt-2 text-sm text-muted">{error}</p>

          <Link
            to="/"
            className="mt-6 inline-flex h-11 items-center rounded-[10px] bg-primary px-5 text-sm font-semibold text-primary-fg transition duration-150 hover:brightness-110"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-line bg-card p-8 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-bg">
            <CalendarDays size={24} className="text-muted" />
          </div>

          <h2 className="font-display text-xl font-bold text-ink">
            No quiz today
          </h2>

          <p className="mt-2 text-sm text-muted">
            A new daily challenge is published every morning. Check back
            soon.
          </p>

          <Link
            to="/briefing"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-[10px] bg-primary px-5 text-sm font-semibold text-primary-fg transition duration-150 hover:brightness-110"
          >
            Open Daily Briefing
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl">
        {/* ================= HERO ================= */}

        <section className="overflow-hidden rounded-[18px] border border-line bg-card">
          <div className="bg-hero px-6 py-8 text-center text-white sm:px-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-white">
              <Trophy size={12} />
              Today&apos;s Challenge
            </span>

            <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              {quiz.title}
            </h1>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-white/75">
              {quiz.description}
            </p>

            <p className="mt-3 text-xs font-semibold text-white/60">
              {formatLongDate(new Date())}
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-bg px-3.5 py-1.5 text-sm font-semibold text-ink">
                <ListChecks size={15} className="text-primary" />
                {quiz.totalQuestions} Questions
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-bg px-3.5 py-1.5 text-sm font-semibold text-ink">
                <Clock size={15} className="text-primary" />
                ~5 minutes
              </span>

              {streak?.current > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-streak/10 px-3.5 py-1.5 text-sm font-semibold text-streak">
                  <Flame size={15} />
                  {streak.current} day streak
                </span>
              )}
            </div>

            <div
              className={`mt-6 flex items-start gap-3 rounded-[14px] border p-4 ${
                streak?.dailyQuizDone
                  ? "border-success/40 bg-success/10"
                  : "border-primary/30 bg-primary-soft"
              }`}
            >
              {streak?.dailyQuizDone ? (
                <CheckCircle2
                  size={20}
                  className="mt-0.5 shrink-0 text-success"
                />
              ) : (
                <Flame
                  size={20}
                  className="mt-0.5 shrink-0 text-primary"
                />
              )}

              <p className="text-sm font-medium text-ink">
                {streak?.dailyQuizDone
                  ? "You have already played today's quiz. You can still revise it for a better score."
                  : streak?.current > 0
                    ? `Play today's quiz to keep your ${streak.current} day streak alive.`
                    : "Play today's quiz to start your daily streak."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => nav("/daily-quiz/start", { state: { quiz } })}
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-primary px-5 text-sm font-semibold text-primary-fg transition duration-150 hover:brightness-110"
            >
              Start Quiz
              <ArrowRight size={16} />
            </button>

            <p className="mt-3 text-center text-xs text-muted">
              Your answers are saved when you submit the quiz.
            </p>
          </div>
        </section>

        {/* ================= RULES ================= */}

        <section className="mt-4 rounded-2xl border border-line bg-card p-5 sm:p-6">
          <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-muted">
            How the daily quiz works
          </h2>

          <ul className="mt-3 space-y-2.5">
            {[
              "One fresh set of questions is published every day.",
              "Submitting once completes the quiz for that day.",
              "Submitting keeps your streak alive and unlocks badges at 7, 30 and 100 days.",
              "You can revisit the quiz any time to improve your score."
            ].map((rule) => (
              <li
                key={rule}
                className="flex gap-2.5 text-sm text-ink"
              >
                <CheckCircle2
                  size={16}
                  className="mt-0.5 shrink-0 text-primary"
                />
                {rule}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
