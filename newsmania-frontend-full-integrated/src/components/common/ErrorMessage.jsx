export default function ErrorMessage({
  message = "Something went wrong. Please try again.",
  onRetry
}) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-[14px] border border-danger/40 bg-danger/10 p-4 text-sm font-medium text-danger sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <strong className="block font-bold">Something went wrong</strong>
        <p className="mt-0.5">{message}</p>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-[10px] border border-danger/50 px-4 text-xs font-bold text-danger transition hover:bg-danger/15"
        >
          Try again
        </button>
      )}
    </div>
  );
}
