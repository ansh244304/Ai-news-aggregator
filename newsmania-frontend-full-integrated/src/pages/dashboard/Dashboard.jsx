import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bookmark,
  BookOpenCheck,
  Brain,
  CalendarDays,
  Flame,
  Sparkles,
  Target,
  Trophy
} from "lucide-react";
import api from "../../api/api";
import Loading from "../../components/common/Loading";
import StatCard from "../../components/dashboard/StatCard";
import StreakCard from "../../components/dashboard/StreakCard";
import WeekStrip from "../../components/dashboard/WeekStrip";
import Panel from "../../components/ui/Panel";
import ProgressBar from "../../components/ui/ProgressBar";
import { formatLongDate, getFirstName, getGreeting } from "../../utils/format";

// Groups quiz attempts into the last seven IST days, oldest bucket first
const buildActivity = (attempts = []) => {
  const buckets = new Array(7).fill(0);
  const now = Date.now();

  const istKey = (value) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(new Date(value));

  const today = istKey(now);

  attempts.forEach((attempt) => {
    const when = attempt.createdAt || attempt.attemptedAt;
    if (!when) return;

    const dayDiff = Math.round(
      (Date.parse(`${today}T00:00:00Z`) -
        Date.parse(`${istKey(when)}T00:00:00Z`)) /
        86400000
    );

    if (dayDiff >= 0 && dayDiff < 7) {
      buckets[6 - dayDiff] += 1;
    }
  });

  return buckets;
};

const scoreTone = (percentage) => {
  if (percentage >= 80) return "success";
  if (percentage >= 50) return "primary";

  return "danger";
};

