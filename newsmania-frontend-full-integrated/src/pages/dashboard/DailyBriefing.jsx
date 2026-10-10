import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Newspaper,
  Sparkles,
  Timer,
  TriangleAlert,
  Trophy
} from "lucide-react";
import api from "../../api/api";
import StreakCard from "../../components/dashboard/StreakCard";
import EmptyState from "../../components/ui/EmptyState";
import { formatLongDate, readingMinutes } from "../../utils/format";

export default function DailyBriefing() {
  const [briefing, setBriefing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBriefing = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/briefing/today");
      setBriefing(response.data.data || null);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Failed to load your daily briefing"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBriefing();
  }, []);

  if (loading) {
    return (
      <div className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 space-y-3">
            <div className="h-4 w-32 animate-pulse rounded bg-line" />
            <div className="h-10 w-80 max-w-full animate-pulse rounded bg-line" />
            <div className="h-5 w-64 animate-pulse rounded bg-line" />
          </div>

          <div className="mb-6 h-64 animate-pulse rounded-2xl bg-line" />

          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-36 animate-pulse rounded-2xl bg-line"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-line bg-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-danger/10 text-danger">
            <TriangleAlert size={24} />
          </div>

          <h2 className="mb-2 font-display text-xl font-bold text-ink">
            Briefing unavailable
          </h2>

          <p className="mb-6 text-sm text-muted">{error}</p>

          <button
            type="button"
            onClick={loadBriefing}
            className="inline-flex h-11 items-center rounded-[10px] bg-primary px-5 text-sm font-semibold text-primary-fg transition duration-150 hover:brightness-110"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!briefing) return null;

  const {
    greeting,
    firstName,
    date,
    stories,
    storyCount,
    streak,
    dailyQuiz,
    todayAttempt
  } = briefing;

  const quizDone = streak?.dailyQuizDone;

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* ================= GREETING ================= */}

        <header className="mb-7">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold tracking-[0.15em] text-primary">
            <Sparkles size={13} />
            DAILY BRIEFING
          </span>

          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {greeting}
            {firstName ? `, ${firstName}!` : "!"}
          </h1>

          <p className="mt-2 text-base text-muted">
            Here are today&apos;s{" "}
            <span className="font-bold text-ink">
              {storyCount} important stories
            </span>
            .
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm font-semibold text-muted">
            <span>{formatLongDate(`${date}T00:00:00Z`)}</span>

            <span className="inline-flex items-center gap-1.5">
              <Timer size={14} />
              {readingMinutes(storyCount)} min read
            </span>
          </div>
        </header>

        {/* ================= STREAK ================= */}

        <div className="mb-6">
          <StreakCard streak={streak} />
        </div>

        {/* ================= DAILY QUIZ CTA ================= */}

        <div
          className={`mb-8 flex flex-col justify-between gap-4 rounded-2xl border p-6 sm:flex-row sm:items-center ${
            quizDone
              ? "border-success/40 bg-success/10"
              : "border-primary/30 bg-primary-soft"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] ${
                quizDone
                  ? "bg-success text-white"
                  : "bg-primary text-primary-fg"
              }`}
            >
              {quizDone ? (
                <CheckCircle2 size={24} />
              ) : (
                <Trophy size={24} />
              )}
            </div>

            <div>
              <h2 className="font-display text-lg font-bold text-ink">
                {quizDone
                  ? "Today's quiz is done"
                  : "Take today's daily quiz"}
              </h2>

              <p className="mt-1 text-sm text-muted">
                {quizDone
                  ? todayAttempt
                    ? `You scored ${todayAttempt.score}/${todayAttempt.totalQuestions} (${todayAttempt.percentage}%). Your streak is secure.`
                    : "Your streak is secure for today."
                  : dailyQuiz
                    ? `${dailyQuiz.title} · ${dailyQuiz.totalQuestions} questions. ${
                        streak?.status === "at_risk" && streak?.current > 0
                          ? `Play it now to keep your ${streak.current} day streak.`
                          : "Play it to build your streak."
                      }`
                    : "No quiz has been published for today yet. Check back soon."}
              </p>
            </div>
          </div>

          {dailyQuiz && !quizDone && (
            <Link
              to="/daily-quiz"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[10px] bg-primary px-5 text-sm font-semibold text-primary-fg transition duration-150 hover:brightness-110"
            >
              Start Quiz
              <ArrowRight size={16} />
            </Link>
          )}

          {quizDone && (
            <Link
              to="/dashboard"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[10px] border border-success/40 bg-card px-5 text-sm font-semibold text-success transition duration-150 hover:bg-success/10"
            >
              View Dashboard
              <ArrowRight size={16} />
            </Link>
          )}
        </div>

        {/* ================= STORIES ================= */}

        <h2 className="mb-1 font-display text-2xl font-extrabold tracking-tight text-ink">
          Today&apos;s Top Stories
        </h2>

        <p className="mb-5 text-sm text-muted">
          Ranked by freshness, exam relevance and depth of coverage.
        </p>

        {stories.length === 0 ? (
          <EmptyState
            icon={<Newspaper size={22} />}
            title="No stories yet"
            text="Fetch the latest news to build today's briefing."
            action={
              <Link
                to="/news"
                className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-primary px-5 text-sm font-semibold text-primary-fg transition duration-150 hover:brightness-110"
              >
                Go to Current Affairs
                <ArrowRight size={16} />
              </Link>
            }
          />
        ) : (
          <ol className="space-y-4">
            {stories.map((story, index) => (
              <li key={story._id}>
                <article className="group flex h-full gap-4 overflow-hidden rounded-2xl border border-line bg-card p-5 transition duration-150 hover:-translate-y-0.5 hover:border-primary sm:gap-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-primary font-display text-lg font-bold text-primary-fg">
                    {index + 1}
                  </div>

                  <div className="hidden h-28 w-40 shrink-0 overflow-hidden rounded-[14px] bg-bg sm:block">
                    <img
                      src={
                        story.imageUrl ||
                        "https://placehold.co/400x280?text=Newsmania"
                      }
                      alt={story.title}
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.src =
                          "https://placehold.co/400x280?text=Newsmania";
                      }}
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-[6px] bg-primary px-2 py-0.5 font-semibold text-primary-fg">
                        {story.category || "Current Affairs"}
                      </span>

                      <span className="truncate font-bold text-primary">
                        {story.source}
                      </span>

                      {story.publishedAt && (
                        <span className="whitespace-nowrap text-muted">
                          {new Date(story.publishedAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short"
                            }
                          )}
                        </span>
                      )}

                      {story.exams?.length > 0 && (
                        <span className="rounded-[6px] bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
                          {story.exams.join(" · ")}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold leading-snug text-ink transition duration-150 group-hover:text-primary">
                      {story.title}
                    </h3>

                    <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-muted">
                      {story.summary ||
                        "Summary will appear once this story has been analysed."}
                    </p>

                    <div className="mt-auto pt-3">
                      <Link
                        to={`/news/${story._id}`}
                        className="inline-flex items-center gap-1 text-sm font-bold text-primary transition duration-150 hover:gap-2"
                      >
                        Read full story
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
