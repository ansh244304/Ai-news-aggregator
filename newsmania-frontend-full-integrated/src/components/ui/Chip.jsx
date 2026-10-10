/**
 * A rounded filter pill. Announces its selected state with
 * aria-pressed, so selection never relies on colour alone.
 */
export default function Chip({
  selected = false,
  className = "",
  children,
  type = "button",
  ...rest
}) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={`inline-flex h-11 shrink-0 items-center rounded-full px-4 text-sm font-semibold transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
        selected
          ? "border border-ink bg-ink text-bg"
          : "border border-line bg-card text-ink hover:border-primary hover:text-primary"
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
