import { Loader2, RefreshCw } from "lucide-react";
import NewsCard from "./NewsCard";
import Skeleton from "../ui/Skeleton";

export default function HomeFeedSection({
  eyebrow,
  title,
  description,
  items = [],
  loading,
  error,
  onRefresh,
  refreshLabel = "Refresh",
  refreshing = false,
  showMcqAction = false
}) {
  const busy = loading || refreshing;

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            {eyebrow && (
              <span className="text-xs font-bold uppercase tracking-wide text-primary">
                {eyebrow}
              </span>
            )}

            <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-ink">
              {title}
            </h2>

            {description && (
              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted">
                {description}
              </p>
            )}
          </div>

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={busy}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[10px] border border-line bg-card px-4 text-sm font-semibold text-ink transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <RefreshCw size={16} />
              )}
              {refreshing ? "Fetching..." : busy ? "Loading..." : refreshLabel}
            </button>
          )}
        </div>

        {error && (
          <p
            role="alert"
            className="mb-4 rounded-[14px] border border-danger/40 bg-danger/10 p-3 text-sm text-danger"
          >
            {error}
          </p>
        )}

        {loading && !items.length ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-80" />
            ))}
          </div>
        ) : items.length ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.slice(0, 3).map((item) => (
              <NewsCard
                key={item._id}
                news={item}
                showMcqAction={showMcqAction}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-line bg-card p-10 text-center text-sm text-muted">
            No updates available yet.
          </div>
        )}
      </div>
    </section>
  );
}
