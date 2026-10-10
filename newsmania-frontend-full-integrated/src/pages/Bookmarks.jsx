import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Sparkles } from "lucide-react";
import api from "../api/api";
import Loading from "../components/common/Loading";
import NewsCard from "../components/news/NewsCard";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/ui/EmptyState";

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBookmarks = async () => {
    setLoading(true);

    try {
      const { data } = await api.get("/bookmark");
      const payload = data.bookmarks || data.data || [];
      setBookmarks(Array.isArray(payload) ? payload : []);
      setError("");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Could not load your saved articles"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-[1200px]">
        <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
              <Sparkles size={12} />
              Saved
            </span>

            <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              My Bookmarks
            </h1>

            <p className="mt-1.5 text-sm text-muted">
              Articles you saved for later revision.
            </p>
          </div>

          {!loading && !error && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted">
              <Bookmark size={14} />
              {bookmarks.length} saved article
              {bookmarks.length === 1 ? "" : "s"}
            </span>
          )}
        </header>

        {error && <ErrorMessage message={error} onRetry={loadBookmarks} />}

        {loading ? (
          <Loading />
        ) : bookmarks.length ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {bookmarks.map((item) => (
              <NewsCard key={item._id} news={item.newsId || item} />
            ))}
          </div>
        ) : (
          !error && (
            <EmptyState
              icon={<Bookmark size={22} />}
              title="Nothing saved yet"
              text="Save any article while reading and it will show up here for quick revision."
              action={
                <Link
                  to="/news"
                  className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-primary px-5 text-sm font-semibold text-primary-fg transition duration-150 hover:brightness-110"
                >
                  Browse Current Affairs
                </Link>
              }
            />
          )
        )}
      </div>
    </div>
  );
}
