import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, Newspaper, RefreshCw } from "lucide-react";
import api from "../../api/api";
import NewsCard from "../../components/news/NewsCard";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import CategoryFilter, {
  CATEGORIES
} from "../../components/news/CategoryFilter";
import Chip from "../../components/ui/Chip";
import EmptyState from "../../components/ui/EmptyState";

const LIMIT = 12;

const SOURCES = [
  { key: "all", label: "All Sources" },
  { key: "news", label: "News API" },
  { key: "PIB", label: "PIB" }
];

function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState("");

  const [source, setSource] = useState("all");
  const [category, setCategory] = useState("");
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchNews = async (pageNumber = 1, options = {}) => {
    const {
      sourceFilter = source,
      categoryFilter = category,
      searchTerm = search
    } = options;

    try {
      setLoading(true);
      setError("");

      const response = await api.get("/news", {
        params: {
          page: pageNumber,
          limit: LIMIT,
          ...(sourceFilter && sourceFilter !== "all"
            ? { source: sourceFilter }
            : {}),
          ...(categoryFilter ? { category: categoryFilter } : {}),
          ...(searchTerm ? { search: searchTerm } : {})
        }
      });

      setNews(response.data.news || []);
      setTotalPages(Math.max(1, response.data.totalPages || 1));
      setTotal(response.data.total || 0);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Failed to load news"
      );
    } finally {
      setLoading(false);
    }
  };

  const refreshNews = async () => {
    if (refreshing) return;

    setRefreshing(true);
    setRefreshError("");

    try {
      await api.get("/news/fetch/newsapi", {
        params: { query: "India", max: 10 }
      });
    } catch (requestError) {
      setRefreshError("Failed to fetch latest news. Please try again.");
      setRefreshing(false);
      return;
    }

    try {
      await fetchNews(1);
      setRefreshError("");
    } catch {
      setRefreshError(
        "News was fetched, but the latest articles could not be loaded."
      );
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchNews(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, category]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchNews(1);
    }, 350);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const urlSearch = searchParams.get("search") || "";

  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  const goToPage = (nextPage) => {
    setPage(nextPage);
    fetchNews(nextPage);
  };

  if (loading && !news.length) {
    return (
      <div className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-6 space-y-3">
            <div className="h-4 w-24 animate-pulse rounded bg-line" />
            <div className="h-9 w-64 animate-pulse rounded bg-line" />
            <div className="h-4 w-80 max-w-full animate-pulse rounded bg-line" />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-[14px] bg-line"
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
          <h2 className="font-display text-xl font-bold text-ink">
            Unable to load news
          </h2>

          <p className="mt-2 text-sm text-muted">{error}</p>

          <button
            type="button"
            onClick={() => fetchNews(1)}
            className="mt-6 inline-flex h-11 items-center rounded-[10px] bg-primary px-5 text-sm font-semibold text-primary-fg transition duration-150 hover:brightness-110"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-[1200px]">
        {/* ================= HEADER ================= */}

        <div className="mb-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
              Newsmania
            </span>

            <h1 className="mt-1.5 font-display text-3xl font-extrabold tracking-tight text-ink">
              Current Affairs
            </h1>

            <p className="mt-1.5 text-sm text-muted">
              Stay updated with important current affairs for competitive
              examinations.
            </p>
          </div>

          <button
            type="button"
            onClick={refreshNews}
            disabled={refreshing}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-primary px-4 text-sm font-semibold text-primary-fg transition duration-150 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {refreshing ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <RefreshCw size={16} />
            )}
            {refreshing ? "Fetching..." : "Refresh News"}
          </button>
        </div>

        {/* ================= FILTERS ================= */}

        <div className="mb-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            onSubmit={() => {
              setPage(1);
              fetchNews(1);
            }}
          />
        </div>

        <div className="mb-4 overflow-x-auto">
          <CategoryFilter
            categories={CATEGORIES}
            value={category}
            onChange={setCategory}
          />
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {SOURCES.map((item) => (
              <Chip
                key={item.key}
                selected={source === item.key}
                onClick={() => setSource(item.key)}
              >
                {item.label}
              </Chip>
            ))}
          </div>

          <span className="text-xs font-semibold text-muted">
            {total} article{total === 1 ? "" : "s"}
          </span>
        </div>

        {refreshError && (
          <div
            role="alert"
            className="mb-6 rounded-[14px] border border-danger/40 bg-danger/10 px-4 py-3 text-sm font-medium text-danger"
          >
            {refreshError}
          </div>
        )}

        {/* ================= GRID ================= */}

        {news.length === 0 ? (
          <EmptyState
            icon={<Newspaper size={22} />}
            title="No news available"
            text="Try another search, or fetch some news from the backend first."
          />
        ) : (
          <>
            <div
              className={`grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 ${
                loading ? "opacity-60 transition" : ""
              }`}
            >
              {news.map((item) => (
                <NewsCard key={item._id} news={item} />
              ))}
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default News;
