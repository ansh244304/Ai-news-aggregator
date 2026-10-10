import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Sparkles } from "lucide-react";
import api from "../../api/api";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/ui/EmptyState";
import ProgressBar from "../../components/ui/ProgressBar";

export default function Quiz() {
  const { newsId } = useParams();
  const nav = useNavigate();

  const [q, setQ] = useState([]);
  const [i, setI] = useState(0);
  const [a, setA] = useState({});
  const [load, setLoad] = useState(true);
  const [sub, setSub] = useState(false);
  const [gen, setGen] = useState(false);
  const [genErr, setGenErr] = useState("");

  const startedAt = useRef(Date.now());

  const loadMCQs = async () => {
    const { data } = await api.get(`/mcq/news/${newsId}`);
    setQ(data.data?.mcqs || []);
  };

  useEffect(() => {
    setLoad(true);
    startedAt.current = Date.now();

    api
      .get(`/mcq/news/${newsId}`)
      .then(({ data }) => setQ(data.data?.mcqs || []))
      .catch(() => setQ([]))
      .finally(() => setLoad(false));
  }, [newsId]);

  const generate = async () => {
    setGen(true);
    setGenErr("");

    try {
      await api.post(`/mcq/news/${newsId}/generate`, {
        numberOfQuestions: 5,
        regenerate: true
      });

      await loadMCQs();
      setI(0);
      setA({});
      startedAt.current = Date.now();
    } catch (x) {
      setGenErr(
        x.response?.data?.message ||
          "Could not generate questions for this article."
      );
    } finally {
      setGen(false);
    }
  };

  if (load) {
    return <Loading />;
  }

  if (!q.length) {
    return (
      <div className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
              Quiz
            </span>
            <h1 className="mt-1.5 font-display text-3xl font-extrabold tracking-tight text-ink">
              Test Yourself
            </h1>
          </div>

          <EmptyState
            icon={<Sparkles size={22} />}
            title="No questions yet"
            text="No questions exist for this article yet. Generate a fresh set from the article."
            action={
              <div className="flex flex-col items-center gap-3">
                {genErr && (
                  <p className="text-sm font-medium text-danger">
                    {genErr}
                  </p>
                )}

                <button
                  type="button"
                  onClick={generate}
                  disabled={gen}
                  className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-primary px-5 text-sm font-semibold text-primary-fg transition duration-150 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Sparkles size={16} />
                  {gen
                    ? "Generating from this article..."
                    : "Generate 5 questions from this article"}
                </button>
              </div>
            }
          />
        </div>
      </div>
    );
  }

  const x = q[i];

  const submit = async () => {
    setSub(true);

    try {
      const { data } = await api.post("/quiz/submit", {
        newsId,
        answers: Object.entries(a).map(([mcqId, selectedAnswer]) => ({
          mcqId,
          selectedAnswer
        }))
      });

      nav("/quiz/result", {
        state: {
          ...(data.data || {}),
          timeTakenSeconds: Math.round(
            (Date.now() - startedAt.current) / 1000
          )
        }
      });
    } catch (x2) {
      setGenErr(
        x2.response?.data?.message || "Could not submit the quiz."
      );
    } finally {
      setSub(false);
    }
  };

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-5">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
            Quiz
          </span>
          <h1 className="mt-1.5 font-display text-3xl font-extrabold tracking-tight text-ink">
            Test Yourself
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Question {i + 1} of {q.length}
          </p>
        </div>

        <ProgressBar value={((i + 1) / q.length) * 100} className="mb-5" />

        {genErr && (
          <div
            role="alert"
            className="mb-4 rounded-[14px] border border-danger/40 bg-danger/10 px-4 py-3 text-sm font-medium text-danger"
          >
            {genErr}
          </div>
        )}

        <div className="rounded-2xl border border-line bg-card p-5 sm:p-6">
          {x.difficulty && (
            <span
              className={`mb-3 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
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

          <h2 className="text-base font-bold leading-6 text-ink">
            {x.question}
          </h2>

          <div className="mt-4 space-y-2">
            {x.options.map((o) => {
              const selected = a[x._id] === o;

              return (
                <label
                  key={o}
                  className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-[10px] border p-3.5 text-sm transition duration-150 ${
                    selected
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-line text-ink hover:border-primary"
                  }`}
                >
                  <input
                    type="radio"
                    name={x._id}
                    className="h-4 w-4 accent-[rgb(var(--primary))]"
                    checked={selected}
                    onChange={() => setA({ ...a, [x._id]: o })}
                  />
                  <span className="font-medium">{o}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={!i}
            onClick={() => setI(i - 1)}
            className="inline-flex h-11 items-center rounded-[10px] border border-line bg-card px-4 text-sm font-semibold text-ink transition duration-150 hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          {i < q.length - 1 ? (
            <button
              type="button"
              onClick={() => setI(i + 1)}
              className="inline-flex h-11 items-center rounded-[10px] bg-primary px-4 text-sm font-semibold text-primary-fg transition duration-150 hover:brightness-110"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              disabled={sub || Object.keys(a).length === 0}
              onClick={submit}
              className="inline-flex h-11 items-center rounded-[10px] bg-primary px-4 text-sm font-semibold text-primary-fg transition duration-150 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sub ? "Submitting..." : "Submit Quiz"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
