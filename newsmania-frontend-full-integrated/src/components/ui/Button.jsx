import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary: "bg-primary text-primary-fg hover:brightness-110",
  outline:
    "border border-line bg-card text-ink hover:border-primary hover:text-primary",
  ghost: "border border-white/25 text-white hover:bg-white/10"
};

/**
 * The single button used across the app.
 * variant: primary | outline | ghost
 * iconOnly: 44x44 square for an icon-only control (give it an aria-label)
 */
export default function Button({
  variant = "primary",
  iconOnly = false,
  loading = false,
  className = "",
  children,
  type = "button",
  disabled = false,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={loading || disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-[10px] text-sm font-semibold transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed disabled:opacity-60 ${
        iconOnly ? "h-11 w-11" : "h-11 px-4"
      } ${VARIANTS[variant] || VARIANTS.primary} ${className}`}
      {...rest}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}
