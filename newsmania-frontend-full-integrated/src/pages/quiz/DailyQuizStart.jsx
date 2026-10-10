import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Send,
  Timer
} from "lucide-react";
import api from "../../api/api";
import { formatDuration } from "../../utils/format";

export default function DailyQuizStart() {
  const { state } = useLocation();
  const nav = useNavigate();
  const quiz = state?.quiz;

  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!quiz) return;

    const timer = setInterval(() => setElapsed((value) => value + 1), 1000);

    return () => clearInterval(timer);
  }, [quiz]);

  const mcqs = useMemo(() => quiz?.mcqs || [], [quiz]);
  const answered = Object.keys(answers).length;
  const total = mcqs.length;
  const percent = total ? Math.round((answered / total) * 100) : 0;
  const complete = total > 0 && answered === total;

  const submit = async () => {
    setSubmitting(true);
    setError("");

    try {
      const { data } = await api.post("/quiz/daily/submit", {
        quizId: quiz._id,
        answers: Object.entries(answers).map(([mcqId, selectedAnswer]) => ({
          mcqId,
          selectedAnswer
        }))
      });

      nav("/quiz/result", {
        state: { ...(data.data || {}), timeTakenSeconds: elapsed }
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Could not submit the quiz. Please try again."
      );
      setSubmitting(false);
    }
  };

  if (!quiz) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-line bg-card p-8 text-center">
          <h2 className="font-display text-xl font-bold text-ink">
            No quiz selected
          </h2>

          <p className="mt-2 text-sm text-muted">
            Open today&apos;s daily quiz first.
          </p>

          <Link
            to="/daily-quiz"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-[10px] bg-primary px-5 text-sm font-semibold text-primary-fg transition duration-150 hover:brightness-110"
          >
            <ArrowLeft size={15} />
            Back to Daily Quiz
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl">
        {/* ================= HEADER ================= */}

        <div className="mb-5">
          <Link
            to="/daily-quiz"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition duration-150 hover:text-primary"
          >
            <ArrowLeft size={15} />
            Daily Quiz
          </Link>

          <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {quiz.title}
          </h1>

          <p className="mt-1.5 text-sm text-muted">
            {total} questions &middot; {answered} answered
          </p>
        </div>

        {/* ================= PROGRESS ================= */}

        <div className="sticky top-16 z-20 -mx-4 mb-6 border-y border-line bg-bg/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <div className="mb-2 flex items-center justify-between text-xs font-bold">
              <span className="text-muted">Progress</span>

              <span className="inline-flex items-center gap-3">
                <span className="inline-flex items-center gap-1 text-muted">
                  <Timer size={13} />
                  {formatDuration(elapsed)}
                </span>

                <span className="text-primary">
                  {answered}/{total}
                </span>
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-[14px] border border-danger/40 bg-danger/10 px-4 py-3 text-sm font-medium text-danger"
          >
            {error}
          </div>
        )}

        {/* ================= QUESTIONS ================= */}

        <ol className="space-y-4">
          {mcqs.map((question, index) => (
            <li key={question._id}>
              <fieldset className="rounded-2xl border border-line bg-card p-5 sm:p-6">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
                    Question {index + 1}
                  </span>

                  {question.difficulty && (
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        question.difficulty.toLowerCase() === "easy"
                          ? "bg-success/10 text-success"
                          : question.difficulty.toLowerCase() === "hard"
                            ? "bg-danger/10 text-danger"
                            : "bg-primary-soft text-primary"
                      }`}
                    >
                      {question.difficulty}
                    </span>
                  )}

                  {answers[question._id] && (
                    <CheckCircle2
                      size={16}
                      className="ml-auto text-success"
                    />
                  )}
                </div>

                <legend className="mb-4 text-base font-bold leading-6 text-ink">
                  {question.question}
                </legend>

                <div className="space-y-2">
                  {question.options.map((option) => {
                    const selected = answers[question._id] === option;

                    return (
                      <label
                        key={option}
                        className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-[10px] border p-3.5 text-sm transition duration-150 ${
                          selected
                            ? "border-primary bg-primary-soft text-primary"
                            : "border-line text-ink hover:border-primary"
                        }`}
                      >
                        <input
                          type="radio"
                          name={question._id}
                          className="h-4 w-4 accent-[rgb(var(--primary))]"
                          checked={selected}
                          onChange={() =>
                            setAnswers((current) => ({
                              ...current,
                              [question._id]: option
                            }))
                          }
                        />

                        <span className="font-medium">{option}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </li>
          ))}
        </ol>

        {/* ================= SUBMIT ================= */}

        <div className="sticky bottom-0 -mx-4 mt-6 border-t border-line bg-bg/90 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
          <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-semibold text-muted">
              {complete
                ? "All questions answered. Ready to submit."
                : `${total - answered} question${
                    total - answered === 1 ? "" : "s"
                  } left.`}
            </p>

            <button
              type="button"
              onClick={submit}
              disabled={submitting || !complete}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[10px] bg-primary px-5 text-sm font-semibold text-primary-fg transition duration-150 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={15} />
              )}
              {submitting
                ? "Submitting..."
                : `Submit Daily Quiz (${answered}/${total})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
