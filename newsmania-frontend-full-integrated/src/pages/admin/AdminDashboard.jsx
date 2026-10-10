import { useEffect, useState } from "react";
import api from "../../api/api";
import Loading from "../../components/common/Loading";
import StatCard from "../../components/ui/StatCard";

const STAT_LABELS = {
  totalUsers: "Users",
  totalNews: "News",
  totalMCQs: "MCQs",
  totalQuizAttempts: "Quiz Attempts",
  totalBookmarks: "Bookmarks",
  totalDailyQuizzes: "Daily Quizzes"
};

export default function AdminDashboard() {
  const [d, setD] = useState(null);

  useEffect(() => {
    api.get("/admin/dashboard").then(({ data }) => setD(data.data));
  }, []);

  if (!d) return <Loading />;

  const s = d.statistics || {};

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-6">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
            Admin
          </span>
          <h1 className="mt-1.5 font-display text-3xl font-extrabold tracking-tight text-ink">
            Dashboard
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {Object.entries(STAT_LABELS).map(([k, v]) => (
            <StatCard key={k} value={s[k] || 0} label={v} />
          ))}
        </div>
      </div>
    </div>
  );
}
