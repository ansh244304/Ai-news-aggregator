import StreakStrip from "../ui/StreakStrip";

const dayInitial = (daysAgo) => {
  const date = new Date();

  date.setDate(date.getDate() - daysAgo);

  return date
    .toLocaleDateString("en-US", { weekday: "short" })
    .charAt(0);
};

export default function WeekStrip({
  current = 0,
  status = "none",
  activity = null
}) {
  // Activity mode: how many quizzes were attempted each day
  if (Array.isArray(activity)) {
    const days = Array.from({ length: 7 }, (_, index) => {
      const daysAgo = 6 - index;
      const count = activity[index] || 0;
      const isToday = daysAgo === 0;

      return {
        label: dayInitial(daysAgo),
        count,
        title: `${count} quiz${count === 1 ? "" : "zes"}`,
        state: count ? "done" : isToday ? "today" : "none"
      };
    });

    return <StreakStrip days={days} />;
  }

  // Streak mode: which of the last seven days are lit
  const days = Array.from({ length: 7 }, (_, index) => {
    const daysAgo = 6 - index;
    const isToday = daysAgo === 0;

    let state = "none";

    if (isToday) {
      state = status === "secured" ? "done" : "today";
    } else if (current > daysAgo) {
      state = "done";
    }

    return {
      label: dayInitial(daysAgo),
      title: isToday ? "Today" : undefined,
      state
    };
  });

  return <StreakStrip days={days} />;
}
