import { useEffect, useState } from "react";
import api from "../../api/api";

const inputClass =
  "h-11 w-full rounded-[10px] border border-line bg-bg px-3 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25";

const labelClass =
  "mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted";

export default function AdminDailyQuiz() {
  const [q, setQ] = useState(null);
  const [n, setN] = useState(10);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => {
    api
      .get("/daily-quiz/today")
      .then(({ data }) => {
        setQ(data.data);
        setErr("");
      })
      .catch((e) => {
        setQ(null);
        setErr(
          e.response?.data?.message || "Could not load today's daily quiz"
        );
      });
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    setBusy(true);
    setErr("");

    try {
      await api.post("/daily-quiz/create", { numberOfQuestions: n });
      load();
    } catch (e) {
      setErr(e.response?.data?.message || "Could not create the daily quiz");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 font-display text-3xl font-extrabold tracking-tight text-ink">
          Daily Quiz
        </h1>

        <div className="rounded-2xl border border-line bg-card p-5 sm:p-6">
          <label className="block max-w-xs">
            <span className={labelClass}>Number of Questions</span>
            <input
              type="number"
              min="1"
              max="50"
              value={n}
              onChange={(e) => setN(+e.target.value)}
              className={inputClass}
            />
          </label>

          <button
            type="button"
            onClick={create}
            disabled={busy}
            className="mt-4 inline-flex h-11 items-center rounded-[10px] bg-primary px-5 text-sm font-semibold text-primary-fg transition duration-150 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "Creating..." : "Create Daily Quiz"}
          </button>
        </div>

        {err && (
          <div
            role="alert"
            className="mt-4 rounded-[14px] border border-danger/40 bg-danger/10 px-4 py-3 text-sm font-medium text-danger"
          >
            {err}
          </div>
        )}

        {q && (
          <div className="mt-5 rounded-2xl border border-line bg-card p-5 sm:p-6">
            <h2 className="font-display text-lg font-bold text-ink">
              {q.title}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {q.totalQuestions} questions
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
