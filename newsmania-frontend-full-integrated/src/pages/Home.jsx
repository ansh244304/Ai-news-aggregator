import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bookmark,
  BookOpen,
  CheckCircle2,
  Flame,
  LayoutDashboard,
  Lightbulb,
  ListChecks,
  RefreshCw,
  Sparkles,
  Sunrise,
  Target,
  Trophy
} from "lucide-react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import NewsCard from "../components/news/NewsCard";
import Chip from "../components/ui/Chip";
import Panel from "../components/ui/Panel";
import Skeleton from "../components/ui/Skeleton";
import StreakStrip from "../components/ui/StreakStrip";
import { formatLongDate } from "../utils/format";

const NEWS_LIMIT = 6;

const HOME_CATEGORIES = [
  { key: "", label: "All" },
  { key: "National", label: "India" },
  { key: "International", label: "World" },
  { key: "Polity", label: "Politics" },
  { key: "Economy", label: "Business" },
  { key: "Science", label: "Science" },
  { key: "Technology", label: "Technology" },
  { key: "Sports", label: "Sports" },
  { key: "Environment", label: "Environment" }
];

const WEEK_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

const LEARN_CARDS = [
  {
    icon: Sparkles,
    title: "AI Analysis",
    text: "Break any story into a summary, key points and why it matters.",
    to: "/news"
  },
  {
    icon: ListChecks,
    title: "MCQs",
    text: "Practice exam-style questions generated from each story.",
    to: "/news"
  },
  {
    icon: Trophy,
    title: "Quizzes",
    text: "Test yourself, then review your score and accuracy.",
    to: "/daily-quiz"
  },
  {
    icon: Sunrise,
    title: "Daily Quiz",
    text: "Ten fresh questions every day to keep your streak alive.",
    to: "/daily-quiz"
  }
];

const btnPrimary =
  "inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-primary px-5 text-sm font-semibold text-primary-fg transition duration-150 hover:brightness-110";
const btnGhost =
  "inline-flex h-11 items-center justify-center gap-2 rounded-[10px] border border-white/25 px-5 text-sm font-semibold text-white transition duration-150 hover:bg-white/10";
const eyebrow =
  "text-[11px] font-bold uppercase tracking-[0.18em] text-primary";

const buildWeek = (streak = {}, dailyQuizDone = false) => {
  const todayIdx = (new Date().getDay() + 6) % 7;
  const current = streak.current || 0;

  return WEEK_LABELS.map((label, idx) => {
    if (idx === todayIdx) {
      return { label, state: dailyQuizDone ? "done" : "today" };
    }

    if (idx < todayIdx) {
      return { label, state: todayIdx - idx <= current ? "done" : "none" };
    }

    return { label, state: "none" };
  });
};

