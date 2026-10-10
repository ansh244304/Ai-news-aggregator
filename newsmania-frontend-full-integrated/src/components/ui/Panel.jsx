/**
 * A card-like surface for dashboard blocks and side widgets.
 */
export default function Panel({ className = "", children, ...rest }) {
  return (
    <div
      className={`rounded-2xl border border-line bg-card p-5 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
