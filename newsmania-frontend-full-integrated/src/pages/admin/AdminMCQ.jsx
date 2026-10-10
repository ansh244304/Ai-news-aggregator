import { useEffect, useState } from "react";
import api from "../../api/api";

const inputClass =
  "h-11 w-full rounded-[10px] border border-line bg-bg px-3 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25";

const labelClass =
  "mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted";

export default function AdminMCQ() {
  const [n, setN] = useState([]);
  const [id, setId] = useState("");
  const [q, setQ] = useState([]);
  const [num, setNum] = useState(5);
  const [difficulty, setDifficulty] = useState("Medium");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    api
      .get("/news", { params: { page: 1, limit: 100 } })
      .then(({ data }) => setN(data.news || data.data || []))
      .catch(() => setN([]));
  }, []);

  const load = () =>
    id &&
    api
      .get(`/mcq/news/${id}`)
      .then(({ data }) => setQ(data.data?.mcqs || []));

  const gen = async () => {
    setBusy(true);
    setErr("");

    try {
      await api.post(`/mcq/news/${id}/generate`, {
        numberOfQuestions: num,
        difficulty,
        regenerate: true
      });

      await load();
    } catch (x) {
      setErr(x.response?.data?.message || "Could not generate MCQs.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-[1200px]">
        <h1 className="mb-6 font-display text-3xl font-extrabold tracking-tight text-ink">
          MCQ Generator
        </h1>

        <div className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-card p-5 sm:grid-cols-3 sm:p-6">
          <label className="block sm:col-span-3">
            <span className={labelClass}>News</span>
            <select
              value={id}
              onChange={(e) => {
                setId(e.target.value);
                setQ([]);
              }}
              className={inputClass}
            >
              <option value="">Select news</option>
              {n.map((x) => (
                <option key={x._id} value={x._id}>
                  {x.title.slice(0, 70)}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className={labelClass}>Questions</span>
            <input
              type="number"
              min="1"
              max="10"
              value={num}
              onChange={(e) => setNum(+e.target.value)}
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className={labelClass}>Difficulty</span>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className={inputClass}
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </label>

          <div className="flex items-end">
            <button
              type="button"
              className="inline-flex h-11 w-full items-center justify-center rounded-[10px] bg-primary px-4 text-sm font-semibold text-primary-fg transition duration-150 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!id || busy}
              onClick={gen}
            >
              {busy ? "Generating..." : "Generate MCQs"}
            </button>
          </div>
        </div>

        {err && (
          <div
            role="alert"
            className="mt-4 rounded-[14px] border border-danger/40 bg-danger/10 px-4 py-3 text-sm font-medium text-danger"
          >
            {err}
          </div>
        )}

        <div className="mt-5 space-y-4">
          {q.map((x, i) => (
            <div
              className="rounded-2xl border border-line bg-card p-5"
              key={x._id}
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
                  Question {i + 1}
                </span>

                {x.difficulty && (
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      x.difficulty.toLowerCase() === "easy"
                        ? "bg-success/10 text-success"
                        : x.difficulty.toLowerCase() === "hard"
                          ? "bg-danger/10 text-danger"
                          : "bg-primary-soft text-primary"
                    }`}
                  >
                    {x.difficulty}
                  </span>
                )}
              </div>

              <h3 className="font-bold leading-6 text-ink">{x.question}</h3>

              <div className="mt-3 space-y-2">
                {x.options.map((o) => (
                  <div
                    className="rounded-[10px] border border-line bg-bg px-3.5 py-2.5 text-sm text-ink"
                    key={o}
                  >
                    {o}
                  </div>
                ))}
              </div>

              <p className="mt-3 text-sm text-muted">{x.explanation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