export default function Home() {
  const { isAuthenticated } = useAuth();

  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState("");
  const [category, setCategory] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const [dashboard, setDashboard] = useState(null);
  const [briefing, setBriefing] = useState(null);

  const stats = dashboard?.statistics || {};
  const streak = dashboard?.streak || briefing?.streak || {};
  const dailyQuizDone = Boolean(streak?.dailyQuizDone);
  const week = buildWeek(streak, dailyQuizDone);

  const topStory = news[0] || null;

  const loadNews = async (nextCategory = category) => {
    try {
      setNewsLoading(true);
      setNewsError("");

      const response = await api.get("/news", {
        params: {
          page: 1,
          limit: NEWS_LIMIT,
          ...(nextCategory ? { category: nextCategory } : {})
        }
      });

      setNews(response.data.news || []);
    } catch (error) {
      setNewsError(
        error.response?.data?.message || "Unable to load news right now."
      );
    } finally {
      setNewsLoading(false);
    }
  };

  useEffect(() => {
    loadNews(category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  useEffect(() => {
    if (!isAuthenticated) {
      setDashboard(null);
      setBriefing(null);
      return;
    }

    api
      .get("/dashboard")
      .then(({ data }) => setDashboard(data.data || null))
      .catch(() => setDashboard(null));

    api
      .get("/briefing/today")
      .then(({ data }) => setBriefing(data.data || null))
      .catch(() => setBriefing(null));
  }, [isAuthenticated]);

  const refreshLatestNews = async () => {
    if (refreshing) return;

    setRefreshing(true);
    setNewsError("");

    try {
      await api.get("/news/fetch/newsapi", {
        params: { query: "India", max: 10 }
      });

      await loadNews();
    } catch (error) {
      setNewsError(
        error.response?.data?.message ||
          "Unable to fetch the latest news right now."
      );
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <>
      {/* ================= TOP STORY + SIDE CARDS ================= */}

      <section className="px-4 pt-6 sm:px-6">
        <div className="mx-auto grid max-w-[1200px] gap-5 lg:grid-cols-[1.6fr_1fr]">
          <article className="flex flex-col rounded-[18px] bg-hero p-6 text-white sm:p-8">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-white">
              <Sparkles size={12} />
              {topStory?.category || "Top Story"}
            </span>

            <h1 className="mt-4 font-display text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
              {topStory?.title || "Your daily dose of current affairs"}
            </h1>

            <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/75 sm:text-base">
              {topStory?.summary ||
                topStory?.content ||
                "Fetch the latest news to see today's top story, then analyse it with AI."}
            </p>

            <p className="mt-4 text-xs font-semibold text-white/60">
              {topStory?.source || "Newsmania"} &middot;{" "}
              {formatLongDate(new Date())}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to={topStory ? `/news/${topStory._id}` : "/news"}
                className={btnPrimary}
              >
                Read story
                <ArrowRight size={16} />
              </Link>

              {topStory && (
                <>
                  <Link to={`/news/${topStory._id}`} className={btnGhost}>
                    <Sparkles size={16} />
                    AI Analysis
                  </Link>

                  <Link to={`/quiz/${topStory._id}`} className={btnGhost}>
                    <ListChecks size={16} />
                    Practice MCQs
                  </Link>
                </>
              )}
            </div>
          </article>

          <div className="flex flex-col gap-5">
            {/* ===== DAILY QUIZ CARD ===== */}

            <Panel className="flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className={eyebrow}>Daily Quiz</span>

                  <h2 className="mt-1 font-display text-lg font-extrabold tracking-tight text-ink">
                    Keep your streak alive
                  </h2>
                </div>

                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-streak/15 px-3 py-1 text-sm font-bold text-streak">
                  <Flame size={15} />
                  {streak.current || 0}
                </span>
              </div>

              <p className="mt-4 text-[11px] font-bold uppercase tracking-wide text-muted">
                This week
              </p>

              <div className="mt-2">
                <StreakStrip days={week} />
              </div>

              <Link to="/daily-quiz" className={`${btnPrimary} mt-5 w-full`}>
                Start today&apos;s quiz
              </Link>
            </Panel>

            {/* ===== DASHBOARD CARD ===== */}

            <Panel className="flex flex-col">
              <div className="flex items-center justify-between">
                <span className={eyebrow}>Dashboard</span>

                <Link
                  to={isAuthenticated ? "/dashboard" : "/register"}
                  aria-label="Open full dashboard"
                  className="grid h-11 w-11 place-items-center rounded-[10px] text-muted transition duration-150 hover:bg-primary-soft hover:text-primary"
                >
                  <LayoutDashboard size={18} />
                </Link>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-3">
                {[
                  {
                    icon: Trophy,
                    value: stats.totalQuizzes || 0,
                    label: "Quizzes taken"
                  },
                  {
                    icon: Target,
                    value: `${stats.accuracy || 0}%`,
                    label: "Accuracy"
                  },
                  {
                    icon: Bookmark,
                    value: stats.totalBookmarks || 0,
                    label: "Bookmarks"
                  }
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.label} className="text-center">
                      <span className="mx-auto grid h-9 w-9 place-items-center rounded-[10px] bg-primary-soft text-primary">
                        <Icon size={17} />
                      </span>

                      <p className="mt-2 font-display text-xl font-bold leading-none text-ink">
                        {item.value}
                      </p>

                      <p className="mt-1 text-[11px] font-semibold text-muted">
                        {item.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              <Link
                to={isAuthenticated ? "/dashboard" : "/register"}
                className="mt-5 inline-flex items-center gap-1.5 self-start text-sm font-bold text-primary transition duration-150 hover:gap-2.5"
              >
                View full dashboard
                <ArrowRight size={15} />
              </Link>
            </Panel>
          </div>
        </div>
      </section>

      {/* ================= CATEGORY CHIPS + LATEST NEWS ================= */}

      <section className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className={eyebrow}>Latest News</span>

              <h2 className="mt-1.5 font-display text-2xl font-extrabold tracking-tight text-ink">
                Stay on top of current affairs
              </h2>
            </div>

            <button
              type="button"
              onClick={refreshLatestNews}
              disabled={refreshing}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[10px] border border-line bg-card px-4 text-sm font-semibold text-ink transition duration-150 hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={15}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Fetching" : "Refresh"}
            </button>
          </div>

          <div
            role="group"
            aria-label="Filter by category"
            className="mb-5 flex flex-wrap gap-2"
          >
            {HOME_CATEGORIES.map((item) => (
              <Chip
                key={item.key || "all"}
                selected={category === item.key}
                onClick={() => setCategory(item.key)}
              >
                {item.label}
              </Chip>
            ))}
          </div>

          {newsError && (
            <p
              role="alert"
              className="mb-4 rounded-[14px] border border-danger/40 bg-danger/10 p-3 text-sm text-danger"
            >
              {newsError}
            </p>
          )}

          {newsLoading && !news.length ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <Skeleton key={item} className="h-80" />
              ))}
            </div>
          ) : news.length ? (
            <div
              className={`grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 ${
                newsLoading ? "opacity-60 transition" : ""
              }`}
            >
              {news.map((item) => (
                <NewsCard key={item._id} news={item} showMcqAction />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-line bg-card p-10 text-center text-sm text-muted">
              No stories match this category.
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/news"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary transition hover:gap-2.5"
            >
              View all news
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= AI ANALYSIS PREVIEW ================= */}

      {topStory && (
        <section className="px-4 pb-8 sm:px-6">
          <div className="mx-auto max-w-[1200px]">
            <Panel>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className={eyebrow}>AI Analysis</span>

                  <h2 className="mt-1 font-display text-xl font-extrabold tracking-tight text-ink">
                    {topStory.title}
                  </h2>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-[11px] font-bold text-primary">
                  <Sparkles size={12} />
                  Story preview
                </span>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-3">
                <div>
                  <h3 className="flex items-center gap-2 font-display text-sm font-bold text-ink">
                    <BookOpen size={16} className="text-primary" />
                    Summary
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted">
                    {topStory.summary ||
                      topStory.content ||
                      "Open the story to generate a concise summary with AI."}
                  </p>
                </div>

                <div>
                  <h3 className="flex items-center gap-2 font-display text-sm font-bold text-ink">
                    <ListChecks size={16} className="text-primary" />
                    Key points
                  </h3>

                  {topStory.facts?.length ? (
                    <ul className="mt-2 space-y-1.5">
                      {topStory.facts.slice(0, 4).map((fact) => (
                        <li
                          key={fact}
                          className="flex gap-2 text-sm leading-6 text-muted"
                        >
                          <CheckCircle2
                            size={15}
                            className="mt-1 shrink-0 text-primary"
                          />
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm leading-6 text-muted">
                      Open the story and run AI Analysis to pull out the key
                      points.
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="flex items-center gap-2 font-display text-sm font-bold text-ink">
                    <Lightbulb size={16} className="text-primary" />
                    Why it matters
                  </h3>

                  {topStory.exams?.length ? (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {topStory.exams.map((exam) => (
                        <span
                          key={exam}
                          className="rounded-[6px] bg-primary-soft px-2 py-0.5 text-[11px] font-bold text-primary"
                        >
                          {exam}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm leading-6 text-muted">
                      Open the story to see why it matters for your exam
                      preparation.
                    </p>
                  )}
                </div>
              </div>

              <Link
                to={`/quiz/${topStory._id}`}
                className={`${btnPrimary} mt-5`}
              >
                Generate MCQs from this story
                <ArrowRight size={16} />
              </Link>
            </Panel>
          </div>
        </section>
      )}

      {/* ================= LEARN FROM THE NEWS ================= */}

      <section className="px-4 pb-8 sm:px-6">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-5">
            <span className={eyebrow}>Learn from the news</span>

            <h2 className="mt-1.5 font-display text-2xl font-extrabold tracking-tight text-ink">
              Four ways to study every story
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {LEARN_CARDS.map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.title}
                  to={card.to}
                  className="group flex flex-col rounded-[14px] border border-line bg-card p-5 transition duration-150 hover:-translate-y-0.5 hover:border-primary"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-[10px] bg-primary-soft text-primary">
                    <Icon size={19} />
                  </span>

                  <h3 className="mt-3 font-display text-base font-bold text-ink">
                    {card.title}
                  </h3>

                  <p className="mt-1.5 flex-1 text-sm leading-6 text-muted">
                    {card.text}
                  </p>

                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-primary transition duration-150 group-hover:gap-2.5">
                    Explore
                    <ArrowRight size={15} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= SIGN-UP BAND ================= */}

      {!isAuthenticated && (
        <section className="px-4 pb-10 sm:px-6">
          <div className="mx-auto max-w-[1200px]">
            <div className="flex flex-col items-start justify-between gap-5 rounded-[18px] bg-hero p-8 text-white sm:flex-row sm:items-center">
              <div>
                <h2 className="font-display text-2xl font-extrabold tracking-tight text-white">
                  Create your free account
                </h2>

                <p className="mt-1.5 text-sm text-white/75">
                  Save stories, take daily quizzes and track your preparation.
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-3">
                <Link to="/register" className={btnPrimary}>
                  Sign up
                </Link>

                <Link to="/login" className={btnGhost}>
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
