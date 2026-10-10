export default function EmptyState({
  icon,
  title = "Nothing here yet",
  text,
  action,
  className = ""
}) {
  return (
    <div
      className={`rounded-2xl border border-line bg-card p-10 text-center ${className}`}
    >
      {icon && (
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-primary-soft text-primary">
          {icon}
        </div>
      )}

      <h3 className="font-display text-lg font-bold text-ink">{title}</h3>

      {text && (
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted">{text}</p>
      )}

      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
