/**
 * Seven day streak strip.
 * days: array of { label, state, count }
 *   state: "done" (bg-streak) | "today" (dashed border-streak) | "none"
 */
export default function StreakStrip({ days = [], letters = true }) {
  return (
    <div className="flex items-end gap-2">
      {days.map((day, index) => (
        <div key={index} className="flex flex-col items-center gap-1.5">
          <span
            title={day.title}
            className={`grid h-7 w-7 place-items-center rounded-lg text-[11px] font-bold ${
              day.state === "done"
                ? "bg-streak text-white"
                : day.state === "today"
                  ? "border-2 border-dashed border-streak text-streak"
                  : "bg-line text-muted"
            }`}
          >
            {day.count || ""}
          </span>

          {letters && (
            <span className="text-[10px] font-semibold text-muted">
              {day.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
