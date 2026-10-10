import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  KeyRound,
  ListChecks,
  Loader2,
  Sparkles,
  Target,
  Wand2
} from "lucide-react";
import api from "../../api/api";
import Loading from "../../components/common/Loading";

// GNews marks its truncated preview with a trailing "... [NNNN chars]"
const cleanContent = (content = "") =>
  content
    .replace(/\s*\.\.\.\s*\[\d+\s+chars?\]\s*$/i, "")
    .trim();

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
      })
    : "";

const chip =
  "rounded-full bg-bg px-2.5 py-0.5 text-[11px] font-semibold text-primary";

export default function NewsDetails() {
  const { id } = useParams();

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [generating, setGenerating] = useState(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);

    api
      .get(`/news/${id}`)
      .then(({ data }) => setNews(data.news || data.data || data))
      .catch((requestError) =>
        setError(
          requestError.response?.data?.message ||
            "Failed to load this article"
        )
      )
      .finally(() => setLoading(false));
  }, [id]);

  const analyze = async () => {
    setAnalyzing(true);
    setError("");

    try {
      const { data } = await api.post(`/ai/news/${id}/analyze`);

      setNews((current) => ({
        ...current,
        ...(data.data || {})
      }));
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "AI analysis failed"
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const generateMcqs = async (count) => {
    setGenerating(count);
    setError("");

    try {
      await api.post(`/mcq/news/${id}/generate`, {
        numberOfQuestions: count
      });

      setError("");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Could not generate MCQs"
      );
    } finally {
      setGenerating(null);
    }
  };

  const toggleBookmark = async () => {
    try {
      if (saved) {
        await api.delete(`/bookmark/${id}`);
      } else {
        await api.post("/bookmark", { newsId: id });
      }

      setSaved(!saved);
    } catch {
      setError("Log in to save this article");
    }
  };

  if (loading) return <Loading />;

  if (error && !news) {
    return (
      <div className="px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <p
            role="alert"
            className="rounded-[14px] border border-danger/40 bg-danger/10 p-4 text-sm text-danger"
          >
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!news) return null;

  const content = cleanContent(news.content);
  const paragraphs = content
    ? content
        .split(/(?<=[.!?])\s+(?=[A-Z"'“(\d])/)
        .map((part) => part.trim())
        .filter(Boolean)
    : [];

  const hasAnalysis = Boolean(
    news.summary || news.facts?.length || news.keywords?.length
  );

  const outlineButton =
    "inline-flex h-11 items-center gap-2 rounded-[10px] border border-line bg-card px-4 text-sm font-semibold text-ink transition duration-150 hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60";

  const primaryButton =
    "inline-flex h-11 items-center gap-2 rounded-[10px] bg-primary px-4 text-sm font-semibold text-primary-fg transition duration-150 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="px-4 py-8 sm:px-6">
      <article className="mx-auto max-w-3xl">
        {/* ================= HEADER ================= */}

        <header>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">
              {news.category || "Current Affairs"}
            </span>

            {news.exams?.map((exam) => (
              <span
                key={exam}
                className="rounded-full border border-line px-3 py-1 text-[11px] font-semibold text-muted"
              >
                {exam}
              </span>
            ))}
          </div>

          <h1 className="mt-4 font-display text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-3xl">
            {news.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted">
            <span className="font-bold text-primary">{news.source}</span>
            <span>{formatDate(news.publishedAt)}</span>

            {news.sourceUrl && (
              <a
                href={news.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-primary transition duration-150 hover:underline"
              >
                Read at source
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        </header>

        {/* ================= ACTIONS ================= */}

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={toggleBookmark}
            className={outlineButton}
          >
            {saved ? (
              <BookmarkCheck size={16} />
            ) : (
              <Bookmark size={16} />
            )}
            {saved ? "Saved" : "Save Article"}
          </button>

          <Link to={`/quiz/${id}`} className={primaryButton}>
            <ListChecks size={16} />
            Take Quiz
          </Link>
        </div>

        {news.imageUrl && (
          <img
            src={news.imageUrl}
            alt={news.title}
            className="mt-6 aspect-[16/9] w-full rounded-2xl border border-line object-cover"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        )}

        {/* ================= BODY ================= */}

        {news.summary && (
          <p className="mt-6 border-l-2 border-primary pl-4 text-base font-medium leading-7 text-ink">
            {news.summary}
          </p>
        )}

        <div className="mt-4 space-y-4 text-[15px] leading-7 text-muted">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* ================= AI STUDY MODE ================= */}

        <section className="mt-8 rounded-2xl border border-primary/30 bg-primary-soft p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-primary text-primary-fg">
                <Sparkles size={17} />
              </span>
              <div>
                <h2 className="text-sm font-extrabold uppercase tracking-[0.15em] text-primary">
                  AI Study Mode
                </h2>
                <p className="text-xs text-muted">
                  Everything you need to revise this story
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={analyze}
              disabled={analyzing}
              className={primaryButton}
            >
              {analyzing ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Wand2 size={15} />
              )}
              {analyzing ? "Analysing..." : "Explain This"}
            </button>
          </div>

          {error && (
            <p className="mt-4 rounded-[10px] border border-danger/40 bg-card px-3 py-2 text-xs font-semibold text-danger">
              {error}
            </p>
          )}

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-[14px] border border-line bg-card p-4">
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted">
                <Sparkles size={13} className="text-primary" />
                Quick Summary
              </h3>
              <p className="mt-2 text-sm leading-6 text-ink">
                {news.summary || "Run Explain This to generate a summary."}
              </p>
            </div>

            <div className="rounded-[14px] border border-line bg-card p-4">
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted">
                <ListChecks size={13} className="text-primary" />
                5 Key Facts
              </h3>
              {news.facts?.length ? (
                <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-sm leading-6 text-ink">
                  {news.facts.map((fact, index) => (
                    <li key={index}>{fact}</li>
                  ))}
                </ol>
              ) : (
                <p className="mt-2 text-sm text-muted">
                  No facts generated yet.
                </p>
              )}
            </div>

            <div className="rounded-[14px] border border-line bg-card p-4">
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted">
                <KeyRound size={13} className="text-primary" />
                Important Keywords
              </h3>
              {news.keywords?.length ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {news.keywords.map((keyword) => (
                    <span key={keyword} className={chip}>
                      {keyword}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-muted">
                  No keywords generated yet.
                </p>
              )}
            </div>

            <div className="rounded-[14px] border border-line bg-card p-4">
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted">
                <Target size={13} className="text-primary" />
                Relevant Exams
              </h3>
              {news.exams?.length ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {news.exams.map((exam) => (
                    <span key={exam} className={chip}>
                      {exam}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-muted">
                  No exams mapped yet.
                </p>
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 border-t border-primary/20 pt-4">
            <Link to={`/quiz/${id}`} className={primaryButton}>
              Generate 5 MCQs
            </Link>

            <button
              type="button"
              onClick={() => generateMcqs(10)}
              disabled={generating !== null}
              className={outlineButton}
            >
              {generating === 10 && (
                <Loader2 size={15} className="animate-spin" />
              )}
              Generate 10 MCQs
            </button>

            <button
              type="button"
              onClick={toggleBookmark}
              className={outlineButton}
            >
              {saved ? (
                <BookmarkCheck size={15} />
              ) : (
                <Bookmark size={15} />
              )}
              {saved ? "Article Saved" : "Save Article"}
            </button>
          </div>

          {!hasAnalysis && (
            <p className="mt-3 text-xs text-muted">
              Run Explain This once to fill in the summary, facts and
              keywords for this story.
            </p>
          )}
        </section>
      </article>
    </div>
  );
}