const scoreToneClass = {
  success: "bg-success/10 text-success",
  primary: "bg-primary-soft text-primary",
  danger: "bg-danger/10 text-danger"
};

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);

    api
      .get("/dashboard")
      .then(({ data }) => setDashboard(data.data || null))
      .catch((requestError) =>
        setError(
          requestError.response?.data?.message ||
            "Failed to load your dashboard"
        )
      )
      .finally(() => setLoading(false));
  }, []);

  const activity = useMemo(
    () => buildActivity(dashboard?.recentAttempts || []),
    [dashboard]
  );

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-line bg-card p-8 text-center">
          <h2 className="font-display text-xl font-bold text-ink">
            Dashboard unavailable
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

  if (!dashboard) return null;

  const { user, statistics, streak, recentAttempts, bookmarks } = dashboard;

  const stats = statistics || {};
  const attempts = recentAttempts || [];
  const saved = bookmarks || [];

  const totalQuizzes = stats.totalQuizzes || 0;
  const totalQuestions = stats.totalQuestions || 0;
  const accuracy = stats.accuracy || 0;

  const quizzesThisWeek = activity.reduce((sum, count) => sum + count, 0);

  const bestAttempt = attempts.reduce(
    (best, attempt) =>
      !best || (attempt.percentage || 0) > (best.percentage || 0)
        ? attempt
        : best,
    null
  );

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-[1200px]">
        {/* ================= HEADER ================= */}

        <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
              <Sparkles size={12} />
              My Space
            </span>

            <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              {getGreeting()}
              {user?.name ? `, ${getFirstName(user.name)}` : ""}
            </h1>

            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
              <CalendarDays size={14} />
              {formatLongDate(new Date())}
            </p>
          </div>

          <Link
            to="/briefing"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[10px] bg-primary px-4 text-sm font-semibold text-primary-fg transition duration-150 hover:brightness-110"
          >
            Open Daily Briefing
            <ArrowRight size={15} />
          </Link>
        </header>

        {/* ================= STATISTICS ================= */}

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          <StatCard
            icon={<Flame size={19} />}
            value={`${streak?.current || 0} day`}
            label="Day Streak"
          />
          <StatCard
            icon={<Trophy size={19} />}
            value={totalQuizzes}
            label="Quizzes Taken"
          />
          <StatCard
            icon={<Brain size={19} />}
            value={totalQuestions}
            label="MCQs Solved"
          />
          <StatCard
            icon={<Target size={19} />}
            value={`${accuracy}%`}
            label="Average Score"
          />
          <StatCard
            icon={<Bookmark size={19} />}
            value={stats.totalBookmarks || 0}
            label="Articles Saved"
          />
        </div>

        {/* ================= WEEKLY ACTIVITY ================= */}

        <Panel className="mt-4 sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-lg font-bold tracking-tight text-ink">
                This Week
              </h2>

              <p className="mt-1 text-sm text-muted">
                {quizzesThisWeek
                  ? `You attempted ${quizzesThisWeek} quiz${quizzesThisWeek === 1 ? "" : "zes"} in the last seven days.`
                  : "No quiz attempts in the last seven days. Start with today's daily quiz."}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <WeekStrip activity={activity} />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 border-t border-line pt-5 sm:grid-cols-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted">
                Best Score
              </p>
              <p className="mt-1 font-display text-lg font-bold text-ink">
                {bestAttempt ? `${bestAttempt.percentage}%` : "—"}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted">
                Accuracy
              </p>
              <ProgressBar value={accuracy} className="mt-2" />
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted">
                Longest Streak
              </p>
              <p className="mt-1 font-display text-lg font-bold text-ink">
                {streak?.longest || 0} day
                {streak?.longest === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        </Panel>

        {/* ================= STREAK & BADGES ================= */}

        <div className="mt-4">
          <StreakCard streak={streak} />
        </div>

        {/* ================= ATTEMPTS + BOOKMARKS ================= */}

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-ink">
                <BookOpenCheck size={18} className="text-primary" />
                Recent Quizzes
              </h2>

              <span className="text-xs font-semibold text-muted">
                {attempts.length} recent
              </span>
            </div>

            {attempts.length ? (
              <ul className="divide-y divide-line">
                {attempts.map((attempt) => (
                  <li
                    key={attempt._id}
                    className="flex items-center gap-4 py-3.5"
                  >
                    <div
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-[10px] text-sm font-bold ${scoreToneClass[scoreTone(attempt.percentage)]}`}
                    >
                      {attempt.percentage}%
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-ink">
                        {attempt.newsId?.title ||
                          attempt.title ||
                          "Daily Quiz"}
                      </p>

                      <p className="mt-0.5 text-xs text-muted">
                        {attempt.score ?? 0}/
                        {attempt.totalQuestions ?? 0} correct
                        {attempt.createdAt
                          ? ` · ${new Date(
                              attempt.createdAt
                            ).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short"
                            })}`
                          : ""}
                      </p>
                    </div>

                    {attempt.newsId?._id && (
                      <Link
                        to={`/news/${attempt.newsId._id}`}
                        className="shrink-0 text-xs font-bold text-primary hover:underline"
                      >
                        Review
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-10 text-center">
                <p className="text-sm text-muted">No quiz attempts yet.</p>

                <Link
                  to="/daily-quiz"
                  className="mt-4 inline-flex h-11 items-center gap-2 rounded-[10px] bg-primary px-4 text-sm font-semibold text-primary-fg transition duration-150 hover:brightness-110"
                >
                  Take Daily Quiz
                  <ArrowRight size={15} />
                </Link>
              </div>
            )}
          </Panel>

          <Panel className="sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-ink">
                <Bookmark size={18} className="text-primary" />
                Saved Articles
              </h2>

              <Link
                to="/bookmarks"
                className="text-xs font-bold text-primary hover:underline"
              >
                View all
              </Link>
            </div>

            {saved.length ? (
              <ul className="space-y-3">
                {saved.slice(0, 6).map((item) => (
                  <li key={item._id}>
                    <Link
                      to={`/news/${item.newsId?._id || item._id}`}
                      className="group block rounded-[14px] border border-line bg-bg p-3 transition duration-150 hover:border-primary"
                    >
                      <p className="line-clamp-2 text-sm font-semibold text-ink transition duration-150 group-hover:text-primary">
                        {item.newsId?.title ||
                          item.title ||
                          "Saved article"}
                      </p>

                      <p className="mt-1 text-[11px] font-semibold text-muted">
                        {item.newsId?.source || item.source || "Newsmania"}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-10 text-center">
                <p className="text-sm text-muted">Nothing saved yet.</p>

                <Link
                  to="/news"
                  className="mt-4 inline-flex h-11 items-center gap-2 rounded-[10px] border border-line px-4 text-sm font-semibold text-ink transition duration-150 hover:border-primary hover:text-primary"
                >
                  Browse News
                  <ArrowRight size={15} />
                </Link>
              </div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
