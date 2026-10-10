export default function Loading({ text = "Loading...", className = "" }) {
  return (
    <div
      role="status"
      className={`flex min-h-[240px] flex-col items-center justify-center gap-3 text-muted ${className}`}
    >
      <span className="h-7 w-7 animate-spin rounded-full border-[3px] border-line border-t-primary" />
      <span className="text-sm font-semibold">{text}</span>
    </div>
  );
}
