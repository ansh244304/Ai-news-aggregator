export default function QuizResult() {
  return (
    <div className="rounded-2xl border border-line bg-card p-6 text-center">
      <div className="mx-auto grid h-32 w-32 place-items-center rounded-full bg-primary-soft font-display text-3xl font-bold text-primary">
        80%
      </div>

      <h2 className="mt-4 font-display text-xl font-bold text-ink">
        Great work!
      </h2>

      <p className="mt-1 text-sm text-muted">
        You answered 8 out of 10 questions correctly.
      </p>

      <div className="mt-5 grid grid-cols-3 divide-x divide-line border-t border-line pt-5">
        <div>
          <strong className="block font-display text-lg font-bold text-ink">
            8
          </strong>
          <span className="text-xs text-muted">Correct</span>
        </div>
        <div>
          <strong className="block font-display text-lg font-bold text-ink">
            2
          </strong>
          <span className="text-xs text-muted">Incorrect</span>
        </div>
        <div>
          <strong className="block font-display text-lg font-bold text-ink">
            10
          </strong>
          <span className="text-xs text-muted">Total</span>
        </div>
      </div>
    </div>
  );
}
