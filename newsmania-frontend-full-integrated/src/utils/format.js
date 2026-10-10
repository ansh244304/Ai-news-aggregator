// Time aware greeting, used where no server greeting is available
export const getGreeting = (date = new Date()) => {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      hourCycle: "h23"
    }).format(date)
  );

  if (hour < 5) return "Good night";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 22) return "Good evening";

  return "Good night";
};

export const getFirstName = (name = "") =>
  (name || "").trim().split(" ")[0] || "there";

export const formatLongDate = (value) => {
  if (!value) return "";

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata"
  });
};

// Rough reading time, a minute per story
export const readingMinutes = (count = 0) =>
  Math.max(1, Math.round(count));

export const formatDuration = (seconds) => {
  const total = Math.max(0, Math.round(seconds || 0));
  const minutes = Math.floor(total / 60);
  const rest = total % 60;

  if (!minutes) return `${rest}s`;

  return `${minutes}m ${String(rest).padStart(2, "0")}s`;
};
