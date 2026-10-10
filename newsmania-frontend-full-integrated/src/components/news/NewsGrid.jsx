import { Newspaper } from "lucide-react";
import NewsCard from "./NewsCard";
import EmptyState from "../ui/EmptyState";

export default function NewsGrid({
  items = [],
  showMcqAction = false,
  emptyTitle = "No news found",
  emptyText = "Try another search or category."
}) {
  if (!items.length) {
    return (
      <EmptyState
        icon={<Newspaper size={22} />}
        title={emptyTitle}
        text={emptyText}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <NewsCard
          key={item._id || item.id}
          news={item}
          showMcqAction={showMcqAction}
        />
      ))}
    </div>
  );
}
