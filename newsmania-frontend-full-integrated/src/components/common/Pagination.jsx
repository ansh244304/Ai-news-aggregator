import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page = 1,
  totalPages = 1,
  onPageChange = () => {}
}) {
  if (totalPages <= 1) {
    return null;
  }

  const changePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) {
      return;
    }

    onPageChange(newPage);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const buttonClass =
    "inline-flex h-11 items-center gap-1 rounded-[10px] border border-line bg-card px-3.5 text-sm font-semibold text-ink transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex items-center justify-center gap-2"
    >
      <button
        type="button"
        onClick={() => changePage(page - 1)}
        disabled={page <= 1}
        className={buttonClass}
      >
        <ChevronLeft size={16} />
        Previous
      </button>

      <span className="px-3 text-sm font-semibold text-muted">
        Page {page} of {totalPages}
      </span>

      <button
        type="button"
        onClick={() => changePage(page + 1)}
        disabled={page >= totalPages}
        className={buttonClass}
      >
        Next
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
