import { useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, ListChecks, Sparkles } from "lucide-react";
import api from "../../api/api";
import Button from "../ui/Button";
import Toast from "../ui/Toast";

const formatDate = (value) => {
  if (!value) return "Today";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};

export default function NewsCard({
  news = {},
  showMcqAction = false,
  onMcqReady
}) {
  const id = news._id || news.id;
  const category = news.category || "Current Affairs";

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState("");

  const toggleSave = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (saving) return;

    setSaving(true);

    try {
      if (saved) {
        await api.delete(`/bookmark/${id}`);
      } else {
        await api.post("/bookmark", { newsId: id });
      }

      setSaved(!saved);
      setToast(saved ? "Removed from bookmarks" : "Saved to bookmarks");
    } catch (error) {
      setToast(
        error.response?.status === 401
          ? "Log in to save articles"
          : "Could not update bookmark"
      );
    } finally {
      setSaving(false);
    }
  };

  const generateMcqs = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (generating) return;

    setGenerating(true);

    try {
      await api.post(`/mcq/news/${id}/generate`);
      setToast("Quiz ready");
      onMcqReady?.(id);
    } catch (error) {
      setToast(
        error.response?.data?.message || "Could not generate MCQs"
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[14px] border border-line bg-card transition duration-150 hover:border-primary">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-primary-soft">
        {news.imageUrl ? (
          <img
            src={news.imageUrl}
            alt={news.title}
            loading="lazy"
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-lg font-bold text-primary">
              {category}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-bold uppercase tracking-wide text-primary">
          {category}
        </span>

        <h3 className="mt-1.5 font-display text-[19px] font-bold leading-tight text-ink">
          <Link
            to={`/news/${id}`}
            className="transition hover:text-primary"
          >
            {news.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-muted">
          {news.summary ||
            news.content ||
            "Read the latest exam relevant current affairs."}
        </p>

        <p className="mt-3 text-xs text-muted">
          <span className="font-semibold text-ink">
            {news.source || "Newsmania"}
          </span>{" "}
          &middot; {formatDate(news.publishedAt)}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
          <Link
            to={`/news/${id}`}
            aria-label="AI Analysis"
            title="AI Analysis"
            className="grid h-11 w-11 place-items-center rounded-[10px] border border-line bg-card text-ink transition duration-150 hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            <Sparkles size={17} />
          </Link>

          {showMcqAction && (
            <Button
              variant="outline"
              onClick={generateMcqs}
              loading={generating}
              aria-label="Practice MCQs"
              title="Practice MCQs"
            >
              {!generating && <ListChecks size={15} />}
              {generating ? "Generating" : "MCQs"}
            </Button>
          )}

          <Button
            variant="outline"
            iconOnly
            onClick={toggleSave}
            loading={saving}
            aria-pressed={saved}
            aria-label={saved ? "Remove bookmark" : "Save bookmark"}
            title={saved ? "Remove bookmark" : "Save bookmark"}
          >
            {!saving && (
              <Bookmark
                size={17}
                className={saved ? "fill-current" : ""}
              />
            )}
          </Button>

          <Link
            to={`/news/${id}`}
            className="ml-auto inline-flex h-11 items-center rounded-[10px] bg-primary px-4 text-sm font-semibold text-primary-fg transition duration-150 hover:brightness-110"
          >
            Read story
          </Link>
        </div>
      </div>

      <Toast
        open={Boolean(toast)}
        message={toast}
        onClose={() => setToast("")}
      />
    </article>
  );
}
