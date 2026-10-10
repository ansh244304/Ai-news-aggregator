export default function QuizQuestion({ number = 1 }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-5 sm:p-6">
      <div className="text-xs font-bold uppercase tracking-wide text-primary">
        Question {number} of 5
      </div>
      <h2 className="mt-2 font-display text-xl font-bold text-ink">
        What was the key announcement mentioned in the current affairs article?
      </h2>

      <div className="mt-4 grid gap-3">
        {["Option A", "Option B", "Option C", "Option D"].map((option) => (
          <label
            key={option}
            className="flex min-h-12 cursor-pointer items-center gap-3 rounded-[10px] border-2 border-line p-3.5 text-sm text-ink transition hover:border-primary"
          >
            <input type="radio" name={`q-${number}`} />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
