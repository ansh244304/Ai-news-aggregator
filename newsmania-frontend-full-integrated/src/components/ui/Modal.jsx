import { useEffect, useRef } from "react";
import { X } from "lucide-react";

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

/**
 * Centered dialog. Closes on Escape and on an outside click,
 * moves focus inside on open and back to the trigger on close.
 */
export default function Modal({ open, onClose, title, children, footer }) {
  const dialogRef = useRef(null);
  const titleId = "modal-title";
  const lastFocused = useRef(null);

  useEffect(() => {
    if (!open) return;

    lastFocused.current = document.activeElement;
    document.body.style.overflow = "hidden";

    const onKey = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose?.();
        return;
      }

      if (event.key === "Tab" && dialogRef.current) {
        const nodes = dialogRef.current.querySelectorAll(FOCUSABLE);
        if (!nodes.length) return;

        const first = nodes[0];
        const last = nodes[nodes.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);

    const timer = setTimeout(() => {
      const node = dialogRef.current?.querySelector(FOCUSABLE);
      (node || dialogRef.current)?.focus();
    }, 0);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      clearTimeout(timer);
      lastFocused.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : "Dialog"}
        tabIndex={-1}
        className="max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-2xl bg-card p-6 shadow-2xl focus:outline-none"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          {title && (
            <h2
              id={titleId}
              className="font-display text-xl font-bold text-ink"
            >
              {title}
            </h2>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="ml-auto grid h-11 w-11 shrink-0 place-items-center rounded-[10px] text-muted transition hover:bg-primary-soft hover:text-primary"
          >
            <X size={18} />
          </button>
        </div>

        {children}

        {footer && (
          <div className="mt-5 flex justify-end gap-2">{footer}</div>
        )}
      </div>
    </div>
  );
}
