import { useEffect } from "react";

/**
 * Small transient confirmation, bottom center. Auto hides.
 * Pair with local state: <Toast open={show} message={msg} onClose={...} />
 */
export default function Toast({ open, message, onClose, duration = 2600 }) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(timer);
  }, [open, onClose, duration]);

  if (!open || !message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-[10px] bg-ink px-4 py-2.5 text-sm font-semibold text-bg shadow-lg"
    >
      {message}
    </div>
  );
}
